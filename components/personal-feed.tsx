"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	orderBy,
} from "firebase/firestore";
import { db } from "@/firebase"; 
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";

interface Post {
	id: string;
	postType: string;
	gratefulFor?: string;
	because?: string;
	content: string;
	audience: string;
	uid: string;
	timestamp: Date;
}

const PersonalFeed = () => {
	const [posts, setPosts] = useState<Post[]>([]); 
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setCurrentUser(user);
				await fetchUserPosts(user.uid);
			} else {
			}
		});
		return () => unsubscribe();
	}, []);

	const fetchUserPosts = async (uid: string) => {
		setLoading(true);
		try {
			const postsRef = collection(db, "posts");
			const q = query(
				postsRef,
				where("uid", "==", uid), 
				orderBy("timestamp", "desc") 
			);
			const querySnapshot = await getDocs(q);

			const postsList = querySnapshot.docs.map((docSnapshot) => {
				const postData = docSnapshot.data() as Post;
				return {
					...postData,
					id: docSnapshot.id,
				};
			});

			setPosts(postsList);
		} catch (error) {
			setError("Error fetching personal posts.");
			console.error(error);
		}
		setLoading(false);
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	if (posts.length === 0) {
		return <p>No posts available.</p>;
	}

	const RelativeTime: React.FC<{ post: Post }> = ({ post }) => {
		const getRelativeTime = (timestamp: Timestamp) => {
			const date = timestamp.toDate();
			return formatDistanceToNow(date, { addSuffix: true });
		};

		return (
			<span
				title={format(
					(post.timestamp as unknown as Timestamp).toDate(),
					"MMMM d, yyyy h:mm:ss aa"
				)}
			>
				{getRelativeTime(post.timestamp as unknown as Timestamp)}
			</span>
		);
	};

	return (
		<div>
			<ul className="h-full pb-[4rem]">
				{posts.map((post) => (
					<li key={post.id} className="py-4 border-b">
						<div className="mb-2">
							<div className="w-full flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Image
										src={
											currentUser?.photoURL ||
											"https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
										}
										alt={currentUser?.displayName || "User"}
										width={100}
										height={100}
										className="w-10 h-10 rounded-full"
									/>
									<div>
										<h3 className="text-lg font-medium capitalize">
											{currentUser?.displayName || "User"}
										</h3>
										<p className="text-xs text-slate-500">
											Posted <RelativeTime post={post} />
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
							<div className="ml-12 mt-1 text-sm md:text-base">
								{post.postType === "gratitude" && (
									<p>{post.because}</p>
								)}
								<p>{post.content}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PersonalFeed;
