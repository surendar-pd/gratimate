"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";

interface Friend {
	id: string;
	friendData?: User; // To store friend user data from 'users' collection
}

const FriendsList = () => {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				await fetchFriends(user.uid);
			} else {
				// Handle signed-out state if necessary
			}
		});
		return () => unsubscribe();
	}, []);

	const fetchFriends = async (uid: string) => {
		setLoading(true);
		try {
			// Fetch the current user's data to get their friends list
			const userRef = doc(db, "users", uid);
			const userSnap = await getDoc(userRef);
			const userData = userSnap.data();

			if (userData && userData.friends) {
				// Assuming friends is an array of UIDs
				const friendsList = await Promise.all(
					userData.friends.map(async (friendId: string) => {
						// Fetch each friend's data
						const friendRef = doc(db, "users", friendId);
						const friendSnap = await getDoc(friendRef);
						const friendData = friendSnap.data();

						return {
							id: friendId,
							friendData, // Store friend's actual data
						};
					})
				);

				setFriends(friendsList);
			} else {
				setFriends([]);
			}
		} catch (error) {
			setError("Error fetching friends.");
			console.error(error);
		}
		setLoading(false);
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{!loading && friends.length === 0 ? (
				<p>No friends found.</p>
			) : (
				<ul className="overflow-y-auto max-h-[70vh]">
					{friends.map((friend) => (
						<li
							key={friend.id}
							className="flex items-center justify-between p-4 border-b"
						>
							<div className="flex gap-2">
								<Image
									width={100}
									height={100}
									unoptimized
									src={
										friend.friendData?.photoURL ||
										"https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"
									}
									alt={
										friend.friendData?.displayName ||
										"Friend's profile picture"
									}
									className="w-12 h-12 rounded-full"
								/>
								<div className="flex flex-col">
									<span className="text-lg font-medium capitalize">
										{friend.friendData?.displayName}
									</span>
									<span className="text-slate-500 text-sm">
										{friend.friendData?.email}
									</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default FriendsList;
