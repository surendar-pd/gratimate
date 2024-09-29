import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure Firebase is correctly set up
import { toast } from "sonner";

type NewPostFormProps = React.ComponentProps<"form"> & {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
// Define the validation schema using Zod
const postSchema = z.object({
	postType: z.enum(["gratitude", "journal", "story"], {
		required_error: "Post type is required",
	}),
	gratefulFor: z.string().min(1, "Please specify what you're grateful for"),
	because: z.string().min(1, "Please specify why you're grateful"),
	content: z.string().min(5, "Content must be at least 5 characters"),
	audience: z.enum(["self", "friends", "public"], {
		required_error: "Please select who can see your post",
	}),
});

const NewPostForm = ({ className, setOpen }: NewPostFormProps) => {
	const [formData, setFormData] = useState({
		postType: "",
		gratefulFor: "",
		because: "",
		content: "",
		audience: "self",
	});
	const [formError, setFormError] = useState<string | null>(null);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [sentimentResult, setSentimentResult] = useState<any>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const handleSelectChange = (value: string) => {
		setFormData((prevState) => ({
			...prevState,
			postType: value,
			content: "",
			gratefulFor: "",
			because: "",
		}));
	};

	const handleAudienceChange = (value: string) => {
		setFormData((prevState) => ({
			...prevState,
			audience: value,
		}));
	};

	useEffect(() => {
		const validateForm = () => {
			try {
				if (!formData.postType || !formData.audience) {
					setFormError("Please complete all required fields");
					setIsFormValid(false);
					return;
				}

				if (formData.postType === "gratitude") {
					postSchema
						.pick({
							postType: true,
							gratefulFor: true,
							because: true,
							audience: true,
						})
						.parse(formData);
				} else if (
					formData.postType === "journal" ||
					formData.postType === "story"
				) {
					postSchema
						.pick({
							postType: true,
							content: true,
							audience: true,
						})
						.parse(formData);
				}

				setFormError(null);
				setIsFormValid(true);
			} catch (error: any) {
				setFormError(error.errors[0].message);
				setIsFormValid(false);
			}
		};

		validateForm();
	}, [formData]);

	const querySentiment = async (content: string) => {
		try {
			const response = await fetch("/api/sentiment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content }), // Send the content for analysis
			});

			if (!response.ok) {
				throw new Error("Failed to analyze sentiment");
			}

			const sentimentResult = await response.json();
			return sentimentResult;
		} catch (error) {
			console.error("Error:", error);
			setFormError("Failed to analyze sentiment."); // Show error to the user
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isFormValid) {
			setIsAnalyzing(true);

			// Create the content based on postType
			let contentToAnalyze = formData.content;

			// If post type is "gratitude", set the content as a combination of "gratefulFor" and "because"
			if (formData.postType === "gratitude") {
				contentToAnalyze = `I'm grateful for ${formData.gratefulFor} because ${formData.because}`;
			}

			const sentimentResponse = await querySentiment(contentToAnalyze);
			if (sentimentResponse) {
				setSentimentResult(sentimentResponse); // Store sentiment result

				// Check if the sentiment contains a positive label
				const positiveLabel =
					sentimentResponse[0][0].label === "POSITIVE";

				if (positiveLabel) {
					// Get the current authenticated user
					const auth = getAuth();
					const currentUser = auth.currentUser;

					if (currentUser) {
						// If the sentiment is positive, store the post
						try {
							const postRef = collection(db, "posts");
							await addDoc(postRef, {
								uid: currentUser.uid, // ID of the user who posted
								postType: formData.postType,
								gratefulFor: formData.gratefulFor,
								because: formData.because,
								content: formData.content, // Use the constructed content
								audience: formData.audience, // public, friends, self
								timestamp: serverTimestamp(),
								sentimentResult: sentimentResponse[0][0].label, // Store sentiment result
							});
							toast.success(
								"Post has been created successfully!"
							);
							setOpen(false);
						} catch (error) {
							toast.error("Error creating post");
							setOpen(false);
						}
					}
				}
			}
			setIsAnalyzing(false);
		}
	};

	return (
		<form
			className={cn("grid items-start gap-4", className)}
			onSubmit={handleSubmit}
		>
			<div className="grid gap-2">
				<Label htmlFor="post-type">Post Type</Label>
				<Select onValueChange={handleSelectChange}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select post type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="gratitude">Gratitude</SelectItem>
						<SelectItem value="journal">Journal</SelectItem>
						<SelectItem value="story">Story</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Conditionally render input fields based on selected post type */}
			{formData.postType === "gratitude" && (
				<div className="grid gap-2">
					<Label htmlFor="gratefulFor">I am grateful for</Label>
					<Input
						id="gratefulFor"
						value={formData.gratefulFor}
						onChange={handleInputChange}
						placeholder="What are you grateful for?"
					/>

					<Label htmlFor="because">Because</Label>
					<Input
						id="because"
						value={formData.because}
						onChange={handleInputChange}
						placeholder="Why are you grateful?"
					/>
				</div>
			)}

			{(formData.postType === "journal" ||
				formData.postType === "story") && (
				<div className="grid gap-2">
					<Label htmlFor="content">
						{formData.postType === "journal"
							? "Journal Entry"
							: "Story"}
					</Label>
					<Textarea
						id="content"
						value={formData.content}
						onChange={handleInputChange}
						placeholder={`Write your ${
							formData.postType === "journal"
								? "journal"
								: "story"
						} here...`}
						rows={6}
					/>
				</div>
			)}

			{/* Radio group for audience selection */}
			<div className="grid gap-2">
				<Label>Who can see this post?</Label>
				<RadioGroup
					value={formData.audience}
					onValueChange={handleAudienceChange}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="self" id="self" />
						<Label htmlFor="self">Only Me</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="friends" id="friends" />
						<Label htmlFor="friends">Friends</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="public" id="public" />
						<Label htmlFor="public">Public</Label>
					</div>
				</RadioGroup>
			</div>

			{/* Error message */}
			{formError && <p className="text-red-600">{formError}</p>}

			{/* Submit button */}
			<Button type="submit" disabled={isAnalyzing || !isFormValid}>
				{isAnalyzing ? "Analyzing..." : "Create Post"}
			</Button>
		</form>
	);
};

export default NewPostForm;
