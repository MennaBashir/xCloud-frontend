/**
 * Email GET endpoints — mirrors `xcloud/src/presentation/email_api.py`.
 *
 *   GET /email/?folder=&page=&per_page=  -> { emails, total, page, per_page }
 *   GET /email/{id}                       -> EmailDto
 *   GET /email/account                    -> EmailAccountDto (404 if none)
 */
import { request } from "../client";

export type EmailDto = {
	id: string;
	account_id: string | null;
	message_id: string | null;
	sender: string;
	recipients: string;
	subject: string | null;
	body: string | null;
	is_read: boolean;
	is_starred: boolean;
	folder: string;
	received_at: string | null;
	created_at: string | null;
};

export type EmailListResponse = {
	emails: EmailDto[];
	total: number;
	page: number;
	per_page: number;
};

export type EmailAccountDto = {
	id: string;
	provider: string;
	email_address: string;
	smtp_server: string;
	smtp_port: number;
	smtp_username: string | null;
	imap_server: string;
	imap_port: number;
	imap_username: string | null;
	created_at: string | null;
};

export function listEmails(params: {
	folder?: string;
	page?: number;
	perPage?: number;
} = {}): Promise<EmailListResponse> {
	return request<EmailListResponse>("GET", "/email/", {
		query: {
			folder: params.folder ?? "inbox",
			page: params.page ?? 1,
			per_page: params.perPage ?? 50,
		},
	});
}

export function getEmail(id: string): Promise<EmailDto> {
	return request<EmailDto>("GET", `/email/${id}`);
}

export function getAccount(): Promise<EmailAccountDto> {
	return request<EmailAccountDto>("GET", "/email/account");
}
