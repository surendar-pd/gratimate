import { NextResponse } from "next/server";

const querySentiment = async (content: string) => {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/siebert/sentiment-roberta-large-english",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.HUGGING_FACE_API}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ inputs: content }),
		}
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch sentiment data: ${response.statusText}`
		);
	}

	const result = await response.json();
	return result;
};

export async function POST(request: Request) {
	try {
		const { content } = await request.json();

		if (!content || typeof content !== "string") {
			return NextResponse.json(
				{ error: "Invalid content provided" },
				{ status: 400 }
			);
		}

		const sentiment = await querySentiment(content);
		return NextResponse.json(sentiment);
	} catch (error) {
		console.error("Error in sentiment analysis:", error);
		return NextResponse.json(
			{ error: "An error occurred while processing the request" },
			{ status: 500 }
		);
	}
}
