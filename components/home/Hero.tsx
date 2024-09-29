import React from "react";
import WordRotate from "@/components/ui/word-rotate";

const Hero = () => {
	return (
		<main className="bg-[url('/assets/line-bg.png')] w-full h-fit">
			<div className="w-full h-full p-4 md:px-16 py-[50px] md:py-[80px] lg:max-w-5xl lg:mx-auto flex gap-6 justify-cente items-center flex-col text-center">
				<div className="flex flex-col gap-4 md:gap-8">
					<h1 className="text-[42px] !leading-tight md:text-6xl lg:text-7xl font-bold font-outfit">
						Embark on Your Path to
						<WordRotate
							className="text-blue-500"
							words={["Positivity", "Greatfulness"]}
						/>
						with GratiMate!
					</h1>
					<p className="text-lg font-medium text-slate-500">
						In a world filled with negativity, how often do we pause
						to appreciate the good? GratiMate is here to change
						that. Designed for those who seek a healthier online
						experience, our mental well-being app encourages
						gratitude, fosters connections, and promotes positivity.
					</p>
				</div>
			</div>
		</main>
	);
};

export default Hero;
