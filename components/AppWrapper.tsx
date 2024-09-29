"use client";

import React from "react";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className={`max-w-xl h-full max-h-[calc(100vh-4rem)] mx-auto w-full flex-1 md:px-8 px-4 transition-all duration-300 lg:px-0`}
		>
			{children}
		</div>
	);
};

export default AppWrapper;
