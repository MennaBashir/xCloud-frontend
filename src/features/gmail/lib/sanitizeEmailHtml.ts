/**
 * Sanitize raw email HTML before rendering it inside a sandboxed iframe.
 *
 * Emails are messy: they ship <style> blocks, Outlook `<!--[if mso]>`
 * conditionals, hidden preheader text, scripts, and inline event handlers.
 * The iframe `sandbox` (no `allow-scripts`) already neutralizes JS, but we
 * additionally strip the noise so the rendered content stays clean and safe.
 */
export function sanitizeEmailHtml(input: string | null | undefined): string {
	let html = input ?? "";

	// Remove <script> ... </script> entirely.
	html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

	// Remove <style> ... </style> blocks (and any stray closing tags that
	// leaked into the body text, which is common with poorly-parsed emails).
	html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
	html = html.replace(/<\/?style[^>]*>/gi, "");

	// Remove <head>, <title>, <meta>, <link>, <base> if present.
	html = html.replace(/<head[\s\S]*?<\/head>/gi, "");
	html = html.replace(/<\/?(html|body|head|title|base|meta|link)[^>]*>/gi, "");

	// Remove HTML comments, including Outlook conditional `<!--[if mso]>...`.
	html = html.replace(/<!--[\s\S]*?-->/g, "");

	// Strip inline event handlers (onclick, onload, ...).
	html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
	html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
	html = html.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

	// Neutralize javascript: URIs.
	html = html.replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"');
	html = html.replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'");

	// Drop any leftover DOCTYPE declarations sitting inside the body.
	html = html.replace(/<!doctype[^>]*>/gi, "");

	return html.trim();
}
