import ChatBotInterface from "@/components/chat-bot-interface";
import Header from "@/components/header";
import React, { Suspense } from "react";

const ChatBotPage = () => {
	return (
		<div className="w-full h-full">
			<Header text="Chatbot" />
			<div className="relative">
				<Suspense fallback={<p>Loading...</p>}>
					<ChatBotInterface />
				</Suspense>
			</div>
		</div>
	);
};

export default ChatBotPage;
