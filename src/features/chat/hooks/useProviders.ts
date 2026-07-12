import { useCallback, useEffect, useState } from "react";

import { llmGet, llmPost } from "@/shared/api";
import { useAuthStore } from "@/features/auth/store/authStore";

import { apiProvidersToChatProviders } from "../lib/adapters";
import type { ChatProvider } from "../types/chat";

type ProvidersState = {
	providers: ChatProvider[];
	isLoading: boolean;
	isSwitching: boolean;
	error: string | null;
};

/**
 * Loads the LLM provider registry (`GET /llm/providers`) and exposes actions
 * to switch the active provider and save a provider's configuration
 * (API key / base URL).
 */
export function useProviders() {
	const [state, setState] = useState<ProvidersState>({
		providers: [],
		isLoading: true,
		isSwitching: false,
		error: null,
	});

	const load = useCallback(async () => {
		setState((s) => ({ ...s, isLoading: true, error: null }));
		try {
			const raw = await llmGet.listProviders();
			setState((s) => ({
				...s,
				providers: apiProvidersToChatProviders(raw),
				isLoading: false,
				error: null,
			}));
		} catch (err) {
			setState((s) => ({
				...s,
				isLoading: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to load providers.",
			}));
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	const switchProvider = useCallback(
		async (providerId: string): Promise<boolean> => {
			const token = useAuthStore.getState().token;
			if (!token) return false;
			setState((s) => ({ ...s, isSwitching: true }));
			try {
				await llmPost.setProvider(token, providerId);
				setState((s) => ({
					...s,
					isSwitching: false,
					providers: s.providers.map((p) => ({
						...p,
						isCurrent: p.id === providerId,
					})),
				}));
				return true;
			} catch (err) {
				setState((s) => ({
					...s,
					isSwitching: false,
					error:
						err instanceof Error
							? err.message
							: "Failed to switch provider.",
				}));
				return false;
			}
		},
		[],
	);

	const configureProvider = useCallback(
		async (
			providerId: string,
			config: { apiKey?: string; baseUrl?: string },
		): Promise<boolean> => {
			const token = useAuthStore.getState().token;
			if (!token) return false;
			try {
				await llmPost.configureProvider(token, {
					provider: providerId,
					apiKey: config.apiKey,
					baseUrl: config.baseUrl,
				});
				await load();
				return true;
			} catch (err) {
				setState((s) => ({
					...s,
					error:
						err instanceof Error
							? err.message
							: "Failed to save provider configuration.",
				}));
				return false;
			}
		},
		[load],
	);

	const currentProvider =
		state.providers.find((p) => p.isCurrent) ?? null;

	return {
		providers: state.providers,
		currentProvider,
		isLoading: state.isLoading,
		isSwitching: state.isSwitching,
		error: state.error,
		reload: load,
		switchProvider,
		configureProvider,
	};
}
