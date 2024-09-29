import React from "react";
import {
	BadgeCheck,
	Banknote,
	FileCheck2,
	FileEdit,
	LucideIcon,
	Newspaper,
	Search,
} from "lucide-react";

function Features() {
	interface FeaturesData {
		Svg: LucideIcon;
		title: string;
		description: string;
	}

	const FEATURES: FeaturesData[] = [
		{
			Svg: Search,
			title: "Transparency & Audit Trail",
			description:
				"We take your security seriously. Our platform ensures every step of your freelancing journey is recorded in a secure, immutable ledger. You'll have a complete audit trail of your work, so you can focus on what you do best.",
		},
		{
			Svg: FileEdit,
			title: "User Registration & Onboarding",
			description:
				"Becoming a part of our platform is a breeze. Register and onboard quickly to connect with freelancers and clients from all around the world. Your freelancing journey begins here!",
		},
		{
			Svg: FileCheck2,
			title: "Task Creation & Assignment",
			description:
				"Create tasks, specify requirements, and find the perfect freelancers for your projects. Our platform makes task creation and assignment a simple and efficient process. Get ready to see your ideas come to life!",
		},
		{
			Svg: Newspaper,
			title: "Smart Contract Creation",
			description:
				"Our platform simplifies contract creation. Establish clear terms, milestones, and payments with the security of blockchain technology. Your agreements are locked in, ensuring trust and fairness.",
		},
		{
			Svg: BadgeCheck,
			title: "Task Completion Verification",
			description:
				"Ensure the quality of work with our straightforward task completion verification process. Verify project milestones with ease and confidence, giving you peace of mind throughout the project.",
		},
		{
			Svg: Banknote,
			title: "Instant Payment Release",
			description:
				"Say goodbye to delayed payments. Our platform enables instant payment release upon task completion. No more waiting – get paid promptly for your hard work!",
		},
	];

	return (
		<section
			className='py-[50px] md:py-[80px] bg-[url("/assets/line-bg.png")]'
			id="features"
		>
			<div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
				<div className="mx-auto flex flex-col gap-4 max-w-xl text-center">
					<h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white">
						Kickstart your Freelancing
					</h2>
					<p className="my-4 text-slate-500 dark:text-slate-400">
						Jump into the World of Opportunities: Begin your
						freelancing journey on our platform. Explore a wide
						range of projects waiting for your skills and expertise.
						It&apos;s time to kickstart your freelancing career and
						unlock new horizons!
					</p>
				</div>
				<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map((feat, idx) => (
						<div
							className="block rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:border-gray-700"
							key={idx}
						>
							<div className="flex gap-2 items-center">
								<feat.Svg
									strokeWidth={1.5}
									className="text-blue-600 dark:text-blue-400"
									size={36}
								/>
								<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
									{feat.title}
								</h2>
							</div>
							<p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
								{feat.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Features;
