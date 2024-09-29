import Header from "@/components/header";
import PersonalFeed from "@/components/personal-feed";
import SignOutButton from "@/components/sign-out-button";
import React from "react";

const ProfilePage = () => {
	return (
		<div className="w-full h-full">
			<Header text="Profile" component={<SignOutButton />} />
			<div className=" overflow-y-auto ">
				<PersonalFeed />
			</div>
		</div>
	);
};

export default ProfilePage;
