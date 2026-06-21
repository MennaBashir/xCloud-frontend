import { request } from "../client";

export type DeleteTaskParams = {
    token?: string;
    taskId: string;
};

export async function deleteTask({ token, taskId }: DeleteTaskParams) {
    await request("DELETE", `/tasks/${taskId}`, {
        token,
    });
}