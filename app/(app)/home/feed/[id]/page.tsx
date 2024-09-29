"use client";

import React, { useEffect, useState } from "react";
import {
	doc,
	getDoc,
	collection,
	query,
	orderBy,
	onSnapshot,
	addDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Post {
	id: string;
	postType: string;
	gratefulFor?: string;
	because?: string;
	content: string;
	uid: string;
	timestamp: Date;
}

interface User {
	displayName: string;
	photoURL: string;
}

interface Comment {
	id: string;
	uid: string;
	content: string;
	timestamp: Timestamp;
	user: { displayName: string; photoURL: string };
}

const PostDetail = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [post, setPost] = useState<Post | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [postUser, setPostUser] = useState<User | null>(null);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);

	// Fetch post details
	const fetchPost = async () => {
		const postRef = doc(db, "posts", id);
		const postSnap = await getDoc(postRef);
		if (postSnap.exists()) {
			const postData = postSnap.data() as Post;
			setPost(postData);
			// Fetch user details once post is retrieved
			const postUser = await fetchUserDetails(postData.uid);
			setPostUser(postUser);
		}
	};

	// Fetch user details from Firestore based on uid
	const fetchUserDetails = async (uid: string): Promise<User | null> => {
		const userRef = doc(db, "users", uid);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			const userData = userSnap.data() as User;
			setUser(userData);
			return userData;
		}
		return null;
	};

	// Fetch comments in real-time
	const fetchComments = () => {
		const commentsRef = collection(db, "posts", id, "comments");
		const q = query(commentsRef, orderBy("timestamp", "desc"));

		const unsubscribe = onSnapshot(q, async (snapshot) => {
			const commentsList: Comment[] = await Promise.all(
				snapshot.docs.map(async (docSnapshot) => {
					const commentData = docSnapshot.data() as Comment;
					const userDetails = await fetchUserDetails(commentData.uid);

					return {
						...commentData,
						id: docSnapshot.id,
						user: userDetails
							? {
									displayName: userDetails.displayName,
									photoURL: userDetails.photoURL,
							  }
							: { displayName: "Unknown User", photoURL: "" },
					};
				})
			);
			setComments(commentsList);
		});

		return () => unsubscribe();
	};

	useEffect(() => {
		fetchPost();
		const unsubscribeComments = fetchComments();
		return () => unsubscribeComments();
	}, [id]);

	// Handle comment submission
	const handleCommentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const auth = getAuth();
		const user = auth.currentUser;
		if (user) {
			const commentsRef = collection(db, "posts", id, "comments");
			await addDoc(commentsRef, {
				uid: user.uid,
				content: comment,
				timestamp: Timestamp.now(),
			});
			setComment("");
		}
	};

	if (!post || !user) {
		return <p>Loading post...</p>;
	}

	const RelativeTime: React.FC<{ timestamp: Timestamp }> = ({
		timestamp,
	}) => {
		const getRelativeTime = (timestamp: Timestamp) => {
			const date = timestamp.toDate();
			return formatDistanceToNow(date, { addSuffix: true });
		};

		return (
			<span title={format(timestamp.toDate(), "MMMM d, yyyy h:mm:ss aa")}>
				{getRelativeTime(timestamp)}
			</span>
		);
	};

	return (
		<div className="py-4">
			<div className="sticky top-20 bg-background">
				<div
					key={post.id}
					className="border rounded-lg overflow-hidden"
				>
					<div className="mb-2">
						<div className="w-full border-b flex items-center bg-slate-50 px-4 py-2 justify-between">
							<div className="flex items-center gap-2">
								{postUser && (
									<Image
										src={postUser.photoURL}
										alt={postUser.displayName}
										width={100}
										height={100}
										className="w-10 h-10 rounded-full"
									/>
								)}
								<div>
									<h3 className="text-lg font-medium capitalize">
										{user?.displayName}
									</h3>
									<p className="text-xs text-slate-500">
										Posted{" "}
										<RelativeTime
											timestamp={
												post.timestamp as unknown as Timestamp
											}
										/>
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
						<div className="text-sm md:text-base px-4 pt-2 pb-1">
							{post.postType === "gratitude" && (
								<p>{post.because}</p>
							)}
							<p>{post.content}</p>
						</div>
					</div>
				</div>
				<form
					onSubmit={handleCommentSubmit}
					className="mt-4 w-full flex flex-col"
				>
					<Input
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Add a comment"
						className="border p-2 w-full"
					/>
					<Button type="submit" className="mt-2 ml-auto">
						Submit
					</Button>
				</form>
			</div>
			<div className="mt-4">
				{comments.length === 0 ? (
					<p>No comments yet.</p>
				) : (
					<ul className="pb-8">
						{comments.map((comment) => (
							<li key={comment.id} className="my-4 p-4 border-b">
								<div className="flex items-center gap-2">
									{comment.user.photoURL && (
										<Image
											src={comment.user.photoURL}
											alt={comment.user.displayName}
											width={40}
											height={40}
											className="w-10 h-10 rounded-full"
										/>
									)}
									<div>
										<p className="font-semibold">
											{comment.user.displayName}
										</p>
										<p className="text-xs text-slate-500">
											{comment.timestamp
												.toDate()
												.toLocaleString()}
										</p>
									</div>
								</div>
								<p className="mt-2">{comment.content}</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default PostDetail;
