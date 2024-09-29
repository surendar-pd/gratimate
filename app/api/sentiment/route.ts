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
		throw new Error("Failed to fetch sentiment data");
	}

	const result = await response.json();
	return result;
};

export async function POST(request: Request) {
	try {
		const { content } = await request.json();
		const sentiment = await querySentiment(content);
		return NextResponse.json(sentiment);
	} catch (error) {
		return NextResponse.error();
	}
}
