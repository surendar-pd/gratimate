import Link from "next/link";
import Image from "next/image";

function Footer() {
	return (
		<footer id="contact" className="bg-app-grey-light">
			<div className="lg:mx-auto lg:max-w-[1440px] p-4">
				<div className="flex flex-col items-stretch justify-start">
					<div className="w-full border-b border-white/20 p-2 md:p-4">
						<div className="flex flex-col items-center justify-between md:items-start lg:flex-row">
							<div>
								<Link
									href={"/"}
									className="flex items-center gap-1"
								>
									<Image
										src="/assets/logo.png"
										alt="logo"
										width={100}
										height={100}
										className="w-12"
									/>
									<h1 className="text-2xl font-bold">
										Grati
										<span className="font-normal">
											mate
										</span>
									</h1>
								</Link>
							</div>
							<div className="flex w-full flex-col items-center justify-between md:flex-row lg:justify-end">
								<div className="mb-4 flex flex-col items-stretch justify-start text-center md:flex-row">
									{/* <a className='p-3 text-[14px] md:px-3 md:py-4 lg:mx-3 lg:py-2 '>
								How we work
							</a>
							<a className='p-3 text-[14px] md:px-3 md:py-4 lg:mx-3 lg:py-2 '>
								Services
							</a>
							<a className='p-3 text-[14px] md:px-3 md:py-4 lg:mx-3 lg:py-2 '>
								Solution
							</a>
							<a className='p-3 text-[14px] md:px-3 md:py-4 lg:mx-3 lg:py-2 '>
								FAQs
							</a> */}
								</div>
								{/* <div className="mb-4 flex items-center justify-start lg:ml-[64px]">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="#"
										className="mx-[2px] p-3 transition-all duration-300 hover:text-app-secondary"
									>
										<Linkedin strokeWidth={1.5} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="#"
										className="mx-[2px] p-3 transition-all duration-300 hover:text-app-secondary"
									>
										<Twitter strokeWidth={1.5} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="#"
										className="mx-[2px] p-3 transition-all duration-300 hover:text-app-secondary"
									>
										<Instagram strokeWidth={1.5} />
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										href="#"
										className="mx-[2px] p-3 transition-all duration-300 hover:text-app-secondary"
									>
										<Mail strokeWidth={1.5} />
									</a>
								</div> */}
							</div>
						</div>
					</div>
					<div className="w-full px-2 md:px-4">
						<div className="flex flex-col items-center justify-start md:flex-row md:justify-between">
							<p className="text-[12px] text-slate-300 pt-4">
								Copyright &copy; 2024 Gratimate
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
