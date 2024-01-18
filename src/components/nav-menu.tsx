import { PropsWithChildren } from "react";

export function NavMenu({ children }: PropsWithChildren) {
	return <nav className="w-full max-w-xl bg-gray col-span-1 row-span-1">
		<ul className="h-full p-4 float-right">
			{children}
		</ul>
	</nav>
}