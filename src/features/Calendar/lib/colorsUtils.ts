export const colorMap: Record<string, string> = {
	"#000000": "Black",
	"#FFFFFF": "White",
	"#808080": "Gray",
	"#FF0000": "Red",
	"#800000": "Maroon",
	"#FFFF00": "Yellow",
	"#808000": "Olive",
	"#00FF00": "Lime",
	"#008000": "Green",
	"#00FFFF": "Cyan",
	"#008080": "Teal",
	"#0000FF": "Blue",
	"#000080": "Navy",
	"#FF00FF": "Magenta",
	"#800080": "Purple",
	"#FFA500": "Orange",
	"#FFC0CB": "Pink",
	"#3B82F6": "Royal Blue",
	"#F29649": "Orange",
	"#31C0B1": "Teal",
};

// 2. Helper to convert Hex to RGB
const hexToRgb = (hex: string) => {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

// 3. The Main Function
export const getColorName = (hex: string): string => {
	const inputRgb = hexToRgb(hex);
	if (!inputRgb) return hex; // If invalid hex, return original string

	let minDistance = Infinity;
	let closestColorName = "Custom Color";

	for (const [key, name] of Object.entries(colorMap)) {
		const targetRgb = hexToRgb(key);
		if (!targetRgb) continue;

		// Euclidean distance formula: sqrt((r2-r1)^2 + (g2-g1)^2 + (b2-b1)^2)
		const distance = Math.sqrt(
			Math.pow(inputRgb.r - targetRgb.r, 2) +
				Math.pow(inputRgb.g - targetRgb.g, 2) +
				Math.pow(inputRgb.b - targetRgb.b, 2),
		);

		if (distance < minDistance) {
			minDistance = distance;
			closestColorName = name;
		}
	}

	return closestColorName;
};
