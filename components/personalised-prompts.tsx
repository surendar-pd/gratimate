"use client";
import { auth, db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const GratitudePrompts = () => {
	const [promptAndChallenge, setPromptAndChallenge] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

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

	async function fetchUserFriends(userId: string) {
		const friendsIds: string[] = [];
		const userDocRef = doc(db, "users", userId);
		const userSnapshot = await getDoc(userDocRef);

		if (userSnapshot.exists()) {
			const userData = userSnapshot.data();
			if (userData?.friends && Array.isArray(userData.friends)) {
				return userData.friends;
			}
		}
		return friendsIds;
	}

	const fetchPromptsAndChallenges = async (userId: string) => {
		setLoading(true);
		try {
			const userPosts = await fetchUserPosts(userId);
			const friendsIds = await fetchUserFriends(userId);
			const friendsPosts = await fetchFriendsPosts(friendsIds);

			const response = await fetch("/api/personalize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sessionId: "user-session-id", 
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

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchPromptsAndChallenges(user.uid); 
			} else {
			}
		});

		return () => unsubscribe(); 
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
