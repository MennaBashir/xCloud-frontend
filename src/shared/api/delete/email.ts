/**
 * Email DELETE endpoints — mirrors `xcloud/src/presentation/email_api.py`.
 *
 *   DELETE /email/{id}  -> { status }
 */
import { request } from "../client";

export function deleteEmail(id: string): Promise<{ status: string }> {
	return request<{ status: string }>("DELETE", `/email/${id}`);
}
