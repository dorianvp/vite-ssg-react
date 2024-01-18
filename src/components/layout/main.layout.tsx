import { PropsWithChildren } from "react";
import { NavMenu } from "../nav-menu";
import { Link } from "react-router-dom";

type LayoutProps = PropsWithChildren & {
	routes: {
		name: string;
		path: string;
	}[]
}

export function MainLayout({ children, routes }: LayoutProps) {
	return <main
		className="w-full h-full grid justify-center grid-flow-col grid-cols-[0px_1fr_0px] md:grid-cols-[1fr_theme(maxWidth.2xl)_0fr] lg:grid-cols-[1fr_theme(maxWidth.2xl)_1fr]"
	>
		<NavMenu>
			{routes.map(({ path, name }) => {
				return (
					<li className="" key={path}>
						<Link className="text-left block" to={path}>{name.toLowerCase()}</Link>
					</li>
				)
			})}
		</NavMenu>
		<div className="h-full bg-white min-w-2xl w-2xl max-w-2xl px-12 py-5 place-self-center grid-cols-2">
			{children}
		</div>
		<nav>

		</nav>
	</main>
}