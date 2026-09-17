import type { AdminIdentity } from "./sessions";
export function can_edit_article(user: AdminIdentity, owner_id: unknown): boolean {
	return user.role !== "editor" || owner_id === user.id;
}
