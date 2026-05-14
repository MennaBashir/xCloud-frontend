import type { ChatModel } from "../types/chat";

export const CHAT_MODELS: ChatModel[] = [
	{
		id: "sprintifai-pro",
		label: "SprintifAI Pro",
		provider: "openai",
		tagline: "Best for cross-meeting Q&A",
	},
	{
		id: "sprintifai-fast",
		label: "SprintifAI Fast",
		provider: "anthropic",
		tagline: "Quicker, lighter answers",
	},
	{
		id: "sprintifai-summarize",
		label: "SprintifAI Summarize",
		provider: "google",
		tagline: "Tuned for meeting recaps",
	},
];

export const DEFAULT_MODEL_ID = CHAT_MODELS[0].id;
