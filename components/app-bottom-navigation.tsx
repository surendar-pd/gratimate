import { Bot, House, MessageCircleHeart, Plus, UsersRound } from "lucide-react";
import React from "react";
import Link from "next/link"; // Assuming you're using Next.js
import { Button } from "./ui/button"; // Your button component
import AddNewPost from "./add-new-post";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"; // Tooltip components

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
			title: "Forum",
			icon: MessageCircleHeart,
			link: "/home/forum",
		},
	];

	return (
		<div className="w-full fixed bottom-0 border-t px-4 md:px-16 min-h-[4rem] bg-white flex items-center">
			<div className="flex max-w-xl mx-auto items-center justify-between w-full">
				<TooltipProvider>
					{bottomNav.map((item, index) => (
						<div key={index} className="text-center">
							<Tooltip>
								<TooltipTrigger asChild>
									{item.link ? (
										<Button
											variant={"ghost"}
											size={"icon"}
											className="flex flex-co items-center justify-center"
											asChild
										>
											<Link href={item.link} passHref>
												<item.icon size={20} />
											</Link>
										</Button>
									) : (
										<div className="flex flex-col items-center">
											{item.component}
										</div>
									)}
								</TooltipTrigger>
								<TooltipContent>
									<p>{item.title}</p>
								</TooltipContent>
							</Tooltip>
						</div>
					))}
				</TooltipProvider>
			</div>
		</div>
	);
};

export default BottomNavigation;
