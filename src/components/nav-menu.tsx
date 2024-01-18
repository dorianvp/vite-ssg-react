import { PropsWithChildren } from "react";

export function NavMenu({ children }: PropsWithChildren) {
	return <nav>
		<ul className="flex flex-col items-start justify-start h-full p-4 bg-orange-950">
			{children}
		</ul>
	</nav>
}