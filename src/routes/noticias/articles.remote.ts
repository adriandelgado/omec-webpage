import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { renderHtml } from "@tanstack/markdown";
import * as v from "valibot";

const ARTICLES = [
	{
		slug: "logros-de-la-omec-en-2026",
		category: "Noticias",
		date: "13 de agosto de 2026",
		date_published: "2026-08-13",
		author: "OMEC",
		title: "Logros de la OMEC en 2026",
		summary:
			"17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo.",
		link_label: "Leer noticia →",
		body_markdown: `## 17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo

La Olimpiada Matemática Ecuatoriana (**OMEC**), a través de la Fundación Olimpiadas Ecuatorianas de Ciencias (**FOEC**), organización a cargo de la selección de los equipos que representan al país en olimpiadas matemáticas internacionales, anuncia con orgullo los resultados obtenidos en las más recientes participaciones internacionales.

### Una medalla de bronce y 3 menciones en la Olimpiada del Cono Sur

Del 3 al 8 de agosto de 2026, se celebró en Lima, Perú, la 37.ª **Olimpiada Matemática de Países del Cono Sur**. En esta competencia para estudiantes de hasta 16 años, Ecuador obtuvo una medalla de bronce y 3 menciones de honor.

La **medalla de bronce** fue alcanzada por **Maximiliano Alonso Parada** (Colegio IPAC de Samborondón). Los estudiantes **Nicolás Guasgua Izquierdo** (U.E. Atahualpa de Quito), **Leonel Vargas Moreira** (Colegio Interamericano de Guayaquil) y **Juan Coloma Riera** (U.E. San José La Salle de Guayaquil) obtuvieron **mención de honor**, al resolver perfectamente uno de los seis problemas.

### 1 medalla de oro, 3 de plata, 9 de bronce y dos menciones en la Olimpiada de Mayo

En agosto también se revelaron los resultados de la **Olimpiada de Mayo**.

Esta es una competencia internacional, organizada por la Olimpiada Matemática Argentina (OMA), que reúne a estudiantes de América Latina, España y Portugal y representa uno de los primeros escenarios internacionales para jóvenes talentos matemáticos de la región, con categorías sub-15 y sub-13.

### Nivel 1:

| Nombres | Institución | Premio |
| --- | --- | --- |
| Ana Isabel Erazo Placencia | Saint Dominic School (Quito) | plata |
| Henry Eduardo Chica Guadamud | Unidad Educativa Arco Iris (Portoviejo) | plata |
| Emanuel Javier Vásquez Vela | Unidad Educativa La Asunción (Guayaquil) | bronce |
| Emilio Thomas Cruz López | Unidad Educativa Particular Zarán (Quito) | bronce |
| Alejandra América Montenegro Escalante | Logos Academy (Guayaquil) | bronce |
| Amelie Catalina Castro Galarza | Unidad Educativa Liceo Cristiano (Guayaquil) | bronce |
| Jesús Moisan Yépez Hidalgo | Unidad Educativa Liceo Cristiano (Guayaquil) | mención |

### Nivel 2:

| Nombres | Institución | Premio |
| --- | --- | --- |
| Maximiliano Andrés Alonso Parada | Instituto Particular Abdón Calderón (Samborondón) | oro |
| Nicolás Mateo Guasgua Izquierdo | Unidad Educativa Atahualpa (Quito) | plata |
| Eduardo Morales Grandal |  | bronce |
| Martín Ezequiel Villacrés Terán | Unidad Educativa Fiscomisional San Francisco (Ibarra) | bronce |
| Juan Sebastián Coloma Riera | Unidad Educativa San José La Salle (Guayaquil) | bronce |
| Ezequiel Leandro Soto Estrada | Unidad Educativa Bilingüe Tejar (Daule) | bronce |
| Ana Zambrano Corredor | Colegio Interamericano (Guayaquil) | bronce |
| Josué Sebastián Navarrete Romero | Unidad Educativa Liceo Cristiano (Guayaquil) | mención |

### Olimpiada Matemática de Asia-Pacífico (APMO)

**Luis Fernando Zavala Freire** (Colegio IPAC, Samborondón) obtuvo **mención de honor** en la Asian Pacific Mathematical Olympiad (**APMO**). Esta olimpiada por correspondencia tiene un nivel de dificultad comparable al de la Olimpiada Internacional de Matemática (IMO), tanto por la complejidad de sus problemas como por el alto nivel académico de los países que participan.

### Otros reconocimientos de 2026

OMEC también se encargó de la selección y el entrenamiento del equipo de 6 estudiantes que viajó en julio de 2026 a Shanghái, China. En la **67.ª International Mathematical Olympiad** (**IMO**), que es la olimpiada matemática de mayor antigüedad y prestigio mundial, los estudiantes **Ricardo De Blas Camacho** (U.E. Torremar, Daule) y **Maximiliano Alonso Parada** (IPAC, Samborondón) regresaron con **menciones de honor**, al resolver cada uno dos problemas perfectos.

Asimismo, OMEC coorganizó junto con Binaria Matemática de Perú el **Concurso Binacional de Matemáticas Perú-Ecuador**, que se desarrolló en junio de 2026 en la Universidad de Especialidades Espíritu Santo (UEES). Ecuador obtuvo **2 medallas de oro**, **11 de plata** y **28 de bronce**.

En marzo de 2026, 20 estudiantes de entre 12 y 16 años, seleccionados por OMEC, viajaron al **6.° Torneo de Jóvenes Matemáticos** (**TJM**), que se desarrolló en Perú. Ecuador volvió de esta competencia con **2 medallas de plata**, **3 de bronce** y **4 menciones de honor** en la modalidad individual; y con **5 medallas de oro** y **5 de plata** en la modalidad grupal.`,
	},
] as const;

const ARTICLE_SUMMARIES = ARTICLES.map(({ body_markdown, ...article_summary }) => {
	void body_markdown;
	return article_summary;
});

export const get_articles = query(() => ARTICLE_SUMMARIES);

export const get_article = query(v.string(), (slug) => {
	const article = ARTICLES.find((candidate) => candidate.slug === slug);

	if (!article) {
		error(404, "La noticia solicitada no existe.");
	}

	const { body_markdown, ...article_metadata } = article;

	return {
		...article_metadata,
		body_html: renderHtml(body_markdown, { allowHtml: false }),
	};
});
