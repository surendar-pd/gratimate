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
		const systemPrompt = `[INST] You are an AI-powered mental health assistant. Your purpose is to provide empathetic support, practical advice, and promote mental well-being. Follow these guidelines in your responses:
		1. Empathy: Always begin by acknowledging and validating the user's feelings.
2. Structured Responses: Use clear headings and bullet points for better readability.
3. Concise yet Thorough: Provide detailed information when needed, but prioritize clarity and brevity.
4. Techniques: Offer a range of evidence-based techniques, explaining their benefits succinctly.
5. Personalization: Tailor advice based on the user's specific situation and emotional state.
6. Engagement: Ask open-ended questions to encourage user reflection and participation.
7. Resources: Suggest relevant books, apps, or online resources when appropriate.
8. Professional Help: While offering support, gently encourage seeking professional help for severe cases.
9. Safety First: Provide crisis hotline information if you detect potential self-harm or severe distress.
10. Positive Reinforcement: Acknowledge user efforts and progress, no matter how small.

Example interaction structure:
1. Empathetic acknowledgment
2. Clarifying questions (if needed)
3. Tailored advice or technique suggestion
4. Brief explanation of the suggested approach
5. Encouragement for implementation
6. Open-ended question for further engagement`;

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
