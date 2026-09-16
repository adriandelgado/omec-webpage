import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { readFile, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { Picture } from "@sveltejs/enhanced-img";
import {
	ContentRepositoryError,
	create_content_repository,
	resolve_content_asset,
} from "./content-repository";
import * as schema from "./db/schema";

const CONTENT_TABLE_COUNTS = {
	page_content: 9,
	social_link: 3,
	national_olympiad: 1,
	national_olympiad_stage: 3,
	national_olympiad_level: 6,
	international_olympiad: 9,
	sponsor: 3,
	sponsor_placement: 4,
	team_member: 30,
	team_member_placement: 35,
	training_material: 5,
	news_article: 1,
} as const;

const FAKE_PICTURE = {} as Picture;
const FAKE_ASSETS = {
	"home/hero": FAKE_PICTURE,
	"home/about": FAKE_PICTURE,
	"home/national": FAKE_PICTURE,
	"logos/apmo": "/logos/apmo.svg",
	"logos/egmo": "/logos/egmo.svg",
	"logos/igo": "/logos/igo.svg",
	"logos/mayo": "/logos/mayo.svg",
	"logos/omec": "/logos/omec.svg",
	"logos/sedem": "/logos/sedem.svg",
	"logos/ucsg": "/logos/ucsg.svg",
	"logos/usfq": "/logos/usfq.svg",
	"about/imo-2018": "/about/imo-2018.jpg",
	"about/imo-2018-enhanced": FAKE_PICTURE,
	"directors/fernando-gomez": FAKE_PICTURE,
	"directors/lucero-llanos": FAKE_PICTURE,
	"directors/pablo-serrano": FAKE_PICTURE,
	"directors/pedro-suarez": FAKE_PICTURE,
	"directors/valeria-santana": FAKE_PICTURE,
	"international/ciim": FAKE_PICTURE,
	"international/cono-sur": FAKE_PICTURE,
	"international/egmo": FAKE_PICTURE,
	"international/imo": FAKE_PICTURE,
	"international/pagmo": FAKE_PICTURE,
	"international/tjm": FAKE_PICTURE,
	"national/awards-2019": FAKE_PICTURE,
	"national/video-2019": FAKE_PICTURE,
} as const;

let temp_directory: string;
let client: Client;
let repository: ReturnType<typeof create_content_repository>;

async function apply_initial_migration(database_client: Client) {
	const migration = await readFile(
		join(process.cwd(), "drizzle/0000_chemical_the_phantom.sql"),
		"utf8",
	);
	const statements = migration
		.split("--> statement-breakpoint")
		.map((statement) => statement.trim())
		.filter(Boolean)
		.map((sql) => ({ sql, args: [] }));

	await database_client.batch(statements, "write");
}

beforeEach(async () => {
	temp_directory = await mkdtemp(join(tmpdir(), "omec-content-test-"));
	client = createClient({ url: `file:${join(temp_directory, "content.db")}` });
	await client.execute("PRAGMA foreign_keys = ON");
	await client.execute(
		"CREATE TABLE preexisting_table (id INTEGER PRIMARY KEY, value TEXT NOT NULL)",
	);
	await client.execute({
		sql: "INSERT INTO preexisting_table (id, value) VALUES (?, ?)",
		args: [1, "preserved"],
	});
	await apply_initial_migration(client);
	repository = create_content_repository(drizzle(client, { schema }), FAKE_ASSETS);
});

afterEach(async () => {
	client.close();
	await rm(temp_directory, { recursive: true, force: true });
});

describe("initial content migration", () => {
	test("creates and seeds only the content model alongside existing tables", async () => {
		for (const [table_name, expected_count] of Object.entries(CONTENT_TABLE_COUNTS)) {
			const result = await client.execute(`SELECT count(*) AS count FROM ${table_name}`);
			expect(Number(result.rows[0]?.count)).toBe(expected_count);
		}

		const sentinel = await client.execute("SELECT value FROM preexisting_table WHERE id = 1");
		expect(sentinel.rows[0]?.value).toBe("preserved");
	});

	test("enforces foreign keys and deterministic-order uniqueness", async () => {
		await expect(
			client.execute({
				sql: "INSERT INTO sponsor_placement (sponsor_id, page_key, sort_order) VALUES (?, ?, ?)",
				args: ["missing", "test", 0],
			}),
		).rejects.toThrow();

		await expect(
			client.execute({
				sql: "INSERT INTO social_link (id, label, href, class_name, icon_path, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
				args: ["duplicate-order", "Duplicate", "https://example.com", "class", "path", 0],
			}),
		).rejects.toThrow();
	});
});

describe("content repository", () => {
	test("validates page documents and reports the failing key", async () => {
		await client.execute({
			sql: "UPDATE page_content SET document = ? WHERE key = ?",
			args: [JSON.stringify({ seo: { title: "missing description" } }), "news"],
		});

		await expect(repository.get_news_content()).rejects.toThrow(
			'Invalid page content document "news"',
		);
	});

	test("reports missing required content and assets clearly", async () => {
		await client.execute({ sql: "DELETE FROM page_content WHERE key = ?", args: ["news"] });
		await expect(repository.get_news_content()).rejects.toThrow(
			new ContentRepositoryError("Required page content is missing: news"),
		);
		expect(() => resolve_content_asset("missing/asset", {})).toThrow(
			"Required content asset is missing: missing/asset",
		);
	});

	test("assembles every public payload and resolves its assets", async () => {
		const [
			site,
			olympiad,
			home,
			contact,
			training,
			about,
			news,
			olympiads,
			national,
			international,
		] = await Promise.all([
			repository.get_site_content(),
			repository.get_national_olympiad(),
			repository.get_home_content(),
			repository.get_contact_content(),
			repository.get_training_content(),
			repository.get_about_content(),
			repository.get_news_content(),
			repository.get_olympiads_content(),
			repository.get_national_content(),
			repository.get_international_content(),
		]);

		expect(site.social_links.map((link) => link.id)).toEqual(["facebook", "instagram", "tiktok"]);
		expect(olympiad.stages.map((stage) => stage.label)).toEqual([
			"Primera fase",
			"Segunda fase",
			"Fase final",
		]);
		expect(home.hero.image).toBeTruthy();
		expect(home.sponsor.image).toContain("ucsg");
		expect(contact.form).not.toHaveProperty("success_message");
		expect(await repository.get_contact_success_message()).toContain("Gracias por escribirnos");
		expect(training.materials.map((material) => material.id)).toEqual([
			"estudio-a-profundidad",
			"olimpiada-nacional",
			"olimpiadas-internacionales",
			"pruebas-selectivas",
			"listas-semanales",
		]);
		expect(about.members).toHaveLength(30);
		expect(about.directors.map((director) => director.id)).toEqual([
			"fernando-gomez",
			"pablo-serrano",
			"lucero-llanos",
			"valeria-santana",
			"pedro-suarez",
		]);
		expect(news.intro.title).toBe("Noticias");
		expect(olympiads.routes).toHaveLength(2);
		expect(national.levels.items.map((level) => level.id)).toEqual([
			"nivel-b",
			"nivel-a",
			"nivel-1",
			"nivel-2",
			"nivel-3",
			"nivel-u",
		]);
		expect(international.olympiads.map((entry) => entry.id)).toEqual([
			"imo",
			"egmo",
			"cono-sur",
			"pagmo",
			"tjm",
			"apmo",
			"mayo",
			"igo",
			"ciim",
		]);
		expect(international.sponsors.items.map((item) => item.id)).toEqual([
			"usfq",
			"egcs-ucsg",
			"sponsor",
		]);
	});

	test("sorts article summaries by ISO publication date", async () => {
		await client.execute({
			sql: "INSERT INTO news_article (slug, category, date, date_published, author, title, summary, link_label, body_markdown, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			args: [
				"newer-article",
				"Noticias",
				"1 de enero de 2027",
				"2027-01-01",
				"OMEC",
				"Nueva noticia",
				"Resumen",
				"Leer noticia →",
				"Contenido",
				1,
			],
		});

		const articles = await repository.get_articles();
		expect(articles.map((article) => article.slug)).toEqual([
			"newer-article",
			"logros-de-la-omec-en-2026",
		]);
	});

	test("renders Markdown without enabling raw HTML", async () => {
		await client.execute({
			sql: "UPDATE news_article SET body_markdown = ? WHERE slug = ?",
			args: ["## Seguro\n\n**texto**\n\n<script>alert(1)</script>", "logros-de-la-omec-en-2026"],
		});

		const article = await repository.get_article("logros-de-la-omec-en-2026");
		expect(article?.body_html).toContain("<strong>texto</strong>");
		expect(article?.body_html).not.toContain("<script>");
	});

	test("returns undefined for an unknown article slug", async () => {
		await expect(repository.get_article("does-not-exist")).resolves.toBeUndefined();
	});
});
