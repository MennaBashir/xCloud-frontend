/**
 * Barrel for all POST endpoints.
 * Add new resource modules here as the backend grows.
 */
export * as authPost from "./auth";
export * as googleAuthPost from "./googleAuth";
export * as filesPost from "./files";
export * as llmPost from "./llm";
export * as ragPost from "./rag";
export * as taskPost from "./task";
export * as emailPost from "./email";
export * as reminderPost from "./reminder";
export * as calendarPost from "./calendar";