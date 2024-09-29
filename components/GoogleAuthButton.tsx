"use client";

import React, { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "./ui/button";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const GoogleAuthButton = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setLoading(false);
			if (user) {
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (!userDoc.exists()) {
					await setDoc(userDocRef, {
						uid: user.uid,
						displayName: user.displayName?.toLowerCase(),
						email: user.email,
						photoURL: user.photoURL,
						createdAt: new Date(),
					});
					router.replace("/home/feed");
				} else {
					router.replace("/home/feed");
				}
				router.replace("/home/feed");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const handleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			setLoading(true);
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const userDocRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userDocRef);
			if (!userDoc.exists()) {
				await setDoc(userDocRef, {
					uid: user.uid,
					displayName: user.displayName?.toLowerCase(),
					email: user.email,
					photoURL: user.photoURL,
					createdAt: new Date(),
				});
				router.replace("/home/feed");
			} else {
				router.replace("/home/feed");
			}
			router.replace("/home/feed");
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Button onClick={handleLogin}>Login with Google</Button>
		</div>
	);
};

export default GoogleAuthButton;
