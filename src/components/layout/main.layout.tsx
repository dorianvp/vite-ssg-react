import { PropsWithChildren, useState } from "react";
import { NavMenu } from "../nav-menu";
import { Link } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

type LayoutProps = PropsWithChildren & {
	routes: {
		name: string;
		path: string;
		metadata: {
			title?: string;
		};
	}[]
}

export function MainLayout({ children, routes }: LayoutProps) {

	const [modal, setModal] = useState(false);

	useHotkeys('ctrl + k', (e: Event) => {
		e.preventDefault()
		setModal(!modal)
	})

	return <main
		className="w-full h-screen"
	>
		<div
			className={`${modal ? 'visible' : 'hidden'} absolute left-0 right-0 top-0 bottom-0 m-auto w-screen h-screen bg-transparent backdrop-blur-sm flex`}>
			<div className="relative bg-black w-3/4 h-3/4 m-auto">

			</div>
		</div>
		{/* <nav className="bg-black text-white w-full h-12">

		</nav> */}
		<div className="w-full h-full grid justify-center grid-flow-col grid-cols-[0px_1fr_0px] md:grid-cols-[1fr_theme(maxWidth.2xl)_0fr] lg:grid-cols-[1fr_theme(maxWidth.4xl)_1fr]">

			<NavMenu className="w-full bg-gray col-span-1 row-span-1">
				<ul className="h-full p-10 float-right">
					{routes.map(({ path, name, metadata }) => {
						return (
							<li className="" key={path}>
								<Link className="text-left block" to={path}>{metadata?.title ? metadata.title : name}</Link>
							</li>
						)
					})}
				</ul>
			</NavMenu>
			<div className="h-full bg-white min-w-2xl w-full px-12 py-5 place-self-center grid-cols-2">
				{children}
			</div>
			<div></div>
		</div>
	</main>
}