import Image from 'next/image';
import React from 'react';

const Humans = () => {
	const convos = [
		{
			src: '/assets/person1.svg',
			convo: 'In need of a professional graphic designer to revamp our company logo.',
		},
		{
			src: '/assets/person2.svg',
			convo: "I specialize in logo design. Here's my portfolio; let's discuss your vision.",
		},
		{
			src: '/assets/person3.svg',
			convo: 'Seeking a skilled web developer for a new project.',
		},
		{
			src: '/assets/person4.svg',
			convo: "I'm experienced in web development.",
		},
		{
			src: '/assets/person5.svg',
			convo: 'Looking for a content writer for our upcoming blog.',
		},
	];

	return (
		<section className='w-full pt-[50px] md:pt-[80px] p-4 md:px-16 lg:max-w-7xl lg:mx-auto'>
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
							height={100}
						/>
						<span className='hidden lg:inline text-sm absolute -top-1/2 lg:-top-1/3 -right-4 -rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-300'>
							{person.convo}
						</span>
					</li>
				))}
			</ul>
		</section>
	);
};

export default Humans;
