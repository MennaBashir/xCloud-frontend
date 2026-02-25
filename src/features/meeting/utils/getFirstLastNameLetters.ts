const getFirstLastNameLetters = (name: string) => {
	const nameParts = name.trim().split(" ");
	const firstLetter = nameParts[0][0] || "👤";
	const lastLetter =
		nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
	return firstLetter + lastLetter;
};
export default getFirstLastNameLetters;
