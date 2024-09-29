"use client";
import { auth, db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const GratitudePrompts = () => {
	const [promptAndChallenge, setPromptAndChallenge] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [userId, setUserId] = useState<string | null>(null);

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
				setUserId(user.uid); // Set the logged-in user's uid
				fetchPromptsAndChallenges(user.uid); // Fetch posts and personalized prompts
			} else {
				// Handle user not logged in
				setUserId(null);
			}
		});

		return () => unsubscribe(); // Cleanup subscription
	}, []);

	return (
		<div>
			<h2>Daily Gratitude Prompt & Weekly Challenge</h2>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="flex flex-col gap-1">
					{Object.values(JSON.parse(promptAndChallenge || "{}")).map(
						(item, idx) => (
							<p className="bg-gray-100 p-4 rounded-lg" key={idx}>{item as string}</p>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default GratitudePrompts;
