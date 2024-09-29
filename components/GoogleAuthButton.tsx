"use client";

import React, { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "./ui/button";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useRouter } from "next/navigation";


const GoogleAuthButton = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true); // State to manage loading

	useEffect(() => {
		// Check if a user is already signed in
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setLoading(false); // Stop loading when the auth state is checked
			if (user) {
				// User is already signed in
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (!userDoc.exists()) {
					// User does not exist, add them to Firestore
					await setDoc(userDocRef, {
						uid: user.uid,
						displayName: user.displayName?.toLowerCase(),
						email: user.email,
						photoURL: user.photoURL,
						createdAt: new Date(), // Add a createdAt field
					});
					router.replace("/home"); // Adjust the path as needed
				} else {
					router.replace("/home"); // Adjust the path as needed
				}

				// Redirect to home page
				router.replace("/home"); // Adjust the path as needed
			}
		});

		return () => unsubscribe(); // Clean up the listener on unmount
	}, [router]);

	const handleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			setLoading(true); // Start loading when login is initiated
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Reference to the user document in Firestore
			const userDocRef = doc(db, "users", user.uid);

			// Check if the user already exists in Firestore
			const userDoc = await getDoc(userDocRef);
			if (!userDoc.exists()) {
				// User does not exist, add them to Firestore
				await setDoc(userDocRef, {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					createdAt: new Date(), // Add a createdAt field
				});
				router.replace("/home"); // Adjust the path as needed
			} else {
				router.replace("/home"); // Adjust the path as needed
			}

			// Redirect to home page
			router.replace("/home"); // Adjust the path as needed
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setLoading(false); // Stop loading after login process
		}
	};

	if (loading) {
		return <div>Loading...</div>; // You can replace this with a loading spinner
	}

	return (
		<div>
			<Button onClick={handleLogin}>Login with Google</Button>
		</div>
	);
};

export default GoogleAuthButton;
