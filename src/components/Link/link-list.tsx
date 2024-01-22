import { PropsWithChildren, memo } from "react";
import { FaviconAnchor } from "../Anchor/favicon-anchor";

export const LinkList = memo(({ children }: PropsWithChildren) => {

	const lines = children ? children.toString().split(' ') : []

	return <ul>
		{lines.map(line => {
			return <li key={line}>
				<FaviconAnchor>{line}</FaviconAnchor>
			</li>
		})}
	</ul>
})