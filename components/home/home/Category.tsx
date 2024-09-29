
import React from 'react';

interface CategoryData {
	title: string;
}
function Category() {
	const CATEGORY: CategoryData[] = [
		{
		
			title: 'Gratefulness',
		},
		{
			
			title: 'Emotional Intelligence',
		},
		{
			
			title: 'Mindfulness',
		},
		{
			
			title: 'Positive Communication',
		},
		{
			
			title: 'Self-Reflection',
		},
		{
			
			title: 'Creative Expression',
		},
		{
			
			title: 'Community Engagement',
		},
		{
			
			title: 'Stress Management',
		},
	];

	return (
		<section className='py-[50px]' id=''>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8'>
				<div className='flex items-center justify-center flex-wrap gap-8 '>
					{CATEGORY.map((category, idx) => (
						<div
							key={idx}
							className='flex items-center gap-2 group overflow-hidden z-[2] transition-all select-none'
						>
							<div>
								
							</div>
							<div className='flex'>
								<span className='text-lg md:text-2xl lg:text-4xl font-bold'>
									{category.title}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Category;
