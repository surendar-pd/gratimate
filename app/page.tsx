import GoogleAuthButton from "@/components/GoogleAuthButton";
import Category from "@/components/home/Category";
import Faqs from "@/components/home/Faqs";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Humans from "@/components/home/Humans";

import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";


export default function Home() {
	return (
		<>
			<main className="w-full font-work">
				<Header />
				<Hero />
				<Humans />
				<Features />
				<Category />
			
				<Faqs />
				<Footer />
			</main>
		</>
	);
}
