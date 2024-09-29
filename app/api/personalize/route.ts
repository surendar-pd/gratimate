import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Store post history (this would be replaced with Firebase or another database in a production environment)
const postHistory: { [key: string]: { role: string; content: string }[] } = {};

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY ?? "",
});

export async function POST(request: Request) {
	try {
		// Extract the user posts and session ID (assumes session ID is passed to identify users)
		const {
			userPosts,
			friendsPosts,
			sessionId,
		}: { userPosts: string[]; friendsPosts: string[]; sessionId: string } =
			await request.json();

		// Initialize post history for the session if not already present
		if (!postHistory[sessionId]) {
			postHistory[sessionId] = [];
		}

		// Define the system prompt for generating gratitude prompts and challenges
		const systemPrompt = `
You are a self-improvement assistant specialized in gratitude, mindfulness, and personal growth. 
Your role is to generate personalized daily gratitude prompts and weekly gratitude challenges for users based on their recent posts and interactions. 
Analyze the content, reflect on themes like relationships, work, and personal well-being, and create relevant suggestions to help users appreciate their lives and boost their mental well-being.
`;

		// Combine the user's and friends' posts for the model's context
		const userPostsText = userPosts.join("\n");
		const friendsPostsText = friendsPosts.join("\n");

		// Build the full context for the LLM based on user and friends' posts
		const fullPrompt = `
${systemPrompt}

User's recent posts:
${userPostsText}

User's friends' recent posts:
${friendsPostsText}

Generate a personalized daily gratitude prompt based on the user's posts. Then, generate a weekly gratitude challenge considering both the user’s and friends' posts. return strictly as stringified JSON
`;

		// Call the Groq API to generate personalized gratitude prompts and challenges
		const chatCompletion = await groq.chat.completions.create({
			messages: [{ role: "system", content: fullPrompt }],
			model: "mixtral-8x7b-32768", // Using Mistral or Llama
			temperature: 0.7,
			max_tokens: 300,
			top_p: 0.95,
			presence_penalty: 0.5,
		});

		// Extract the AI-generated gratitude prompt and challenge
		const aiResponse = chatCompletion.choices[0]?.message?.content || "";

		// Add the AI-generated response to the post history (for persistence purposes)
		postHistory[sessionId].push({
			role: "assistant",
			content: aiResponse,
		});

		// Return the AI-generated response as JSON
		return NextResponse.json({ promptAndChallenge: aiResponse });
	} catch (error) {
		console.error(
			"Error generating personalized prompts and challenges:",
			error
		);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
