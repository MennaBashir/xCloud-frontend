/**
 * Decode RFC 2047 "encoded-word" header fragments that some emails leave in
 * the sender/subject, e.g.:
 *   =?UTF-8?Q?Workspace?=        -> "Workspace"
 *   =?utf-8?B?QmF5dC5jb20=?=      -> "Bayt.com"
 *
 * This is a defensive frontend fallback; the backend now decodes headers on
 * sync, but already-stored rows may still contain encoded words.
 */
function decodeQ(text: string): string {
	// Q-encoding: "_" is space, "=XX" are hex bytes (UTF-8).
	const withSpaces = text.replace(/_/g, " ");
	const bytes: number[] = [];
	for (let i = 0; i < withSpaces.length; i += 1) {
		const ch = withSpaces[i];
		if (ch === "=" && i + 2 < withSpaces.length) {
			const hex = withSpaces.slice(i + 1, i + 3);
			const code = parseInt(hex, 16);
			if (!Number.isNaN(code)) {
				bytes.push(code);
				i += 2;
				continue;
			}
		}
		bytes.push(ch.charCodeAt(0));
	}
	return decodeBytesUtf8(bytes);
}

function decodeB(text: string): string {
	try {
		const binary = atob(text);
		const bytes = Array.from(binary, (c) => c.charCodeAt(0));
		return decodeBytesUtf8(bytes);
	} catch {
		return text;
	}
}

function decodeBytesUtf8(bytes: number[]): string {
	try {
		return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
	} catch {
		return String.fromCharCode(...bytes);
	}
}

export function decodeMimeWord(input: string | null | undefined): string {
	const value = input ?? "";
	if (!value.includes("=?")) return value;

	// Per RFC 2047, whitespace (incl. folded newlines) between two adjacent
	// encoded-words is not significant — collapse it BEFORE decoding so the
	// fragments join cleanly (e.g. "Work" + "space" -> "Workspace").
	const joined = value.replace(/\?=\s+=\?/g, "?==?");

	return joined.replace(
		/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g,
		(_match, _charset: string, encoding: string, data: string) => {
			return encoding.toLowerCase() === "b" ? decodeB(data) : decodeQ(data);
		},
	);
}
