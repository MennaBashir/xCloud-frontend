import { useEffect, useState } from "react";

const useMeidaQuery = (query: string) => {
	const [value, setValue] = useState(false);

	const onChange = (event: MediaQueryListEvent) => {
		setValue(event.matches);
	};
	useEffect(() => {
		const currentMediaQuery = window.matchMedia(query);
		setValue(currentMediaQuery.matches);
		currentMediaQuery.addEventListener("change", onChange);
		return () => currentMediaQuery.removeEventListener("change", onChange);
	}, [query]);

	return value;
};
export default useMeidaQuery;
