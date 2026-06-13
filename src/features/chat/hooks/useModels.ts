import { useCallback, useEffect, useState } from "react";

import { llmGet } from "@/shared/api";

import { useChatStore } from "../store/chatStore";
import { isEmbeddingModel, modelToChatModel } from "../lib/adapters";
import type { ChatModel } from "../types/chat";

type ModelsState = {
	models: ChatModel[];
	isLoading: boolean;
	error: string | null;
};

/**
 * Loads the available Ollama models and the backend default.
 *
 * Smart default: the active model is set to the first non-embedding model so
 * that chatting works out of the box even when the backend's resolved default
 * happens to be an embedding model.
 */
export function useModels() {
	const modelId = useChatStore((s) => s.modelId);
	const setModelId = useChatStore((s) => s.setModelId);
	const [state, setState] = useState<ModelsState>({
		models: [],
		isLoading: true,
		error: null,
	});

	const load = useCallback(async () => {
		setState((s) => ({ ...s, isLoading: true, error: null }));
		try {
			const [rawModels, def] = await Promise.all([
				llmGet.listModels(),
				llmGet.getDefaultModel().catch(() => ({ default_model: null })),
			]);

			if (!Array.isArray(rawModels)) {
				setState({
					models: [],
					isLoading: false,
					error:
						rawModels.error ||
						"Could not reach Ollama. Is it running?",
				});
				return;
			}

			const models = rawModels.map(modelToChatModel);
			setState({ models, isLoading: false, error: null });

			// Resolve the active model if none is selected yet.
			const current = useChatStore.getState().modelId;
			if (!current && models.length > 0) {
				const backendDefault = def.default_model;
				const preferred =
					backendDefault && !isEmbeddingModel(backendDefault)
						? backendDefault
						: (models.find((m) => !m.isEmbedding)?.id ??
							models[0].id);
				setModelId(preferred);
			}
		} catch (err) {
			setState({
				models: [],
				isLoading: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to load models.",
			});
		}
	}, [setModelId]);

	useEffect(() => {
		void load();
	}, [load]);

	return {
		models: state.models,
		modelId,
		setModelId,
		isLoading: state.isLoading,
		error: state.error,
		reload: load,
	};
}
