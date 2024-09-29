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
	[];
	const FAQS: FaqData[] = [
		{
			question: 'What is DeWorks, and how does it work?',
			answer: 'DeWorks is a decentralized platform connecting freelancers and clients. Freelancers can offer their skills, and clients can post projects. Smart contracts handle project agreements and payments securely.',
		},
		{
			question:
				'Is DeWorks suitable for both beginners and experienced freelancers?',
			answer: 'Yes, DeWorks caters to freelancers of all levels. It offers opportunities for newcomers to experts, making it a versatile platform for everyone.',
		},
		{
			question: 'How do I get started on DeWorks as a freelancer?',
			answer: 'Register, create a profile, and start browsing available projects. Submit proposals, negotiate terms, and get to work once a client accepts your proposal.',
		},
		{
			question:
				'How can clients find the right freelancers for their projects?',
			answer: 'Clients can post project details, review proposals from freelancers, and communicate directly with them. They can assess profiles, reviews, and previous work to make informed choices.',
		},
		{
			question: 'Is my data safe on DeWorks?',
			answer: 'DeWorks prioritizes data security. Our platform employs robust encryption and blockchain technology to safeguard your information and transactions.',
		},
		{
			question: 'How are payments handled on DeWorks?',
			answer: 'Payments are secured through smart contracts. Funds are held in escrow until both parties agree that the project has been completed as per the contract terms.',
		},
		{
			question:
				'Can I collaborate with freelancers from different countries?',
			answer: 'Absolutely! DeWorks provides a global network of freelancers and clients, allowing for international collaboration on projects.',
		},
		{
			question:
				"What if there's a dispute between a freelancer and a client?",
			answer: 'DeWorks offers a dispute resolution system to address issues. If a resolution cannot be reached, the smart contract terms will determine the outcome.',
		},
		// {
		// 	question: 'Are there fees associated with using DeWorks?',
		// 	answer: 'DeWorks charges a nominal fee for project transactions to support the platform. Details are available in the fee structure section.',
		// },
		{
			question:
				'How can I build a reputation as a freelancer on DeWorks?',
			answer: 'Completing projects successfully, receiving positive feedback from clients, and delivering high-quality work will help you build a strong reputation on our platform.',
		},
		{
			question:
				"What happens if a client doesn't release payment upon project completion?",
			answer: "Smart contracts on DeWorks ensure that payment is automatically released when the project is completed as per the agreed terms. If there's an issue, our dispute resolution system can be used.",
		},
		{
			question:
				'Can I hire freelancers for long-term projects on DeWorks?',
			answer: "Yes, you can use DeWorks for both short-term and long-term projects. It's a versatile platform that accommodates various project durations and scopes.",
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
