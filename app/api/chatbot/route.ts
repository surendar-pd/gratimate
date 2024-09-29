import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Store chat history in a temporary in-memory object (this would be replaced with a database or persistent storage in a production environment)
const chatHistory: { [key: string]: { role: string; content: string }[] } = {};

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY ?? "",
});

export async function POST(request: Request) {
	try {
		// Extract the user's message and chat session ID (assumes session ID is passed to identify different users/conversations)
		const { message, sessionId }: { message: string; sessionId: string } =
			await request.json();

		// Initialize chat history for the session if not already present
		if (!chatHistory[sessionId]) {
			chatHistory[sessionId] = [];
		}

		// Define the system prompt
		const systemPrompt = `You are a compassionate and empathetic mental health assistant, designed to support users in improving their well-being.
Approach each interaction with empathy and patience. Validate the user's feelings before guiding them towards a better state of mind. Tailor your suggestions based on the user's specific situation and emotional state. Offer to elaborate on any technique that interests the user.
`;

		// Push the user's message into the chat history for this session
		chatHistory[sessionId].push({
			role: "user",
			content: message,
		});

		// Build the full conversation history (system prompt + chat history)
		const messages = [
			{ role: "system", content: systemPrompt }, // System message at the start of the conversation
			...chatHistory[sessionId], // Insert user/assistant conversation history without name property
		];

		// Call the Groq API with the conversation history
		const chatCompletion = await groq.chat.completions.create({
			//@ts-expect-error - The Groq SDK types are not up-to-date
			messages,
			model: "mixtral-8x7b-32768",
			temperature: 0.7,
			max_tokens: 500,
			top_p: 0.95,
			presence_penalty: 0.5,
		});

		// Extract the assistant's response
		const response = chatCompletion.choices[0]?.message?.content || "";

		// Add the assistant's response to the chat history
		chatHistory[sessionId].push({
			role: "assistant",
			content: response,
		});

		// Return the response
		return NextResponse.json({ response });
	} catch (error) {
		console.error("Error processing chatbot request:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
