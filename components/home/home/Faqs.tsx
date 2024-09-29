import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

function Faqs() {
	interface FaqData {
		question: string;
		answer: string;
	}

	const FAQS: FaqData[] = [
		{
			question: 'What is GratiMate?',
			answer: 'GratiMate is a mental wellbeing app designed to foster positivity, gratitude, and community through journaling and social interactions.',
		},
		{
			question:
				'Who can use GratiMate?',
			answer: 'GratiMate is designed for anyone seeking to improve their mental health through positivity, regardless of age or background.',
		},
		{
			question: 'How do I create an account?',
			answer: 'You can easily create an account by signing up with your Google account for quick access.',
		},
		{
			question:
				'Can I keep my journal private?',
			answer: 'Absolutely! Your journal entries are private and accessible only to you, promoting personal reflection without external pressure.',
		},
		{
			question: 'Are there any in-app purchases?',
			answer: 'Currently, GratiMate is free to use, with no hidden fees or in-app purchases required.',
		},
		{
			question: 'How does the gratitude tracker work? ',
			answer: 'The gratitude tracker records your gratitude posts over time, helping you visualize your positive growth.',
		},
		{
			question:
				'Can I access GratiMate on multiple devices?',
			answer: 'Yes, GratiMate is designed to sync across devices, allowing you to access your content anywhere.',
		},
		{
			question:
				"How does the app maintain a positive environment?",
			answer: 'AI analyzes user posts, redirecting negative content to the chatbot, ensuring a supportive community atmosphere.',
		},

	];

	return (
        <section className="" id="faqs">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
                <div className="mx-auto py-[50px] md:py-[80px] max-w-lg flex flex-col gap-4 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold">
                        People Often Ask About
                    </h2>
                    {/* <p className="my-4 text-slate-200">
                      Doloremque Laudantium, Totam Rem Aperiam, Eaque Ipsa Quae
                      Ab Illo Inventore Veritatis Et Quasi Architecto Beatae
                      Vitae Dicta
                  </p> */}
                </div>
                <div className="mt-4 lg:px-16 px-0">
                    {FAQS.map((faq, idx) => (
                        <Accordion
                            key={idx}
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            <AccordionItem value={idx.toString()}>
                                <AccordionTrigger>
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Faqs;