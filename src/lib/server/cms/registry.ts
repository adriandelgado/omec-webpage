import { getTableConfig } from "drizzle-orm/sqlite-core";
import * as schema from "../db/schema";
import * as v from "valibot";

export const COLLECTIONS = {
	site_content: "Configuración general",
	home_content: "Inicio",
	about_content: "Nosotros",
	contact_content: "Página de contacto",
	training_content: "Página de entrenamiento",
	news_content: "Página de noticias",
	olympiads_content: "Página de olimpiadas",
	national_content: "Página de nacionales",
	international_content: "Página de internacionales",
	home_information_item: "Enlaces destacados",
	home_olympiad_card: "Tarjetas de olimpiadas",
	home_national_fact: "Datos de inicio",
	about_value_card: "Tarjetas de valores",
	about_value: "Valores",
	olympiads_title_line: "Título de olimpiadas",
	olympiads_route_card: "Enlaces de olimpiadas",
	national_prize_paragraph: "Premios",
	national_fact: "Datos de nacionales",
	social_link: "Redes sociales",
	national_olympiad: "Ediciones nacionales",
	national_olympiad_stage: "Etapas",
	national_olympiad_level: "Niveles",
	international_olympiad: "Olimpiadas internacionales",
	sponsor: "Patrocinadores",
	sponsor_placement: "Ubicación de patrocinadores",
	team_member: "Equipo",
	team_member_placement: "Ubicación del equipo",
	training_material: "Materiales de entrenamiento",
	news_article: "Noticias",
	contact_submission: "Bandeja de contacto",
} as const;
export type Collection = keyof typeof COLLECTIONS;
export const COLLECTION_SCHEMA = v.picklist(
	Object.keys(COLLECTIONS) as [Collection, ...Collection[]],
);
export const VALUE_SCHEMA = v.union([v.string(), v.number(), v.null()]);
export const RECORD_SCHEMA = v.record(v.string(), VALUE_SCHEMA);
export type RecordData = Record<string, string | number | null>;
const SYSTEM_FIELDS = new Set([
	"created_at",
	"updated_at",
	"archived_at",
	"archived_by",
	"read_at",
]);
export function definition(name: Collection) {
	const config = getTableConfig(schema[name]);
	const keys = [
		...config.columns.filter((c) => c.primary).map((c) => c.name),
		...config.primaryKeys.flatMap((p) => p.columns.map((c) => c.name)),
	];
	return {
		name,
		label: COLLECTIONS[name],
		keys,
		singleton: name.endsWith("_content"),
		fields: config.columns
			.filter((column) => !SYSTEM_FIELDS.has(column.name))
			.map((column) => ({
				name: column.name,
				required: column.notNull,
				numeric: column.dataType === "number" || column.dataType === "boolean",
				boolean: column.dataType === "boolean",
				options: column.enumValues ?? [],
				primary: keys.includes(column.name),
			})),
	};
}
export function safe_url(value: string) {
	if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return true;
	try {
		const url = new URL(value);
		return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol);
	} catch {
		return false;
	}
}
export function validate_record(name: Collection, data: RecordData) {
	const def = definition(name);
	const entries: Record<string, v.GenericSchema> = {};
	for (const field of def.fields) {
		let rule: v.GenericSchema = field.numeric
			? v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(Number.MAX_SAFE_INTEGER))
			: v.pipe(v.string(), v.maxLength(field.name === "body_markdown" ? 200_000 : 10_000));
		if (field.options.length) rule = v.picklist(field.options);
		if (field.boolean) rule = v.picklist([0, 1]);
		if (field.name === "status")
			rule = v.picklist(
				name === "news_article" ? ["draft", "published"] : ["unread", "read", "archived", "spam"],
			);
		if (field.name === "slug")
			rule = v.pipe(v.string(), v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), v.maxLength(180));
		if (field.name === "edition_year")
			rule = v.pipe(v.number(), v.integer(), v.minValue(1900), v.maxValue(9999));
		if (/^(published_on|starts_on|ends_on)$/.test(field.name))
			rule = v.pipe(
				v.string(),
				v.isoDate(),
				v.check((s) => new Date(s).toISOString().slice(0, 10) === s, "Fecha inválida."),
			);
		if (/href$/.test(field.name)) rule = v.pipe(v.string(), v.check(safe_url, "URL inválida."));
		if (/email$/.test(field.name)) rule = v.pipe(v.string(), v.email());
		if (field.name === "page_key")
			rule = v.picklist(name === "sponsor_placement" ? ["home", "international"] : ["about"]);
		if (field.name.endsWith("media_id") || field.name === "owner_id")
			rule = v.pipe(v.string(), v.uuid());
		if (
			field.primary &&
			!field.numeric &&
			!field.options.length &&
			field.name !== "slug" &&
			field.name !== "page_key"
		)
			rule = v.pipe(v.string(), v.regex(/^[a-zA-Z0-9_-]{1,180}$/));
		entries[field.name] = field.required ? rule : v.nullable(rule);
	}
	const result = v.safeParse(v.strictObject(entries), data);
	if (!result.success)
		throw new Error(
			"Revisa los campos: " +
				result.issues.map((i) => i.path?.map((p) => p.key).join(".") ?? i.message).join(", "),
		);
	if (name === "news_article" && data.status === "published" && !data.published_on)
		throw new Error("Indica la fecha de publicación.");
	if (
		name === "national_olympiad_stage" &&
		((!data.starts_on && !data.date_label) ||
			(data.ends_on && (!data.starts_on || data.ends_on < data.starts_on)))
	)
		throw new Error("Revisa las fechas de la etapa.");
	return result.output as RecordData;
}
