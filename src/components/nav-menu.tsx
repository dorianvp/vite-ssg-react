import { HTMLAttributes, PropsWithChildren } from "react";

export function NavMenu({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
	return <nav className={`${className}`}>
		{children}
	</nav>
}