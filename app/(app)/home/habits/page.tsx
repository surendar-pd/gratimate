import NewHabitDialog from "@/components/create-habbit";
import Header from "@/components/header";
import React from "react";

const HabitPage = () => {
	return (
		<div className="w-full h-full">
			<Header text="Habits" component={<NewHabitDialog />} />
			<div className=" overflow-y-auto ">{/* <PersonalFeed /> */}</div>
		</div>
	);
};

export default HabitPage;
