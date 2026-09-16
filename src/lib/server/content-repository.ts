import { asc, desc, eq, and } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { renderHtml } from "@tanstack/markdown";
import * as v from "valibot";
import type { Picture } from "@sveltejs/enhanced-img";
import type { ContentAsset, ContentAssetMap } from "./content-assets";
import * as schema from "./db/schema";

const text_value = v.string();
const asset_reference_schema = v.object({ asset_key: v.string(), image_alt: v.string() });
const seo_schema = v.object({ title: text_value, description: text_value });

const site_document_schema = v.object({
	contact: v.object({ email: text_value, email_href: text_value }),
});

const home_document_schema = v.object({
	seo: seo_schema,
	hero: v.object({ title: text_value, highlight: text_value, image: asset_reference_schema }),
	national_olympiad: v.object({
		link_label: text_value,
		link_href: v.literal("/olimpiadas/nacionales"),
		information_items: v.array(
			v.object({
				id: text_value,
				title: text_value,
				icon: v.picklist(["info", "lightbulb", "newspaper"]),
				href: v.picklist(["/olimpiadas/nacionales", "/entrenamiento", "/noticias"]),
			}),
		),
	}),
	about: v.object({
		eyebrow: text_value,
		title: text_value,
		description_html: text_value,
		link_label: text_value,
		link_href: v.literal("/nosotros"),
		image: asset_reference_schema,
	}),
	sponsor: v.object({ title: text_value }),
	olympiad_cards: v.array(
		v.object({
			id: text_value,
			title: text_value,
			description: text_value,
			href: v.picklist(["/olimpiadas/nacionales", "/olimpiadas/internacionales"]),
			link_label: text_value,
		}),
	),
	national_facts: v.object({
		title: text_value,
		image: asset_reference_schema,
		facts: v.array(text_value),
	}),
	follow: v.object({ eyebrow: text_value, title: text_value }),
});

const contact_document_schema = v.object({
	seo: seo_schema,
	intro: v.object({ title: text_value, description: text_value }),
	contact: v.object({ heading: text_value, card_title: text_value }),
	follow: v.object({ heading: text_value, description: text_value }),
	form: v.object({
		title: text_value,
		required_notice_before: text_value,
		required_notice_after: text_value,
		invalid_notice: text_value,
		fields: v.object({
			full_name: v.object({ label: text_value, placeholder: text_value }),
			email: v.object({ label: text_value, placeholder: text_value }),
			institution: v.object({ label: text_value, placeholder: text_value }),
			subject: v.object({ label: text_value, placeholder: text_value }),
			message: v.object({ label: text_value, placeholder: text_value, help: text_value }),
		}),
		submit_label: text_value,
		pending_label: text_value,
		success_message: text_value,
	}),
});

const training_document_schema = v.object({
	seo: seo_schema,
	intro: v.object({ title: text_value, description: text_value }),
	section: v.object({ title: text_value, description: text_value }),
});

const about_document_schema = v.object({
	seo: v.object({
		title: text_value,
		description: text_value,
		image: asset_reference_schema,
	}),
	alert: text_value,
	labor: v.object({
		eyebrow: text_value,
		title: text_value,
		description: text_value,
		image: asset_reference_schema,
	}),
	values_cards: v.array(
		v.object({
			number: text_value,
			title: text_value,
			description: v.optional(text_value),
			values: v.optional(v.array(text_value)),
		}),
	),
	members_heading: text_value,
	team: v.object({ eyebrow: text_value, title: text_value }),
});

const news_document_schema = v.object({
	seo: seo_schema,
	intro: v.object({ eyebrow: text_value, title: text_value, description: text_value }),
});

const olympiads_document_schema = v.object({
	intro: v.object({
		title_lines: v.array(v.object({ text: text_value, class: v.optional(text_value) })),
		description: text_value,
	}),
	section_title: text_value,
	routes: v.array(
		v.object({
			label: text_value,
			href: v.picklist(["/olimpiadas/internacionales", "/olimpiadas/nacionales"]),
		}),
	),
});

const national_document_schema = v.object({
	seo: seo_schema,
	information: v.object({
		eyebrow: text_value,
		title: text_value,
		description: text_value,
		registration_title: text_value,
		registration_description: text_value,
	}),
	follow: v.object({ eyebrow: text_value, title: text_value, description: text_value }),
	levels: v.object({ eyebrow: text_value, title: text_value, description: text_value }),
	preparation: v.object({
		eyebrow: text_value,
		title: text_value,
		description: text_value,
		href: text_value,
		link_label: text_value,
	}),
	prizes: v.object({ eyebrow: text_value, title: text_value, paragraphs: v.array(text_value) }),
	awards: v.object({ eyebrow: text_value, image: asset_reference_schema }),
	video: v.object({ href: text_value, image: asset_reference_schema, label: text_value }),
	facts: v.array(v.object({ id: text_value, text: text_value })),
});

const international_document_schema = v.object({
	seo: seo_schema,
	intro: v.object({ eyebrow: text_value, title: text_value, description: text_value }),
	sponsors: v.object({ eyebrow: text_value }),
});

type ContentDatabase = LibSQLDatabase<typeof schema>;

export class ContentRepositoryError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "ContentRepositoryError";
	}
}

export function resolve_content_asset(asset_key: string, assets: ContentAssetMap): ContentAsset {
	const asset = assets[asset_key];
	if (!asset) {
		throw new ContentRepositoryError(`Required content asset is missing: ${asset_key}`);
	}
	return asset;
}

function resolve_static_asset(asset_key: string, assets: ContentAssetMap): string {
	const asset = resolve_content_asset(asset_key, assets);
	if (typeof asset !== "string") {
		throw new ContentRepositoryError(`Content asset must be a static URL: ${asset_key}`);
	}
	return asset;
}

function resolve_picture_asset(asset_key: string, assets: ContentAssetMap): Picture {
	const asset = resolve_content_asset(asset_key, assets);
	if (typeof asset === "string") {
		throw new ContentRepositoryError(`Content asset must be an enhanced image: ${asset_key}`);
	}
	return asset;
}

function resolve_picture_reference(
	reference: v.InferOutput<typeof asset_reference_schema>,
	assets: ContentAssetMap,
) {
	return {
		image: resolve_picture_asset(reference.asset_key, assets),
		image_alt: reference.image_alt,
	};
}

function resolve_document_image<T extends { image: v.InferOutput<typeof asset_reference_schema> }>(
	value: T,
	assets: ContentAssetMap,
) {
	const { image, ...fields } = value;
	return { ...fields, ...resolve_picture_reference(image, assets) };
}

function validation_message(key: string, issues: v.BaseIssue<unknown>[]) {
	const details = issues
		.map(
			(issue) =>
				`${issue.path?.map((entry) => entry.key).join(".") || "document"}: ${issue.message}`,
		)
		.join("; ");
	return `Invalid page content document "${key}": ${details}`;
}

export function create_content_repository(database: ContentDatabase, assets: ContentAssetMap) {
	async function load_page_document<
		TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	>(key: string, document_schema: TSchema): Promise<v.InferOutput<TSchema>> {
		const [row] = await database
			.select({ document: schema.page_content.document })
			.from(schema.page_content)
			.where(eq(schema.page_content.key, key))
			.limit(1);

		if (!row) {
			throw new ContentRepositoryError(`Required page content is missing: ${key}`);
		}

		const result = v.safeParse(document_schema, row.document);
		if (!result.success) {
			throw new ContentRepositoryError(validation_message(key, result.issues));
		}
		return result.output;
	}

	async function get_site_content() {
		const [document, social_links] = await Promise.all([
			load_page_document("site", site_document_schema),
			database
				.select({
					id: schema.social_link.id,
					label: schema.social_link.label,
					href: schema.social_link.href,
					class_name: schema.social_link.class_name,
					path: schema.social_link.icon_path,
				})
				.from(schema.social_link)
				.orderBy(asc(schema.social_link.sort_order)),
		]);
		return { copyright_year: new Date().getFullYear(), ...document, social_links };
	}

	async function get_national_olympiad() {
		const [olympiad] = await database
			.select({
				id: schema.national_olympiad.id,
				title: schema.national_olympiad.title,
				announcement: schema.national_olympiad.announcement,
			})
			.from(schema.national_olympiad)
			.where(eq(schema.national_olympiad.key, "current"))
			.limit(1);
		if (!olympiad) {
			throw new ContentRepositoryError("Required national olympiad is missing: current");
		}
		const stages = await database
			.select({
				label: schema.national_olympiad_stage.label,
				date: schema.national_olympiad_stage.date,
			})
			.from(schema.national_olympiad_stage)
			.where(eq(schema.national_olympiad_stage.national_olympiad_id, olympiad.id))
			.orderBy(asc(schema.national_olympiad_stage.sort_order));
		return { title: olympiad.title, announcement: olympiad.announcement, stages };
	}

	async function get_home_content() {
		const [document, sponsors] = await Promise.all([
			load_page_document("home", home_document_schema),
			get_sponsors("home"),
		]);
		const [home_sponsor] = sponsors;
		if (!home_sponsor) {
			throw new ContentRepositoryError("Required sponsor placement is missing: home");
		}
		return {
			...document,
			hero: resolve_document_image(document.hero, assets),
			about: resolve_document_image(document.about, assets),
			sponsor: {
				title: document.sponsor.title,
				image: home_sponsor.image,
				image_alt: home_sponsor.image_alt,
			},
			national_facts: resolve_document_image(document.national_facts, assets),
		};
	}

	async function get_sponsors(page_key: string) {
		const rows = await database
			.select({
				id: schema.sponsor.id,
				name: schema.sponsor.name,
				asset_key: schema.sponsor.asset_key,
				image_alt: schema.sponsor.image_alt,
			})
			.from(schema.sponsor_placement)
			.innerJoin(schema.sponsor, eq(schema.sponsor.id, schema.sponsor_placement.sponsor_id))
			.where(eq(schema.sponsor_placement.page_key, page_key))
			.orderBy(asc(schema.sponsor_placement.sort_order));
		return rows.map(({ asset_key, ...row }) => ({
			...row,
			image: resolve_static_asset(asset_key, assets),
		}));
	}

	async function get_contact_content() {
		const document = await load_page_document("contact", contact_document_schema);
		const { success_message, ...form } = document.form;
		void success_message;
		return { ...document, form };
	}

	async function get_contact_success_message() {
		const document = await load_page_document("contact", contact_document_schema);
		return document.form.success_message;
	}

	async function get_training_content() {
		const [document, materials] = await Promise.all([
			load_page_document("training", training_document_schema),
			database
				.select({
					id: schema.training_material.id,
					title: schema.training_material.title,
					description: schema.training_material.description,
					icon: schema.training_material.icon,
					asset_key: schema.training_material.asset_key,
					image_alt: schema.training_material.image_alt,
					href: schema.training_material.href,
				})
				.from(schema.training_material)
				.orderBy(asc(schema.training_material.sort_order)),
		]);
		return {
			...document,
			materials: materials.map(({ asset_key, ...material }) => ({
				...material,
				image: asset_key ? resolve_static_asset(asset_key, assets) : null,
			})),
		};
	}

	async function get_team(placement: "member" | "director") {
		const rows = await database
			.select({
				id: schema.team_member.id,
				name: schema.team_member.name,
				role: schema.team_member.role,
				contact: schema.team_member.contact,
				asset_key: schema.team_member.asset_key,
				image_alt: schema.team_member.image_alt,
			})
			.from(schema.team_member_placement)
			.innerJoin(
				schema.team_member,
				eq(schema.team_member.id, schema.team_member_placement.team_member_id),
			)
			.where(
				and(
					eq(schema.team_member_placement.page_key, "about"),
					eq(schema.team_member_placement.placement, placement),
				),
			)
			.orderBy(asc(schema.team_member_placement.sort_order));
		return rows;
	}

	async function get_about_content() {
		const [document, member_rows, director_rows] = await Promise.all([
			load_page_document("about", about_document_schema),
			get_team("member"),
			get_team("director"),
		]);
		return {
			...document,
			seo: (() => {
				const { image, ...seo } = document.seo;
				return {
					...seo,
					image: resolve_static_asset(image.asset_key, assets),
					image_alt: image.image_alt,
				};
			})(),
			labor: resolve_document_image(document.labor, assets),
			members: member_rows.map((member) => member.name),
			directors: director_rows.map(({ asset_key, image_alt, role, contact, ...member }) => {
				if (!asset_key || !image_alt || !role) {
					throw new ContentRepositoryError(`Director content is incomplete: ${member.id}`);
				}
				return {
					...member,
					role,
					...(contact ? { contact } : {}),
					image: resolve_picture_asset(asset_key, assets),
					image_alt,
				};
			}),
		};
	}

	async function get_news_content() {
		return load_page_document("news", news_document_schema);
	}

	async function get_olympiads_content() {
		return load_page_document("olympiads", olympiads_document_schema);
	}

	async function get_national_content() {
		const [document, olympiad] = await Promise.all([
			load_page_document("national", national_document_schema),
			database
				.select({ id: schema.national_olympiad.id })
				.from(schema.national_olympiad)
				.where(eq(schema.national_olympiad.key, "current"))
				.limit(1),
		]);
		const [current] = olympiad;
		if (!current) {
			throw new ContentRepositoryError("Required national olympiad is missing: current");
		}
		const levels = await database
			.select({
				id: schema.national_olympiad_level.id,
				name: schema.national_olympiad_level.name,
				description: schema.national_olympiad_level.description,
			})
			.from(schema.national_olympiad_level)
			.where(eq(schema.national_olympiad_level.national_olympiad_id, current.id))
			.orderBy(asc(schema.national_olympiad_level.sort_order));
		return {
			...document,
			levels: { ...document.levels, items: levels },
			awards: resolve_document_image(document.awards, assets),
			video: resolve_document_image(document.video, assets),
		};
	}

	async function get_international_content() {
		const [document, olympiads, sponsors] = await Promise.all([
			load_page_document("international", international_document_schema),
			database
				.select({
					id: schema.international_olympiad.id,
					name: schema.international_olympiad.name,
					description: schema.international_olympiad.description,
					asset_key: schema.international_olympiad.asset_key,
					image_alt: schema.international_olympiad.image_alt,
					href: schema.international_olympiad.href,
				})
				.from(schema.international_olympiad)
				.orderBy(asc(schema.international_olympiad.sort_order)),
			get_sponsors("international"),
		]);
		return {
			...document,
			olympiads: olympiads.map(({ asset_key, href, ...olympiad }) => ({
				...olympiad,
				image: resolve_content_asset(asset_key, assets),
				href: href ?? undefined,
			})),
			sponsors: {
				...document.sponsors,
				items: sponsors.map(({ image_alt, ...sponsor }) => {
					void image_alt;
					return sponsor;
				}),
			},
		};
	}

	async function get_articles() {
		return database
			.select({
				slug: schema.news_article.slug,
				category: schema.news_article.category,
				date: schema.news_article.date,
				date_published: schema.news_article.date_published,
				author: schema.news_article.author,
				title: schema.news_article.title,
				summary: schema.news_article.summary,
				link_label: schema.news_article.link_label,
			})
			.from(schema.news_article)
			.orderBy(desc(schema.news_article.date_published), asc(schema.news_article.sort_order));
	}

	async function get_article(slug: string) {
		const [article] = await database
			.select({
				slug: schema.news_article.slug,
				category: schema.news_article.category,
				date: schema.news_article.date,
				date_published: schema.news_article.date_published,
				author: schema.news_article.author,
				title: schema.news_article.title,
				summary: schema.news_article.summary,
				link_label: schema.news_article.link_label,
				body_markdown: schema.news_article.body_markdown,
			})
			.from(schema.news_article)
			.where(eq(schema.news_article.slug, slug))
			.limit(1);
		if (!article) return undefined;
		const { body_markdown, ...metadata } = article;
		return { ...metadata, body_html: renderHtml(body_markdown, { allowHtml: false }) };
	}

	return {
		load_page_document,
		get_site_content,
		get_national_olympiad,
		get_home_content,
		get_contact_content,
		get_contact_success_message,
		get_training_content,
		get_about_content,
		get_news_content,
		get_olympiads_content,
		get_national_content,
		get_international_content,
		get_articles,
		get_article,
	};
}
