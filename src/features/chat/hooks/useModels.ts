import { useCallback, useEffect, useState } from "react";

import { llmGet, llmPost } from "@/shared/api";
import { useAuthStore } from "@/features/auth/store/authStore";

import { useChatStore } from "../store/chatStore";
import { isEmbeddingModel, modelToChatModel } from "../lib/adapters";
import type { ChatModel } from "../types/chat";

type ModelsState = {
	models: ChatModel[];
	/** Backend default model (from settings.json), resolved. */
	defaultModel: string | null;
	isLoading: boolean;
	error: string | null;
};

/**
 * Loads the available models from the active provider and the backend
 * default.
 *
 * Smart default: the active model is set to the backend default (or the first
 * non-embedding model) so that chatting works out of the box even when the
 * backend's resolved default happens to be an embedding model.
 *
 * Also exposes `saveDefaultModel` (`POST /llm/models`) so the user can persist
 * a custom default — or `"auto"` to reset to auto-detection.
 */
export function useModels() {
	const modelId = useChatStore((s) => s.modelId);
	const setModelId = useChatStore((s) => s.setModelId);
	const [state, setState] = useState<ModelsState>({
		models: [],
		defaultModel: null,
		isLoading: true,
		error: null,
	});

	const load = useCallback(
		async (opts: { resetSelection?: boolean } = {}) => {
			setState((s) => ({ ...s, isLoading: true, error: null }));
			try {
				const [rawModels, def] = await Promise.all([
					llmGet.listModels(),
					llmGet
						.getDefaultModel()
						.catch(() => ({ default_model: null })),
				]);

				if (!Array.isArray(rawModels)) {
					setState((s) => ({
						...s,
						models: [],
						isLoading: false,
						error:
							rawModels.error ||
							"Could not reach the provider. Is it configured?",
					}));
					return;
				}

				const models = rawModels.map(modelToChatModel);
				const backendDefault = def.default_model;
				setState({
					models,
					defaultModel: backendDefault,
					isLoading: false,
					error: null,
				});

				// Resolve the active model when none is selected yet, or when
				// the caller asked for a reset (e.g. after a provider switch).
				const current = useChatStore.getState().modelId;
				const currentIsValid =
					!!current && models.some((m) => m.id === current);
				if ((!currentIsValid || opts.resetSelection) && models.length > 0) {
					const preferred =
						backendDefault &&
						!isEmbeddingModel(backendDefault) &&
						models.some((m) => m.id === backendDefault)
							? backendDefault
							: (models.find((m) => !m.isEmbedding)?.id ??
								models[0].id);
					setModelId(preferred);
				}
			} catch (err) {
				setState((s) => ({
					...s,
					models: [],
					isLoading: false,
					error:
						err instanceof Error
							? err.message
							: "Failed to load models.",
				}));
			}
		},
		[setModelId],
	);

	useEffect(() => {
		void load();
	}, [load]);

	/** Persist a default model on the backend. Pass `"auto"` to reset. */
	const saveDefaultModel = useCallback(
		async (name: string): Promise<boolean> => {
			const token = useAuthStore.getState().token;
			if (!token) return false;
			try {
				const res = await llmPost.setDefaultModel(token, name);
				setState((s) => ({
					...s,
					defaultModel: res.resolved_model,
				}));
				if (res.resolved_model) {
					setModelId(res.resolved_model);
				}
				return true;
			} catch (err) {
				setState((s) => ({
					...s,
					error:
						err instanceof Error
							? err.message
							: "Failed to set default model.",
				}));
				return false;
			}
		},
		[setModelId],
	);

	return {
		models: state.models,
		modelId,
		setModelId,
		defaultModel: state.defaultModel,
		saveDefaultModel,
		isLoading: state.isLoading,
		error: state.error,
		reload: load,
	};
}
