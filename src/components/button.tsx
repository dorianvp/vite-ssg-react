import type { ButtonHTMLAttributes } from "react";
import type { PropsWithChildren } from "react";

export function Button({ children, className, ...restProps }: ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren) {
	return <button
		{...restProps}
		className={`px-4 py-2 rounded-md transition-colors duration-150 hover:bg-orange-900 ${className}`}
	>
		{children}
	</button>
}