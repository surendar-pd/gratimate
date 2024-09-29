import React from "react";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

// interface CategoryData {
// 	title: string;
// }
function Category() {
	// const CATEGORY: CategoryData[] = [
	// 	{
	// 		title: "Gratefulness",
	// 	},
	// 	{
	// 		title: "Emotional Intelligence",
	// 	},
	// 	{
	// 		title: "Mindfulness",
	// 	},
	// 	{
	// 		title: "Positive Communication",
	// 	},
	// 	{
	// 		title: "Self-Reflection",
	// 	},
	// 	{
	// 		title: "Creative Expression",
	// 	},
	// 	{
	// 		title: "Community Engagement",
	// 	},
	// 	{
	// 		title: "Stress Management",
	// 	},
	// ];

	return (
		<section className="" id="">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center flex-wrap gap-8 ">
					{/* {CATEGORY.map((category, idx) => (
						<div
							key={idx}
							className="flex items-center gap-2 group overflow-hidden z-[2] transition-all select-none"
						>
							<div></div>
							<div className="flex">
								<span className="text-lg md:text-2xl lg:text-4xl font-bold">
									{category.title}
								</span>
							</div>
						</div>
					))} */}
					<VelocityScroll
						text="Gratefulness Emotional-Intelligence Mindfulness Positive-Communication Creative-Expression"
						default_velocity={2}
						className="font-display text-center text-4xl font-semibold tracking-[-0.05em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[6rem]"
					/>
				</div>
			</div>
		</section>
	);
}

export default Category;
