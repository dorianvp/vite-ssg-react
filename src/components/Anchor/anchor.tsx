import { AnchorHTMLAttributes, PropsWithChildren } from "react";

export function Anchor({ children, className, ...restProps }: PropsWithChildren & AnchorHTMLAttributes<HTMLAnchorElement>) {
	return <a
		className={`${className}`}
		{...restProps}
	>
		{children}
	</a>
}