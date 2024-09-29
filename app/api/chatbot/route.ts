import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY ?? "",
});

export async function POST(request: Request) {
	try {
		const { message } = await request.json();

		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a compassionate mental health assistant...", // Same system prompt as before
				},
				{
					role: "user",
					content: message,
				},
			],
			model: "mixtral-8x7b-32768",
			temperature: 0.7,
			max_tokens: 1024,
			top_p: 0.95,
			frequency_penalty: 0.5,
			presence_penalty: 0.5,
		});

		const response = chatCompletion.choices[0]?.message?.content || "";
		return NextResponse.json({ response });
	} catch (error) {
		console.error("Error processing chatbot request:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
