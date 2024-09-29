import Category from "@/components/home/home/Category";
import Faqs from "@/components/home/home/Faqs";
import Features from "@/components/home/home/Features";
import Hero from "@/components/home/home/Hero";
import Humans from "@/components/home/home/Humans";
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
