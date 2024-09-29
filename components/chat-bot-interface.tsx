"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	collection,
	addDoc,
	query,
	orderBy,
	onSnapshot,
	Timestamp,
	DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth, User } from "firebase/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

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
	const [botThinking, setBotThinking] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);

			const prompt = searchParams.get("prompt");
			if (prompt && prompt.length > 0) {
				setInputText(prompt); 
			}
		});
		return () => unsubscribe();
	}, [searchParams]);

	useEffect(() => {
		const prompt = searchParams.get("prompt");

		if (prompt && prompt.length > 0 && inputText === prompt) {
			handleSendMessage(); 
			if (typeof window !== "undefined") {
				window.history.replaceState(null, "", "/home/chatbot"); 
			}
		}
	}, [inputText, searchParams]);

	useEffect(() => {
		if (currentUser) {
			const chatRef = collection(
				db,
				`users/${currentUser.uid}/chatBotMessages`
			);
			const q = query(chatRef, orderBy("timestamp", "asc"));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const fetchedMessages = snapshot.docs.map(
					(doc: DocumentData) => ({
						id: doc.id,
						text: doc.data().text,
						sender: doc.data().sender,
						timestamp: (doc.data().timestamp as Timestamp).toDate(),
					})
				);
				setMessages(fetchedMessages);
			});
			return () => unsubscribe();
		}
	}, [currentUser]);

	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
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

			setInputText("");

			setBotThinking(true);

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
			setBotThinking(false);
		}
	}, [inputText, isSending, currentUser]);

	return (
		<div className="w-full h-full flex flex-col">
			<div
				className="flex-grow h-full flex-1 overflow-y-auto p-4 space-y-4 pb-40"
				ref={chatContainerRef}
			>
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex items-start space-x-4 ${
							message.sender === "user"
								? "self-end flex-row-reverse"
								: "self-start"
						}`}
					>
						<Image
							width={40}
							height={40}
							src={
								message.sender === "user"
									? currentUser?.photoURL ||
									  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" // User profile photo or default
									: "/assets/logo.png"
							}
							alt={`${message.sender} avatar`}
							className={`w-8 h-8 border rounded-full ${
								message.sender === "user" ? "ml-2" : "lg:mr-2"
							}`}
						/>
						<p
							className={`p-3 text-sm rounded-lg max-w-sm ${
								message.sender === "user"
									? "bg-blue-500 text-white"
									: "bg-slate-100 text-black"
							}`}
						>
							{message.text}
						</p>
					</div>
				))}
				{botThinking && (
					<div className="self-start bg-gray-200 text-black p-3 rounded-lg mb-16">
						Bot is thinking...
					</div>
				)}
				<div ref={bottomRef}></div>
			</div>
			<div className="flex items-center p-4 bg-background fixed bottom-16 left-0 right-0 max-w-2xl mx-auto">
				<Input
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="Type your message..."
					className="flex-grow"
					onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
				/>
				<Button
					onClick={handleSendMessage}
					disabled={isSending || !inputText.trim()}
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
