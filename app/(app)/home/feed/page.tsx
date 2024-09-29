import Header from "@/components/header";
import PostsFeed from "@/components/posts-feed";
import React from "react";

const FeedPage = () => {
	return (
		<div className="w-full h-full">
			<Header text="Posts" />
			<div className=" overflow-y-auto ">
				<PostsFeed />
			</div>
		</div>
	);
};

export default FeedPage;
