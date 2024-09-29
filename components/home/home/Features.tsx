import React from "react";
import {
	BookHeart,
	HandHelping,
	Handshake,
	HeartHandshake,
	LucideIcon,
	NotebookPen,
	Sparkles,
	StickyNote,
} from "lucide-react";

function Features() {
	interface FeaturesData {
		Svg: LucideIcon;
		title: string;
		description: string;
	}

	const FEATURES: FeaturesData[] = [
		{
			Svg: BookHeart ,
			title: "Gratitude Posts",
			description:
				"You can share your positive experiences and express gratitude through dedicated posts, creating a vibrant community centered around appreciation. This feature encourages you to reflect on the good in your life, fostering a supportive atmosphere where positivity thrives. By sharing your stories of gratitude, you can inspire others and strengthen your emotional well-being.",
		},
		{
			Svg:  NotebookPen ,
			title: "Journaling",
			description:
				"You can document your thoughts and feelings in a private journal, encouraging deep self-reflection and personal growth. This feature allows you to explore your emotions in a safe space, helping you gain insights into your experiences. By regularly journaling, you can track your mental well-being and foster a positive mindset.",
		},
		{
			Svg: Handshake ,
			title: "Community Engagement",
			description:
				"By connecting with friends and like-minded individuals on GratiMate, you can cultivate a supportive community that encourages positivity and personal growth. Engaging with others who share similar values helps you feel understood and motivated. This network fosters a sense of belonging, allowing you to uplift each other and celebrate the journey toward emotional well-being together.",
		},
		{
			Svg: Sparkles ,
			title: "Sentiment Analysis",
			description:
				"GratiMate utilizes AI to analyze your posts, ensuring a positive and uplifting environment. If you share something negative, the AI detects this and redirects you to the therapeutic chatbot, which offers support and encouragement. This process helps maintain a space where positivity thrives, allowing you to focus on gratitude and personal growth.",
		},
		{
			Svg: HeartHandshake ,
			title: "Therapy Mate",
			description:
				"A helpful therapeutic assistant powered by an LLM is available to provide support and share motivational quotes aimed at boosting your mood. Whenever you’re feeling down or need a bit of encouragement, the chatbot interacts with you, offering uplifting messages designed to help shift your perspective and foster emotional resilience.",
		},
		{
			Svg: HandHelping ,
			title: "Personalized Nudges",
			description:
				"You receive personalized reminders and prompts designed to inspire daily gratitude practices, making it easier for you to cultivate a positive mindset. These tailored nudges encourage you to take a moment each day to reflect on what you’re grateful for, fostering a sense of appreciation and mindfulness in your life.",
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
					Step into a World of Positivity
					</h2>
					<p className="my-4 text-slate-500 dark:text-slate-400">
					Begin your journey with GratiMate. Discover an enriching space dedicated to gratitude and emotional growth. It's time to enhance your well-being and unlock your potential!
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
