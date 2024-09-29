import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { POSTINGS } from '@/constants/postings';
import Link from 'next/link';

function Postings() {
	return (
		<section
			className="font-outfit bg-[url('/assets/line-bg.png')]"
			id='postings'
		>
			<div className='mx-auto max-w-screen-xl px-4 py-8 md:py-12 md:px-6 lg:py-16 lg:px-8'>
				<div className='mx-auto  text-left'>
					<h2 className='text-3xl lg:text-5xl font-bold'>
						Popular job vacancy
					</h2>
				</div>
				<div className='mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
					{POSTINGS.slice(0, 6).map((post, idx) => (
						<div
							className='w-full flex flex-col gap-8 hover:-translate-y-1 transition-all duration-300 bg-app-grey-light p-4 md:p-8 rounded border border-white/10'
							key={idx}
						>
							<div className='flex flex-col gap-4'>
								<h2 className='bg-app-slate-blue rounded font-medium px-2 py-1 w-fit'>
									{post.category}
								</h2>
								<h1 className='font-semibold text-2xl'>
									{post.title}
								</h1>
								<div className='text-base flex items-center gap-4'>
									<p>
										<span className='font-medium'>
											{post.pay}
										</span>{' '}
										USD
									</p>
									<p>•</p>
									<p>{post.experience}</p>
								</div>
							</div>
							<div className='flex gap-4 items-center'>
								<div>
									<Image
										unoptimized
										className='w-12'
										src={post.client.image}
										alt='company logo'
										width={100}
										height={100}
									/>
								</div>
								<div>
									<p>{post.client.name}</p>
									<p className='flex items-center gap-1'>
										<MapPin strokeWidth={1.5} size={16} />{' '}
										{post.location}
									</p>
								</div>
							</div>
							<Button
								variant={'secondary'}
								className='h-12 text-base mt-auto'
								asChild
							>
								<Link href={`/posting/${post.id}`}>
									View Posting
								</Link>
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Postings;
