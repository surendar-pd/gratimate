"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { Button } from "./ui/button";

interface FriendRequest {
	id: string;
	from: string;
	status: string;
	fromUserData?: any; // To store the actual user data from 'users' collection
}

const FriendRequests = () => {
	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				await fetchFriendRequests(user.uid);
			} else {
				// Handle signed-out state if necessary
			}
		});
		return () => unsubscribe();
	}, []);

	const fetchFriendRequests = async (uid: string) => {
		setLoading(true);
		try {
			const requestsRef = collection(db, "friend_requests");
			const q = query(
				requestsRef,
				where("to", "==", uid),
				where("status", "==", "pending")
			);
			const querySnapshot = await getDocs(q);
			const requestsList = await Promise.all(
				querySnapshot.docs.map(async (docSnapshot) => {
					const requestData = docSnapshot.data() as FriendRequest;

					// Fetch the user data based on 'from' field (user who sent the request)
					const fromUserRef = doc(db, "users", requestData.from);
					const fromUserSnap = await getDoc(fromUserRef);
					const fromUserData = fromUserSnap.data();

					// Attach the actual user data to the request object
					return {
						...requestData,
						id: docSnapshot.id,
						fromUserData, // Store actual user data
					};
				})
			);
			setFriendRequests(requestsList);
		} catch (error) {
			setError("Error fetching friend requests.");
			console.error(error);
		}
		setLoading(false);
	};

	const handleAcceptRequest = async (requestId: string, friendId: string) => {
		const auth = getAuth();
		const currentUser = auth.currentUser;

		if (!currentUser) return;

		try {
			const currentUserRef = doc(db, "users", currentUser.uid);
			const currentUserSnap = await getDoc(currentUserRef);
			const currentUserData = currentUserSnap.data();

			const friendUserRef = doc(db, "users", friendId);
			const friendUserSnap = await getDoc(friendUserRef);
			const friendUserData = friendUserSnap.data();

			const requestRef = doc(db, "friend_requests", requestId);
			await updateDoc(requestRef, { status: "accepted" });

			await updateDoc(currentUserRef, {
				friends: [...(currentUserData!.friends || []), friendId],
			});
			await updateDoc(friendUserRef, {
				friends: [...(friendUserData!.friends || []), currentUser.uid],
			});

			await fetchFriendRequests(currentUser.uid);
		} catch (error) {
			console.error("Error accepting friend request: ", error);
		}
	};

	if (friendRequests.length === 0) {
		return null; // Don't render anything if there are no friend requests
	}

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{friendRequests.length === 0 ? (
				<p>No friend requests.</p>
			) : (
				<ul>
					{friendRequests.map((request) => (
						<li
							key={request.id}
							className="flex items-center justify-between p-2 border-b"
						>
							{/* Display user name or email based on the fetched data */}
							<div className="flex gap-2">
								<Image
									width={100}
									height={100}
									unoptimized
									src={request.fromUserData?.photoURL}
									alt={request.fromUserData?.displayName}
									className="w-12 h-12 rounded-full"
								/>
								<div className="flex flex-col">
									<span className="text-lg font-medium capitalize">
										{request.fromUserData?.displayName}
									</span>
									<span className="text-slate-500 text-sm">
										{request.fromUserData?.email}
									</span>
								</div>
							</div>
							<Button
								variant={"link"}
								onClick={() =>
									handleAcceptRequest(
										request.id,
										request.from
									)
								}
								className="px-4 py-2 bg-blue-500 text-white rounded"
							>
								Accept
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default FriendRequests;
