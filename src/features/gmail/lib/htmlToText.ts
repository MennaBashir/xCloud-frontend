/**
 * Decode the common HTML entities that show up in email bodies (including
 * numeric ones). Safe for plain-text rendering — it only maps entities to
 * their literal characters and does not introduce markup.
 */
export function decodeEntities(input: string | null | undefined): string {
	return (input ?? "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&zwnj;/gi, "")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_m, n) =>
			String.fromCodePoint(parseInt(n, 16)),
		);
}

/**
 * Convert an email body (which may be HTML) into readable plain text.
 *
 * Used for list snippets and the Chat AI summary prompt, where rendered HTML
 * markup would otherwise leak through as raw tags.
 */
export function htmlToText(input: string | null | undefined): string {
	const value = input ?? "";
	if (!/<\/?[a-z][\s\S]*>/i.test(value)) {
		// Already plain text.
		return value.replace(/\s+/g, " ").trim();
	}

	let text = value;
	// Drop script/style blocks entirely.
	text = text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ");
	// Drop <head> and HTML comments (incl. Outlook `<!--[if mso]>`).
	text = text.replace(/<head[\s\S]*?<\/head>/gi, " ");
	text = text.replace(/<!--[\s\S]*?-->/g, " ");
	// Drop any leftover stray <style>/closing fragments and CSS @-rules that
	// leaked into the body of poorly-parsed emails.
	text = text.replace(/<\/?style[^>]*>/gi, " ");
	text = text.replace(/@(media|font-face|import)[\s\S]*?\}\s*\}/gi, " ");
	// Turn common block/line breaks into newlines.
	text = text.replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n");
	text = text.replace(/<br\s*\/?>/gi, "\n");
	// Strip all remaining tags.
	text = text.replace(/<[^>]+>/g, " ");
	// Decode common HTML entities.
	text = decodeEntities(text);
	// Collapse whitespace, keep paragraph breaks.
	text = text
		.replace(/[ \t]+/g, " ")
		.replace(/\n\s*\n\s*\n+/g, "\n\n")
		.replace(/[ \t]*\n[ \t]*/g, "\n")
		.trim();
	return text;
}
