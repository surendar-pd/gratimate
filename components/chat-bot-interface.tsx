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
	const [botThinking, setBotThinking] = useState(false); // Loading state for bot
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null); // Ref to scroll to the bottom
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const searchParams = useSearchParams();

	// Track the current authenticated user
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);

			// Check if there's a prompt in the URL
			const prompt = searchParams.get("prompt");
			if (prompt && prompt.length > 0) {
				setInputText(prompt); // Set the input text to the prompt
			}
		});
		return () => unsubscribe();
	}, [searchParams]);

	// Trigger handleSendMessage only when a prompt is provided via searchParams
	useEffect(() => {
		const prompt = searchParams.get("prompt");

		// If there's a prompt and the input text matches it, trigger handleSendMessage
		if (prompt && prompt.length > 0 && inputText === prompt) {
			handleSendMessage(); // Send the message when the prompt is set
			if (typeof window !== "undefined") {
				window.history.replaceState(null, "", "/home/chatbot"); // Clear prompt from URL
			}
		}
	}, [inputText, searchParams]);

	// Fetch chat messages from Firestore
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

	// Scroll to the bottom when messages are updated or page is refreshed
	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSendMessage = useCallback(async () => {
		if (!inputText.trim() || isSending || !currentUser) return;

		setIsSending(true);

		try {
			// Store user's message first
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

			// Clear the input field immediately after the message is sent
			setInputText("");

			// Show loading indicator while bot is thinking
			setBotThinking(true);

			// Get chatbot response
			const response = await getChatbotResponse(inputText);

			// Store bot's response
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
			setBotThinking(false); // Bot finished thinking
		}
	}, [inputText, isSending, currentUser]);

	return (
		<div className="w-full h-full flex flex-col">
			<div
				className="flex-grow h-full flex-1 overflow-y-auto p-4 space-y-4 pb-40"
				ref={chatContainerRef} // Ref to track the chat container
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
						{/* User's or bot's profile photo */}
						<Image
							width={40}
							height={40}
							src={
								message.sender === "user"
									? currentUser?.photoURL ||
									  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" // User profile photo or default
									: "/bot-avatar.png" // Bot avatar
							}
							alt={`${message.sender} avatar`}
							className={`w-8 h-8 rounded-full ${
								message.sender === "user" ? "ml-2" : "mr-2"
							}`}
						/>

						{/* Message content */}
						<div
							className={`p-3 rounded-lg max-w-sm ${
								message.sender === "user"
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-black"
							}`}
						>
							{message.text}
						</div>
					</div>
				))}

				{/* Display loading indicator when bot is thinking */}
				{botThinking && (
					<div className="self-start bg-gray-200 text-black p-3 rounded-lg mb-16">
						Bot is thinking...
					</div>
				)}

				{/* Empty div used as the reference to scroll to */}
				<div ref={bottomRef}></div>
			</div>
			<div className="flex items-center p-4 bg-white fixed bottom-16 left-0 right-0 max-w-2xl mx-auto">
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

// This function interacts with the chatbot API
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
