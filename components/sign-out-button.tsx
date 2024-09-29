"use client";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";

const SignOutButton = () => {
	const router = useRouter();
	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				router.replace("/");
			})
			.catch((error) => {
				toast.error("ann error occured" + error);
			});
	};
	return <Button onClick={handleLogout} variant={"secondary"} size={"sm"}>Sign out</Button>;
};

export default SignOutButton;
