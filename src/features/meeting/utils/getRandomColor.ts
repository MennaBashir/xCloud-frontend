// src/utils/getRandomColor.ts
const colors = [
	"#3B82F6",
	"#7480C9",
	"#042933",
	"#1D7915",
	"#F5C30D",
	"#C974C8",
	"#E57373",
	"#81C784",
];

const getRandomColor = (id: string) => {
	if (!id) return colors[0];

	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash);
	}

	const index = Math.abs(hash) % colors.length;

	return colors[index];
};

export default getRandomColor;
