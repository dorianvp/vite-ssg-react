import { AnchorHTMLAttributes, PropsWithChildren, useState } from "react";

type FaviconAnchorProps = PropsWithChildren & AnchorHTMLAttributes<HTMLAnchorElement> & {
	text?: string;
}

export function FaviconAnchor({ text, className, children, ...restProps }: FaviconAnchorProps) {

	const [url, setUrl] = useState('')

	if (typeof window !== 'undefined' && !url) {
		fetch(`${new URL(children as string).origin}`).then(res => {
			return res.text()
		}).then(data => {
			const parser = new DOMParser();
			const htmlDoc = parser.parseFromString(data, 'text/html');
			const head = htmlDoc.querySelector('head')
			const element = head?.querySelector('[rel="icon"]')
			if (element) {
				const href = element?.getAttribute('href')
				if (href?.startsWith('http://') || href?.startsWith('https://')) {
					setUrl(href)
				} else {
					setUrl(new URL(children as string).origin + '/' + href)
				}
			}
		}).catch(err => {
			console.error(err);
		})
	}

	return <a
		target="_blank"
		className={`flex items-center ${className}`}
		href={children as string}
		{...restProps}
	>

		{url ? <img className="mr-2 h-4" src={`${url}`} /> :
			<img className="mr-2 h-4" src={`${new URL(children as string).origin}/favicon.ico`} />
		}
		{text ? text : children}
	</a>
}