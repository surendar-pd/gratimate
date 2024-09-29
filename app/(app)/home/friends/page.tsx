import AddNewFriend from "@/components/add-new-friend";
import Header from "@/components/header";
import React from "react";
import FriendRequests from "@/components/friend-requests";
import FriendsList from "@/components/friends-list";

const FriendsPage = () => {
	return (
		<div className="w-full flex flex-col gap-8">
			<Header text="Your Friends" component={<AddNewFriend />} />
			<FriendRequests />
			<FriendsList />
		</div>
	);
};

export default FriendsPage;
