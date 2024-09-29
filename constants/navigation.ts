// Navigation Data

interface Navdata {
	title: string;
	link: string;
	target: '_blank' | '_self';
}

type NavdataCollection = ReadonlyArray<Navdata>;

const COMMON_NAVIGATION: NavdataCollection = [
	{
		title: 'Home',
		link: '/',
		target: '_self',
	},
	{
		title: 'About',
		link: '#',
		target: '_self',
	},
	{
		title: 'Features',
		link: '/#features',
		target: '_self',
	},
	{
		title: 'FAQs',
		link: '/#faqs',
		target: '_self',
	},
];

export const NAVBAR_NAVIGATION = [...COMMON_NAVIGATION];

export const FOOTER_NAVIGATION = [...COMMON_NAVIGATION];
