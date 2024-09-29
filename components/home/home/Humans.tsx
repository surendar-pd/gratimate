import Image from 'next/image';
import React from 'react';

const Humans = () => {
	const convos = [
		{
			src: '/assets/person1.svg',
			convo: 'I am so grateful for my supportive friends who always lift me up when I need it the most!',
		},
		{
			src: '/assets/person2.svg',
			convo: "Today I enjoyed a walk in the park, and the fresh air made me feel so alive.",
		},
		{
			src: '/assets/person3.svg',
			convo: 'I finally finished a project I’ve been working on for weeks. It feels great to accomplish something!',
		},
		{
			src: '/assets/person4.svg',
			convo: "Grateful for the kindness of a stranger who helped me when I was lost. Small acts make a difference.",
		},
		{
			src: '/assets/person5.svg',
			convo: 'Thankful for the sunny weather today; it brightened my mood and gave me energy to be productive.',
		},
	];

	return (
		<section className='w-full pt-[50px] md:pt-[100px] p-4 md:px-16 lg:max-w-7xl lg:mx-auto'>
			<ul className='flex justify-between items-center w-full'>
				{convos.map((person, index) => (
					<li
						key={`person-${index}`}
						className='block relative group'
					>
						<Image
							src={person.src}
							className='w-16 md:w-24 lg:w-40 group-hover:drop-shadow-[0_35px_35px_rgba(255,255,255,0.10)] transition-all duration-300'
							alt={person.convo}
							width={100}
							height={150}
						/>
						<span className='hidden lg:inline text-sm absolute -top-1/2 lg:-top-[36%] -right-4 -rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-300'>
							{person.convo}
						</span>
					</li>
				))}
			</ul>
		</section>
	);
};

export default Humans;
