/**
 * Email PATCH endpoints — mirrors `xcloud/src/presentation/email_api.py`.
 *
 *   PATCH /email/{id}/read  -> EmailDto
 */
import { request } from "../client";

import type { EmailDto } from "../get/email";

export function markEmailRead(id: string): Promise<EmailDto> {
	return request<EmailDto>("PATCH", `/email/${id}/read`);
}

export function setEmailStar(id: string, starred: boolean): Promise<EmailDto> {
	return request<EmailDto>("PATCH", `/email/${id}/star`, {
		body: { starred },
	});
}

export function archiveEmail(id: string): Promise<EmailDto> {
	return request<EmailDto>("PATCH", `/email/${id}/archive`);
}
