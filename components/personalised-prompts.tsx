"use client";
import { auth, db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const GratitudePrompts = () => {
	const [promptAndChallenge, setPromptAndChallenge] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	// Function to fetch user's own posts
	async function fetchUserPosts(userId: string) {
		const userPosts: string[] = [];
		const postsRef = collection(db, "posts", userId, "userPosts");
		const snapshot = await getDocs(postsRef);

		snapshot.forEach((doc) => {
			const postData = doc.data();
			if (postData?.content) {
				userPosts.push(postData.content);
			}
		});

		return userPosts;
	}

	// Function to fetch friends' posts
	async function fetchFriendsPosts(friendsIds: string[]) {
		const friendsPosts: string[] = [];
		for (const friendId of friendsIds) {
			const friendPostsRef = collection(
				db,
				"posts",
				friendId,
				"userPosts"
			);
			const snapshot = await getDocs(friendPostsRef);

			snapshot.forEach((doc) => {
				const postData = doc.data();
				if (postData?.content) {
					friendsPosts.push(postData.content);
				}
			});
		}
		return friendsPosts;
	}

	// Fetch user's friends' uids from their profile or another document
	async function fetchUserFriends(userId: string) {
		const friendsIds: string[] = [];
		const userDocRef = doc(db, "users", userId); // Assuming friends data is in the users collection
		const userSnapshot = await getDoc(userDocRef);

		if (userSnapshot.exists()) {
			const userData = userSnapshot.data();
			if (userData?.friends && Array.isArray(userData.friends)) {
				return userData.friends;
			}
		}
		return friendsIds;
	}

	// Function to fetch personalized gratitude prompts and challenges
	const fetchPromptsAndChallenges = async (userId: string) => {
		setLoading(true);
		try {
			// Fetch user's posts and their friends' posts
			const userPosts = await fetchUserPosts(userId);
			const friendsIds = await fetchUserFriends(userId);
			const friendsPosts = await fetchFriendsPosts(friendsIds);

			// Send the posts data to the backend API
			const response = await fetch("/api/personalize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sessionId: "user-session-id", // Unique user session ID (if you have it)
					userPosts,
					friendsPosts,
				}),
			});

			const data = await response.json();
			setPromptAndChallenge(data.promptAndChallenge);
		} catch (error) {
			console.error("Error fetching personalized content:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch current logged-in user's ID and call fetchPromptsAndChallenges
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchPromptsAndChallenges(user.uid); // Fetch posts and personalized prompts
			} else {
				// Handle user not logged in
			}
		});

		return () => unsubscribe(); // Cleanup subscription
	}, []);

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="flex flex-col gap-3 mb-2">
					{Object.values(JSON.parse(promptAndChallenge || "{}")).map(
						(item, idx) => (
							<div
								className="border flex flex-col gap-2 rounded-lg overflow-hidden"
								key={idx}
							>
								<p className="text-base bg-white p-4">
									{item as string}
								</p>
								<p className="font-medium bg-blue-100 border-t p-4">
									{idx === 0
										? "Daily Gratitude Prompt"
										: "Weekly Challenge"}
								</p>
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default GratitudePrompts;
