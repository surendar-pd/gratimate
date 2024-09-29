import {
	Briefcase,
	CircleDollarSign,
	FolderOpen,
	Landmark,
	Laptop2,
	Megaphone,
	MessageSquare,
	Search,
	LucideIcon,
} from 'lucide-react';
import React from 'react';

interface CategoryData {
	Svg: LucideIcon;
	title: string;
}

function Category() {
	const CATEGORY: CategoryData[] = [
		{
			Svg: Landmark,
			title: 'Accounting',
		},
		{
			Svg: Briefcase,
			title: 'Business & consulting',
		},
		{
			Svg: Search,
			title: 'Human Research',
		},
		{
			Svg: Megaphone,
			title: 'Marketing and finance',
		},
		{
			Svg: Laptop2,
			title: 'Design & development',
		},
		{
			Svg: CircleDollarSign,
			title: 'Finance management',
		},
		{
			Svg: FolderOpen,
			title: 'Project management',
		},
		{
			Svg: MessageSquare,
			title: 'Customer services',
		},
	];

	return (
		<section className='py-[50px] md:py-[80px]' id=''>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8'>
				<div className='flex items-center justify-center flex-wrap gap-8 '>
					{CATEGORY.map((category, idx) => (
						<div
							key={idx}
							className='flex items-center gap-2 group overflow-hidden z-[2] transition-all select-none'
						>
							<div>
								<category.Svg strokeWidth={1.5} size={32} />
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
