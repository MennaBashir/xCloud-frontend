import { useEffect, useState } from "react";

import { llmGet } from "@/shared/api";

export type SuggestedPrompt = {
	title: string;
	prompt: string;
	category: string;
};

/** Loads suggested prompts from the backend (`GET /llm/prompts`). */
export function usePrompts() {
	const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await llmGet.getSuggestedPrompts();
				if (!cancelled) setPrompts(data);
			} catch {
				if (!cancelled) setPrompts([]);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	return { prompts, isLoading };
}
