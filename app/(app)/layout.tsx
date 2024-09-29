import AppWrapper from "@/components/AppWrapper";
import BottomNavigation from "@/components/app-bottom-navigation";
import Navbar from "@/components/app-navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="w-full h-full min-h-screen flex flex-col">
			<Navbar />
			<AppWrapper>{children}</AppWrapper>
			<BottomNavigation />
		</main>
	);
}
