import ChatBotInterface from "@/components/chat-bot-interface";
import Header from "@/components/header";
import React from "react";

const ChatBotPage = () => {
	return (
		<div className="w-full h-full">
			<Header text="Chatbot" />
			<div className="overflow-y-auto">
				<ChatBotInterface />
			</div>
		</div>
	);
};

export default ChatBotPage;
