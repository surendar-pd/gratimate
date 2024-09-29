import React from "react";

const Header = ({
	text,
	component,
}: {
	text: string;
	component?: React.ReactNode;
}) => {
	return (
		<div className="flex items-center justify-between py-4">
			<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{text}</h1>
			{component && component}
		</div>
	);
};

export default Header;
