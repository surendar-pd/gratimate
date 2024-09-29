"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	collection,
	addDoc,
	query,
	orderBy,
	onSnapshot,
	Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth, User } from "firebase/auth";
import Header from "@/components/header";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Message {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
}

const ChatBotInterface: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [isSending, setIsSending] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (currentUser) {
			const chatRef = collection(
				db,
				`users/${currentUser.uid}/chatBotMessages`
			);
			const q = query(chatRef, orderBy("timestamp", "asc"));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const fetchedMessages = snapshot.docs.map((doc) => ({
					id: doc.id,
					text: doc.data().text,
					sender: doc.data().sender,
					timestamp: (doc.data().timestamp as Timestamp).toDate(),
				}));
				setMessages(fetchedMessages);
			});
			return () => unsubscribe();
		}
	}, [currentUser]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = useCallback(async () => {
		if (!inputText.trim() || isSending || !currentUser) return;

		setIsSending(true);

		try {
			const messageData = {
				text: inputText,
				sender: "user" as const,
				timestamp: Timestamp.now(),
			};

			const messageRef = collection(
				db,
				`users/${currentUser.uid}/chatBotMessages`
			);
			await addDoc(messageRef, messageData);

			const response = await getChatbotResponse(inputText);

			const botMessage = {
				text: response,
				sender: "bot" as const,
				timestamp: Timestamp.now(),
			};

			await addDoc(messageRef, botMessage);
		} catch (error) {
			console.error("Error sending message: ", error);
		} finally {
			setIsSending(false);
			setInputText("");
		}
	}, [inputText, isSending, currentUser]);

	return (
		<div className="w-full h-full flex flex-col">
			<div
				className="flex-grow overflow-y-auto p-4 space-y-4"
				ref={chatContainerRef}
			>
				{messages.map((message) => (
					<div
						key={message.id}
						className={`p-3 rounded-lg ${
							message.sender === "user"
								? "bg-blue-500 text-white self-end"
								: "bg-gray-200 text-black self-start"
						}`}
					>
						{message.text}
					</div>
				))}
			</div>
			<div className="flex items-center p-4 bg-white border-t">
				<Input
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="Type your message..."
					className="flex-grow"
					onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
				/>
				<Button
					onClick={handleSendMessage}
					disabled={isSending}
					className="ml-2"
				>
					{isSending ? "Sending..." : "Send"}
				</Button>
			</div>
		</div>
	);
};

export default ChatBotInterface;

const getChatbotResponse = async (message: string): Promise<string> => {
	try {
		const response = await fetch("/api/chatbot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Error fetching chatbot response: ", error);
		return "Sorry, something went wrong. Please try again.";
	}
};
