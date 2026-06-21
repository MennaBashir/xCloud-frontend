/**
 * Email POST endpoints — mirrors `xcloud/src/presentation/email_api.py`.
 *
 *   POST /email/send  -> EmailDto
 *   POST /email/sync  -> { synced, total_unseen }
 */
import { request } from "../client";

import type { EmailDto } from "../get/email";

export type SendEmailBody = {
	to: string;
	subject: string;
	body: string;
};

export type SyncResult = {
	synced: number;
	total_unseen: number;
};

export function sendEmail(body: SendEmailBody): Promise<EmailDto> {
	return request<EmailDto>("POST", "/email/send", { body });
}

export function syncInbox(): Promise<SyncResult> {
	return request<SyncResult>("POST", "/email/sync");
}
