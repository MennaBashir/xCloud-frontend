import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { sanitizeEmailHtml } from "../lib/sanitizeEmailHtml";
import { decodeEntities, htmlToText } from "../lib/htmlToText";

export type EmailBodyMode = "rich" | "plain";

type EmailBodyProps = {
	body: string;
	className?: string;
	/** "rich" renders the sender's HTML; "plain" normalizes to app-styled text. */
	mode?: EmailBodyMode;
};

/** Heuristic: does this look like HTML rather than plain text? */
function looksLikeHtml(value: string): boolean {
	return /<\/?[a-z][\s\S]*>/i.test(value);
}

/**
 * Renders an email body.
 *
 *  - mode="rich" (default): HTML emails are sanitized (scripts, styles, MSO
 *    conditionals and event handlers removed) and rendered inside a sandboxed
 *    <iframe> so the email's own layout works without leaking into the app.
 *  - mode="plain": the body is converted to clean text (HTML stripped) and
 *    rendered in the app's own style with clickable links.
 */
export function EmailBody({ body, className, mode = "rich" }: EmailBodyProps) {
	const isHtml = useMemo(() => looksLikeHtml(body), [body]);

	if (mode === "plain") {
		// Normalize HTML to readable text; plain bodies pass through untouched.
		const text = isHtml ? htmlToText(body) : body;
		return <PlainTextBody body={text} className={className} />;
	}

	if (!isHtml) {
		return <PlainTextBody body={body} className={className} />;
	}

	return <HtmlEmail body={body} className={className} />;
}

// Matches http(s) URLs, bare www. links, and email addresses.
const LINK_PATTERN =
	/(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/** Render plain-text email bodies with clickable links/emails. */
function PlainTextBody({ body, className }: EmailBodyProps) {
	const nodes = useMemo(() => {
		const text = decodeEntities(body);
		const out: ReactNode[] = [];
		let lastIndex = 0;
		let key = 0;

		for (const match of text.matchAll(LINK_PATTERN)) {
			const token = match[0];
			const start = match.index ?? 0;

			if (start > lastIndex) {
				out.push(text.slice(lastIndex, start));
			}

			// Trailing punctuation shouldn't be part of the link.
			const trailingMatch = token.match(/[.,;:!?)\]]+$/);
			const trailing = trailingMatch ? trailingMatch[0] : "";
			const clean = trailing ? token.slice(0, -trailing.length) : token;

			const isEmail = clean.includes("@") && !clean.includes("/");
			const href = isEmail
				? `mailto:${clean}`
				: clean.startsWith("www.")
					? `https://${clean}`
					: clean;

			out.push(
				<a
					key={`lnk-${key++}`}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="text-ai underline underline-offset-2 break-all hover:opacity-80"
				>
					{clean}
				</a>,
			);
			if (trailing) out.push(trailing);
			lastIndex = start + token.length;
		}

		if (lastIndex < text.length) {
			out.push(text.slice(lastIndex));
		}
		return out;
	}, [body]);

	return (
		<p
			className={cn(
				"text-[0.9375rem] leading-relaxed text-foreground whitespace-pre-wrap break-words",
				className,
			)}
		>
			{nodes}
		</p>
	);
}

function HtmlEmail({ body, className }: EmailBodyProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [height, setHeight] = useState(240);

	const srcDoc = useMemo(() => {
		const safe = sanitizeEmailHtml(body);
		return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base target="_blank"><style>
			html,body{margin:0;padding:0;background:#fff;color:#111;
				font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
				font-size:14px;line-height:1.5;word-break:break-word;overflow-x:hidden;}
			img{max-width:100%;height:auto;}
			a{color:#0069ff;}
			table{max-width:100%;}
		</style></head><body>${safe}</body></html>`;
	}, [body]);

	// Auto-size the iframe to its content height. Uses a ResizeObserver inside
	// the iframe document so the height stays correct as images and fonts load,
	// avoiding both cut-off content and excess empty space.
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		let observer: ResizeObserver | null = null;
		let imgListeners: Array<() => void> = [];

		const measure = () => {
			const doc = iframe.contentDocument;
			if (!doc) return;
			const el = doc.documentElement;
			const b = doc.body;
			// Use the tightest accurate measure of the rendered content.
			const next = Math.max(
				el.scrollHeight,
				b ? b.scrollHeight : 0,
				b ? b.offsetHeight : 0,
			);
			if (next > 0) {
				setHeight(Math.min(Math.max(next, 80), 20000));
			}
		};

		const setup = () => {
			const doc = iframe.contentDocument;
			if (!doc || !doc.body) return;
			measure();

			// Re-measure whenever the document body resizes.
			observer = new ResizeObserver(measure);
			observer.observe(doc.body);
			observer.observe(doc.documentElement);

			// Images often load after first paint — re-measure when they do.
			const imgs = Array.from(doc.images);
			imgListeners = imgs
				.filter((img) => !img.complete)
				.map((img) => {
					const onDone = () => measure();
					img.addEventListener("load", onDone);
					img.addEventListener("error", onDone);
					return () => {
						img.removeEventListener("load", onDone);
						img.removeEventListener("error", onDone);
					};
				});
		};

		iframe.addEventListener("load", setup);
		// In case it's already loaded (srcDoc set synchronously).
		if (iframe.contentDocument?.readyState === "complete") setup();

		return () => {
			iframe.removeEventListener("load", setup);
			observer?.disconnect();
			imgListeners.forEach((off) => off());
		};
	}, [srcDoc]);

	return (
		<iframe
			ref={iframeRef}
			title="Email content"
			srcDoc={srcDoc}
			sandbox="allow-popups allow-popups-to-escape-sandbox"
			referrerPolicy="no-referrer"
			scrolling="no"
			className={cn(
				"w-full block rounded-[var(--radius-md)] bg-white",
				className,
			)}
			style={{ height, border: "0", colorScheme: "light" }}
		/>
	);
}
