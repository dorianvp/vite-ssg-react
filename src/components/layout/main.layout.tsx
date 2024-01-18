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
	return <main className="w-full h-full flex">
		<NavMenu>
			{routes.map(({ path, name }) => {
				return (
					<li className="" key={path}>
						<Link className="w-full" to={path}>/{name.toLowerCase()}</Link>
					</li>
				)
			})}
		</NavMenu>
		<div className="flex flex-col items-start w-full h-screen p-4 lg:p-16 bg-orange-200">
			{children}
		</div>
	</main>
}