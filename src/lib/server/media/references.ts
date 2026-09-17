import type { SqlExecutor } from "../cms/transactions";
import { COLLECTIONS, definition, type Collection } from "../cms/registry";

export async function media_references(tx: SqlExecutor, id: string) {
	const references: string[] = [];
	for (const name of Object.keys(COLLECTIONS) as Collection[]) {
		const def = definition(name);
		const fields = def.fields.filter(
			(f) => f.name.endsWith("media_id") || (!f.numeric && !f.primary),
		);
		if (!fields.length) continue;
		const result = await tx.execute({
			sql:
				'SELECT 1 FROM "' +
				name +
				'" WHERE ' +
				fields
					.map((f) => '"' + f.name + '"' + (f.name.endsWith("media_id") ? " = ?" : " LIKE ?"))
					.join(" OR ") +
				" LIMIT 1",
			args: fields.map((f) => (f.name.endsWith("media_id") ? id : "%/media/" + id + "/%")),
		});
		if (result.rows.length) references.push(def.label);
	}
	return references;
}
