"use client";
import { Bot, House, ListCheck, Plus, UsersRound } from "lucide-react";
import React from "react";
import Link from "next/link"; // Assuming you're using Next.js
import { Button } from "./ui/button"; // Your button component
import AddNewPost from "./add-new-post";

const BottomNavigation = () => {
	const bottomNav = [
		{
			title: "Home",
			icon: House,
			link: "/home/feed",
		},
		{
			title: "Chatbot",
			icon: Bot,
			link: "/home/chatbot",
		},
		{
			title: "Create",
			icon: Plus,
			component: <AddNewPost />, // Rendered when no link is provided
		},
		{
			title: "Friends",
			icon: UsersRound,
			link: "/home/friends",
		},
		{
			title: "Habits",
			icon: ListCheck,
			link: "/home/habits",
		},
	];

	return (
		<div className="w-full fixed bottom-0 border-t px-4 md:px-16 min-h-[4rem] bg-background flex items-center">
			<div className="flex max-w-xl mx-auto items-center justify-between w-full">
				{bottomNav.map((item, index) => (
					<div key={index} className="text-center">
						{item.link ? (
							<Button
								variant={"ghost"}
								size={"sm"}
								className="flex items-center gap-1"
								asChild
							>
								<Link scroll={false} href={item.link} passHref>
									<item.icon size={20} />
									<p className="text-xs">{item.title}</p>
								</Link>
							</Button>
						) : (
							<div className="flex flex-col items-center">
								{item.component}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default BottomNavigation;
