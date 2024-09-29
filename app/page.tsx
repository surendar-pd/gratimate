import GoogleAuthButton from "@/components/GoogleAuthButton";
import Category from "@/components/home/Category";
import Faqs from "@/components/home/Faqs";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Humans from "@/components/home/Humans";
import Postings from "@/components/home/Postings";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import Image from "next/image";

export default function Home() {
	return (
		<>
			<main className="w-full font-work">
				<Header />
				<Hero />
				<Humans />
				<Features />
				<Category />
				<Postings />
				<Faqs />
				<Footer />
			</main>
		</>
	);
}
