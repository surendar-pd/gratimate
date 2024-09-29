"use client";
import React, { useState, useEffect } from "react";
// Import necessary Firebase modules
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase";
import Image from "next/image";
import { toast } from "sonner";

interface User {
	id: string;
	displayName: string;
	email: string;
	photoURL: string;
}

interface RequestedUser {
	id: string;
	status: string;
}

const AddNewFriend: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
	const [currentUser, setCurrentUser] = useState<string>("");
	const [requestedUsers, setRequestedUsers] = useState<RequestedUser[]>([]); // Track requested users with status

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				setCurrentUser(uid);
				fetchFriendRequests(uid);
			} else {
				// Handle signed-out state
			}
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchTerm) {
				handleSearch();
			} else {
				setUsers([]);
			}
		}, 500);

		return () => clearTimeout(handler);
	}, [searchTerm]);

	const fetchFriendRequests = async (uid: string) => {
		try {
			const requestsRef = collection(db, "friend_requests");
			const q = query(requestsRef, where("from", "==", uid));
			const querySnapshot = await getDocs(q);
			const requestsList = querySnapshot.docs.map((doc) => ({
				id: doc.data().to,
				status: doc.data().status,
			}));
			setRequestedUsers(requestsList); // Set the requested users with status
		} catch (error) {
			console.error("Error fetching friend requests: ", error);
		}
	};

	const handleSearch = async () => {
		setLoading(true);
		setError("");
		const to = searchTerm + "~";
		const lowerSearchTerm = searchTerm.toLowerCase();

		try {
			const usersRef = collection(db, "users");
			const q = query(
				usersRef,
				where("displayName", ">=", lowerSearchTerm),
				where("displayName", "<", to.toLowerCase())
			);
			const querySnapshot = await getDocs(q);
			const userList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as User[]; // Cast to User type
			setUsers(userList);
		} catch (err) {
			setError("Failed to fetch users.");
			console.error(err);
		}
		setLoading(false);
	};

	const handleAddFriend = async (userId: string) => {
		// Check if user already requested
		const existingRequest = requestedUsers.find(
			(request) => request.id === userId
		);
		if (existingRequest) {
			return; // Do not send a request if it's already requested
		}

		try {
			await addDoc(collection(db, "friend_requests"), {
				from: currentUser,
				to: userId,
				status: "pending", // Set status to pending
			});
			setRequestedUsers((prev) => [
				...prev,
				{ id: userId, status: "pending" },
			]); // Add to requested users
			toast.success("Friend request sent successfully.");
			setOpen(false);
		} catch (error) {
			console.error("Error adding friend request: ", error);
			setOpen(false);
		}
	};

	const renderDialog = () => (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Add Friend</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a New Friend</DialogTitle>
					<DialogDescription>
						Search for your friends and send them a friend request.
					</DialogDescription>
				</DialogHeader>
				<Input
					placeholder="Search for a friend..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{loading && <p>Loading...</p>}
				{error && <p className="text-red-500">{error}</p>}
				<ul className="flex flex-col mt-2">
					{users.map((user) => (
						<li
							key={user.id}
							className="flex items-center justify-between border-b py-4"
						>
							<div className="flex gap-2">
								<Image
									width={100}
									height={100}
									unoptimized
									src={user.photoURL}
									alt={user.displayName}
									className="w-12 h-12 rounded-full"
								/>
								<div className="flex flex-col">
									<span className="text-lg font-medium capitalize">
										{user.displayName}
									</span>
									<span className="text-slate-500 text-sm">
										{user.email}
									</span>
								</div>
							</div>
							<Button
								variant={"link"}
								onClick={() => handleAddFriend(user.id)}
							>
								{requestedUsers.find(
									(req) => req.id === user.id
								)?.status === "accepted"
									? "Accepted"
									: requestedUsers.find(
											(req) => req.id === user.id
									  )?.status === "pending"
									? "Request Sent"
									: "Add Friend"}
							</Button>
						</li>
					))}
				</ul>
			</DialogContent>
		</Dialog>
	);

	const renderDrawer = () => (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline">Add Friend</Button>
			</DrawerTrigger>
			<DrawerContent className="p-4">
				<DrawerHeader>
					<DrawerTitle>Add a New Friend</DrawerTitle>
					<DrawerDescription>
						Search for your friends and send them a friend request.
					</DrawerDescription>
				</DrawerHeader>
				<Input
					placeholder="Search for a friend..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{loading && <p>Loading...</p>}
				{error && <p className="text-red-500">{error}</p>}
				<ul className="flex flex-col mt-4">
					{users.map((user) => (
						<li
							key={user.id}
							className="flex items-center justify-between border-b py-4"
						>
							<div className="flex gap-2 items-center">
								<Image
									width={100}
									height={100}
									unoptimized
									src={user.photoURL}
									alt={user.displayName}
									className="w-8 h-8 rounded-full"
								/>
								<div className="flex flex-col">
									<span className="text-base font-medium capitalize">
										{user.displayName}
									</span>
									<span className="text-slate-500 text-sm">
										{user.email}
									</span>
								</div>
							</div>
							<Button
								variant={"link"}
								onClick={() => handleAddFriend(user.id)}
								className="text-sm"
							>
								{requestedUsers.find(
									(req) => req.id === user.id
								)?.status === "accepted"
									? "Accepted"
									: requestedUsers.find(
											(req) => req.id === user.id
									  )?.status === "pending"
									? "Request Sent"
									: "Add Friend"}
							</Button>
						</li>
					))}
				</ul>
			</DrawerContent>
		</Drawer>
	);

	return isDesktop ? renderDialog() : renderDrawer();
};

export default AddNewFriend;
