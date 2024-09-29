import Link from "next/link";
import React from "react";
import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";
import { getAuth, signOut } from "firebase/auth";

const AppNavbar = () => {
	return (
		<nav className="w-full fixed z-50 bg-background top-0 flex justify-between items-center min-h-[4rem] px-4 md:px-16  border-b">
			<div>
				<Link href={"/"}>
					<h1 className="text-2xl font-bold">Grati<span className="font-normal">mate</span></h1>
				</Link>
			</div>
			<div>
				<Button asChild variant={"outline"} className="rounded-full">
					<Link href={"/home/profile"}>
						<CircleUserRound size={20} className="mr-2"/>
						Profile
					</Link>
				</Button>
			</div>
		</nav>
	);
};

export default AppNavbar;
