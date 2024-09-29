"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
	collection,
	query,
	where,
	onSnapshot,
	doc,
	getDoc,
	Timestamp,
	orderBy,
} from "firebase/firestore";
import { db } from "@/firebase"; // Make sure you have Firebase initialized
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation"; // Import the router for navigation
import { MessageSquareHeart } from "lucide-react";
import { Button } from "./ui/button";

interface Post {
	id: string;
	postType: string;
	gratefulFor?: string;
	because?: string;
	content: string;
	audience: string;
	uid: string; // User ID of who posted
	timestamp: Date;
}

const PostsFeed = () => {
	const [posts, setPosts] = useState<(Post & { user: User })[]>([]); // Posts with user details
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const router = useRouter(); // Initialize router

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchFriendsAndPosts(user.uid);
			} else {
				// Handle signed-out state if needed
			}
		});
		return () => unsubscribe();
	}, []);

	const fetchUserDetails = async (uid: string): Promise<User | null> => {
		try {
			const userRef = doc(db, "users", uid);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				return { uid, ...userSnap.data() } as User; // Return the user data along with UID
			}
			return null;
		} catch (error) {
			console.error("Error fetching user details:", error);
			return null;
		}
	};

	const fetchFriendsAndPosts = (uid: string) => {
		setLoading(true);
		try {
			// Fetch the logged-in user's friends
			const userRef = doc(db, "users", uid);
			getDoc(userRef).then(async (userSnap) => {
				const userData = userSnap.data();
				const userFriends = userData?.friends || [];

				// Listen for real-time updates on posts
				const postsRef = collection(db, "posts");
				const q = query(
					postsRef,
					where("audience", "in", ["public", "friends"]),
					orderBy("timestamp", "desc")
				);
				const unsubscribe = onSnapshot(q, async (querySnapshot) => {
					const postsList = await Promise.all(
						querySnapshot.docs.map(async (docSnapshot) => {
							const postData = docSnapshot.data() as Post;
							const user = await fetchUserDetails(postData.uid); // Fetch user details
							return {
								...postData,
								id: docSnapshot.id,
								user: user!,
							};
						})
					);

					// Filter the posts that are either public or from friends
					const filteredPosts = postsList.filter(
						(post) =>
							post.audience === "public" ||
							userFriends.includes(post.uid) ||
							post.uid === uid
					);

					setPosts(filteredPosts);
					setLoading(false); // Set loading to false after fetching posts
				});

				// Cleanup function to unsubscribe from the snapshot listener
				return () => unsubscribe();
			});
		} catch (error) {
			setError("Error fetching posts.");
			console.error(error);
			setLoading(false);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	const RelativeTime: React.FC<{ post: Post }> = ({ post }) => {
		const getRelativeTime = (timestamp: Timestamp) => {
			const date = timestamp.toDate();
			return formatDistanceToNow(date, { addSuffix: true });
		};

		return (
			<span
				title={format(
					(post?.timestamp as unknown as Timestamp).toDate(),
					"MMMM d, yyyy h:mm:ss aa"
				)}
			>
				{getRelativeTime(post?.timestamp as unknown as Timestamp)}
			</span>
		);
	};

	return (
		<div>
			{posts.length === 0 ? (
				<p>No posts available.</p>
			) : (
				<ul className="h-full pb-[4rem] pt-4 flex flex-col gap-4">
					{posts.map((post) => (
						<li key={post.id} className="border rounded-lg overflow-hidden">
							<div className="mb-2">
								<div className="w-full border-b flex items-center bg-slate-50 px-4 py-2 justify-between">
									<div className="flex items-center gap-2">
										<Image
											src={post.user.photoURL!}
											alt={post.user.displayName!}
											width={100}
											height={100}
											className="w-10 h-10 rounded-full"
										/>
										<div>
											<h3 className="text-lg font-medium capitalize">
												{post.user.displayName}
											</h3>
											<p className="text-xs text-slate-500">
												Posted{" "}
												<RelativeTime post={post} />
											</p>
										</div>
									</div>
									<h3 className="font-medium text-xs md:text-sm">
										{post.postType === "gratitude"
											? `is grateful for ${post.gratefulFor}`
											: post.postType === "journal"
											? "made a journal entry"
											: "shared a story"}
									</h3>
								</div>
								<div className="text-sm md:text-base px-4 py-2">
									{post.postType === "gratitude" && (
										<p>{post.because}</p>
									)}
									<p>{post.content}</p>
								</div>
								<div className="text-right px-4 py-2">
									<Button
										variant={"link"}
										size={"icon"}
										onClick={() =>
											router.push(`/home/feed/${post.id}`)
										}
									>
										<MessageSquareHeart />
									</Button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PostsFeed;
