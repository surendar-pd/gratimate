"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import NewPostForm from "./new-post-form";
import { Plus } from "lucide-react";

const AddNewPost = () => {
	const [open, setOpen] = React.useState(false);
	const isDesktop =
		typeof window !== "undefined" &&
		window.matchMedia("(min-width: 768px)").matches;

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button size={"icon"} variant="outline">
						<Plus size={20} />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add a new Post</DialogTitle>
						<DialogDescription>
							&quot;Share your thoughts, stories, and moments of
							gratitude seamlessly with our community – your space
							to reflect, connect, and grow.&quot;
						</DialogDescription>
					</DialogHeader>
					<NewPostForm setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size={"icon"} variant="outline">
					<Plus size={20} />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit profile</DrawerTitle>
					<DrawerDescription>
						Make changes to your profile here. Click save when
						you&apos;re done.
					</DrawerDescription>
				</DrawerHeader>
				<NewPostForm setOpen={setOpen} className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default AddNewPost;
