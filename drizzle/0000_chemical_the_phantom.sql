CREATE TABLE `international_olympiad` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`asset_key` text NOT NULL,
	`image_alt` text NOT NULL,
	`href` text,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "international_olympiad_order_nonnegative" CHECK("international_olympiad"."sort_order" >= 0),
	CONSTRAINT "international_olympiad_asset_key_not_empty" CHECK(length("international_olympiad"."asset_key") > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `international_olympiad_sort_order_unique` ON `international_olympiad` (`sort_order`);--> statement-breakpoint
CREATE TABLE `national_olympiad` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`title` text NOT NULL,
	`announcement` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_key_unique` ON `national_olympiad` (`key`);--> statement-breakpoint
CREATE TABLE `national_olympiad_level` (
	`id` text PRIMARY KEY NOT NULL,
	`national_olympiad_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`national_olympiad_id`) REFERENCES `national_olympiad`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_olympiad_level_order_nonnegative" CHECK("national_olympiad_level"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_level_order_unique` ON `national_olympiad_level` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `national_olympiad_level_olympiad_idx` ON `national_olympiad_level` (`national_olympiad_id`);--> statement-breakpoint
CREATE TABLE `national_olympiad_stage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`national_olympiad_id` integer NOT NULL,
	`label` text NOT NULL,
	`date` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`national_olympiad_id`) REFERENCES `national_olympiad`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "national_olympiad_stage_order_nonnegative" CHECK("national_olympiad_stage"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_order_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `national_olympiad_stage_label_unique` ON `national_olympiad_stage` (`national_olympiad_id`,`label`);--> statement-breakpoint
CREATE INDEX `national_olympiad_stage_olympiad_idx` ON `national_olympiad_stage` (`national_olympiad_id`);--> statement-breakpoint
CREATE TABLE `news_article` (
	`slug` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`date_published` text NOT NULL,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`link_label` text NOT NULL,
	`body_markdown` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "news_article_order_nonnegative" CHECK("news_article"."sort_order" >= 0),
	CONSTRAINT "news_article_date_published_iso" CHECK("news_article"."date_published" glob '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' and date("news_article"."date_published") = "news_article"."date_published")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_article_sort_order_unique` ON `news_article` (`sort_order`);--> statement-breakpoint
CREATE INDEX `news_article_published_idx` ON `news_article` (`date_published`,`sort_order`);--> statement-breakpoint
CREATE TABLE `page_content` (
	`key` text PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "page_content_key_not_empty" CHECK(length("page_content"."key") > 0)
);
--> statement-breakpoint
CREATE TABLE `social_link` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`class_name` text NOT NULL,
	`icon_path` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "social_link_sort_order_nonnegative" CHECK("social_link"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_link_sort_order_unique` ON `social_link` (`sort_order`);--> statement-breakpoint
CREATE TABLE `sponsor` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`asset_key` text NOT NULL,
	`image_alt` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "sponsor_asset_key_not_empty" CHECK(length("sponsor"."asset_key") > 0)
);
--> statement-breakpoint
CREATE TABLE `sponsor_placement` (
	`sponsor_id` text NOT NULL,
	`page_key` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`sponsor_id`, `page_key`),
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "sponsor_placement_order_nonnegative" CHECK("sponsor_placement"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsor_placement_order_unique` ON `sponsor_placement` (`page_key`,`sort_order`);--> statement-breakpoint
CREATE INDEX `sponsor_placement_page_idx` ON `sponsor_placement` (`page_key`);--> statement-breakpoint
CREATE TABLE `team_member` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`contact` text,
	`asset_key` text,
	`image_alt` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_name_unique` ON `team_member` (`name`);--> statement-breakpoint
CREATE TABLE `team_member_placement` (
	`team_member_id` text NOT NULL,
	`page_key` text NOT NULL,
	`placement` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`team_member_id`, `page_key`, `placement`),
	FOREIGN KEY (`team_member_id`) REFERENCES `team_member`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "team_member_placement_value_valid" CHECK("team_member_placement"."placement" in ('member', 'director')),
	CONSTRAINT "team_member_placement_order_nonnegative" CHECK("team_member_placement"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_placement_order_unique` ON `team_member_placement` (`page_key`,`placement`,`sort_order`);--> statement-breakpoint
CREATE INDEX `team_member_placement_page_idx` ON `team_member_placement` (`page_key`,`placement`);--> statement-breakpoint
CREATE TABLE `training_material` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`asset_key` text,
	`image_alt` text DEFAULT '' NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "training_material_order_nonnegative" CHECK("training_material"."sort_order" >= 0),
	CONSTRAINT "training_material_media_present" CHECK("training_material"."icon" is not null or "training_material"."asset_key" is not null)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `training_material_sort_order_unique` ON `training_material` (`sort_order`);
--> statement-breakpoint
INSERT INTO `page_content` (`key`, `document`) VALUES
('site', '{"contact":{"email":"info@omec-mat.org","email_href":"mailto:info@omec-mat.org"}}'),
('home', '{"seo":{"title":"","description":"Olimpiada Matemática Ecuatoriana. Organizamos competencias, entrenamiento y procesos de selección para desarrollar el talento matemático de estudiantes ecuatorianos."},"hero":{"title":"Olimpiada Matemática","highlight":"Ecuatoriana","image":{"asset_key":"home/hero","image_alt":"Delegación ecuatoriana junto al letrero de la IMO 2026 en Shanghái"}},"national_olympiad":{"link_label":"Conoce la olimpiada nacional","link_href":"/olimpiadas/nacionales","information_items":[{"id":"information","title":"Información","icon":"info","href":"/olimpiadas/nacionales"},{"id":"preparation","title":"Preparación","icon":"lightbulb","href":"/entrenamiento"},{"id":"news","title":"Noticias","icon":"newspaper","href":"/noticias"}]},"about":{"eyebrow":"Acerca de nosotros","title":"Encontrando talentos matemáticos desde 1997","description_html":"Desde 1997, la <em>Olimpiada Matemática Ecuatoriana (OMEC)</em> detecta, forma y prepara a los talentos matemáticos que integran los equipos que representan al país en varias competencias olímpicas. Entre ellas están la <strong>Olimpiada Internacional de Matemáticas (IMO)</strong>, la <strong>Olimpiada Europea Femenina de Matemáticas (EGMO)</strong>, la <strong>Olimpiada Matemática de Asia-Pacífico (APMO)</strong> y la <strong>Olimpiada Matemática de Países del Cono Sur</strong>.","link_label":"Ver más sobre OMEC","link_href":"/nosotros","image":{"asset_key":"home/about","image_alt":"Dos estudiantes sostienen sus diplomas y medallas de la Olimpiada Matemática Ecuatoriana"}},"sponsor":{"title":"Conoce a Nuestros Auspiciantes"},"olympiad_cards":[{"id":"national","title":"Olimpiada Nacional de Matemáticas","description":"Tiene como objetivo preseleccionar a los estudiantes que formarán parte de los equipos que representan al país en los torneos internacionales en los que competimos. Está abierta a cualquier estudiante del sistema educativo ecuatoriano.","href":"/olimpiadas/nacionales","link_label":"Ver más"},{"id":"international","title":"Olimpiadas Internacionales","description":"Incluyen varias competencias presenciales y por correspondencia. A estos eventos solo se asiste con una invitación dirigida a los ganadores de la Olimpiada Nacional del año anterior.","href":"/olimpiadas/internacionales","link_label":"Ver más"}],"national_facts":{"title":"Nuestra Olimpiada Nacional de Matemáticas","image":{"asset_key":"home/national","image_alt":"Estudiantes participan en una prueba de la Olimpiada Nacional de Matemáticas"},"facts":["Participan colegios de todo el Ecuador. También se puede participar de manera independiente.","Concursantes de primaria, secundaria y universidad","Abierto a todas las provincias del Ecuador"]},"follow":{"eyebrow":"Síguenos","title":"No te pierdas de inscripciones y fechas importantes"}}'),
('contact', '{"seo":{"title":"Contáctanos","description":"Contáctate con OMEC para resolver dudas sobre olimpiadas matemáticas, inscripciones, entrenamiento y participación estudiantil en Ecuador."},"intro":{"title":"Contáctanos","description":"¿Tienes preguntas sobre las olimpiadas, el proceso de inscripción o nuestros programas de entrenamiento? Estamos aquí para ayudarte."},"contact":{"heading":"Información de Contacto","card_title":"Correo Electrónico"},"follow":{"heading":"Síguenos","description":"Mantente al día con nuestras últimas noticias, eventos y logros en nuestras redes sociales."},"form":{"title":"Envíanos un Mensaje","required_notice_before":"Todos los campos marcados con ","required_notice_after":" son obligatorios.","invalid_notice":"Revisa los campos marcados antes de enviar.","fields":{"full_name":{"label":"Nombre Completo","placeholder":"Tu nombre"},"email":{"label":"Correo Electrónico","placeholder":"tu@email.com"},"institution":{"label":"Institución","placeholder":"tu colegio"},"subject":{"label":"Asunto","placeholder":"¿Sobre qué quieres escribirnos?"},"message":{"label":"Mensaje","placeholder":"Escribe tu mensaje aquí...","help":"Cuéntanos tu consulta con el mayor detalle posible."}},"submit_label":"Enviar Mensaje","pending_label":"Enviando...","success_message":"Gracias por escribirnos. Recibimos tu mensaje y te responderemos pronto."}}'),
('training', '{"seo":{"title":"Entrenamiento","description":"Material de entrenamiento de OMEC para prepararse para competencias matemáticas nacionales e internacionales."},"intro":{"title":"Entrenamiento","description":"Nuestro material de entrenamiento"},"section":{"title":"Prepárate para las competencias","description":"La mejor manera de prepararse para concursos de matemáticas es resolviendo pruebas pasadas. En nuestro banco de problemas podrás encontrar problemas de competencias nacionales e internacionales. Asegúrate de practicar con problemas de tu nivel académico y de la competencia para la cual te estás preparando. Al hacer clic serás redirigido a una carpeta de Google Drive."}}'),
('about', '{"seo":{"title":"Acerca de nosotros","description":"Conoce la labor, misión, visión, valores y miembros de la Olimpiada Matemática Ecuatoriana.","image":{"asset_key":"about/imo-2018","image_alt":"Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018"}},"alert":"Aviso a la comunidad: Vicente Torres y Jorge Chamaidán ya no forman parte de la OMEC","labor":{"eyebrow":"Acerca de","title":"Nuestra labor","description":"Descubrir, formar e impulsar el talento matemático para contribuir al desarrollo científico, educativo y humano del Ecuador. OMEC existe para abrir oportunidades a estudiantes apasionados por las matemáticas, brindándoles espacios donde el conocimiento, la curiosidad y el esfuerzo se conviertan en herramientas para alcanzar su máximo potencial.","image":{"asset_key":"about/imo-2018-enhanced","image_alt":"Delegación ecuatoriana en la Olimpiada Internacional de Matemáticas 2018"}},"values_cards":[{"number":"01","title":"Nuestra misión","description":"Desarrollar el talento matemático mediante competencias académicas y experiencias de aprendizaje. Nuestro compromiso es proporcionar las herramientas necesarias para competir al más alto nivel, mientras cultivamos valores que trascienden el ámbito académico."},{"number":"02","title":"Nuestra visión","description":"Consolidarnos como un referente del desarrollo científico y cultural en Ecuador y América Latina, promoviendo una comunidad matemática reconocida por su excelencia académica, liderazgo, calidad humana y compromiso con la sociedad."},{"number":"03","title":"Nuestros valores","values":["Altruismo académico","Autoaprendizaje","Equidad","Honestidad","Transparencia","Trabajo en equipo"]}],"members_heading":"Miembros de la OMEC","team":{"eyebrow":"Nuestro Equipo","title":"Conoce a los directores de actividades"}}'),
('news', '{"seo":{"title":"Noticias","description":"Noticias y comunicados de la Olimpiada Matemática Ecuatoriana."},"intro":{"eyebrow":"OMEC","title":"Noticias","description":"Conoce las últimas noticias y comunicados de la Olimpiada Matemática Ecuatoriana."}}'),
('olympiads', '{"intro":{"title_lines":[{"text":"Olimpiadas"},{"text":"matemáticas","class":"text-primary"}],"description":"Conoce la Olimpiada Nacional de Matemática y las competencias internacionales en las que participan las delegaciones ecuatorianas."},"section_title":"Competencias","routes":[{"label":"Olimpiadas internacionales","href":"/olimpiadas/internacionales"},{"label":"Olimpiadas nacionales","href":"/olimpiadas/nacionales"}]}'),
('national', '{"seo":{"title":"Olimpiada Nacional de Matemática","description":"Información sobre la Olimpiada Nacional de Matemática de OMEC: fechas, niveles de participación, preparación y premios."},"information":{"eyebrow":"Información","title":"¿A quién está dirigido?","description":"Para participar es necesario ser estudiante regular de una institución educativa del país, ya sea de educación básica, bachillerato o universidad.","registration_title":"Cuándo y cómo inscribirse","registration_description":"Las fechas de inscripción cambian cada año. La convocatoria y los pasos de inscripción se publicarán en nuestras redes sociales y en esta página web."},"follow":{"eyebrow":"Síguenos","title":"No te pierdas las fechas importantes","description":"Síguenos en Facebook, Instagram o TikTok para estar al tanto de fechas importantes, eventos y convocatorias."},"levels":{"eyebrow":"Niveles","title":"Encuentra tu nivel","description":"Las categorías de participación se determinan según la edad y el nivel de escolaridad del competidor."},"preparation":{"eyebrow":"Preparación","title":"Practica con pruebas anteriores","description":"Te sugerimos prepararte con problemas de concursos pasados. Puedes acceder a pruebas anteriores de nuestra competencia haciendo clic en el botón de abajo.","href":"https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi?usp=sharing","link_label":"Ver Libros ONM"},"prizes":{"eyebrow":"Premios","title":"¿Qué gano?","paragraphs":["Los ganadores de cada nivel recibirán medallas de oro, plata o bronce y el reconocimiento correspondiente, según la puntuación obtenida en la etapa final.","También podrán ser invitados a las pruebas selectivas que determinan los integrantes de los equipos que representarán al Ecuador en competencias internacionales."]},"awards":{"eyebrow":"Premiación ONM 2019","image":{"asset_key":"national/awards-2019","image_alt":"Estudiantes durante la premiación de la Olimpiada Nacional de Matemática 2019"}},"video":{"href":"https://www.facebook.com/OlimpiadaMatematicaEcuatoriana/videos/1084803171855869","image":{"asset_key":"national/video-2019","image_alt":"Vista previa del video de la premiación ONM 2019"},"label":"Ver video"},"facts":[{"id":"levels","text":"6 niveles"},{"id":"open","text":"Abierto a todos los estudiantes ecuatorianos"},{"id":"problems","text":"Problemas de razonamiento y creatividad"},{"id":"fee","text":"Costo de inscripción de $10"},{"id":"phases","text":"3 fases: en línea y presencial"}]}'),
('international', '{"seo":{"title":"Olimpiadas Internacionales","description":"Conoce las competencias matemáticas internacionales en las que participan las delegaciones ecuatorianas de OMEC."},"intro":{"eyebrow":"Conoce algunas de las","title":"Olimpiadas Internacionales","description":"Estas son algunas de las olimpiadas internacionales en las que participa Ecuador. Los ganadores de la ONM del año anterior serán convocados a los procesos selectivos y podrán formar parte de la delegación ecuatoriana, según su edad y género."},"sponsors":{"eyebrow":"Con el apoyo de"}}');
--> statement-breakpoint
INSERT INTO `social_link` (`id`, `label`, `href`, `class_name`, `icon_path`, `sort_order`) VALUES
('facebook', 'Facebook', 'https://www.facebook.com/OlimpiadaMatematicaEcuatoriana', 'bg-primary text-white', 'M14 8h-2c-.7 0-1 .3-1 1v2H9v3h2v6h3v-6h2.3l.7-3H14V9c0-.2.1-.3.3-.3H17V6h-2.6C11.9 6 11 7.1 11 8.7V8z', 0),
('instagram', 'Instagram', 'https://www.instagram.com/omec.mat', 'bg-pink-500 text-white', 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2.2A1.8 1.8 0 0 0 6.2 8v8A1.8 1.8 0 0 0 8 17.8h8a1.8 1.8 0 0 0 1.8-1.8V8A1.8 1.8 0 0 0 16 6.2H8zm8.5 1.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.2A1.8 1.8 0 1 0 12 13.8a1.8 1.8 0 0 0 0-3.6z', 1),
('tiktok', 'TikTok', 'https://www.tiktok.com/@omec.mat', 'bg-copy text-white', 'M14.2 3c.2 1.8 1.2 3.5 2.8 4.5 1 .6 2.1.9 3.3.9v3.1c-2.2 0-4.3-.7-6.1-2v6.3a5.8 5.8 0 1 1-5-5.8v3.2a2.7 2.7 0 1 0 1.9 2.6V3h3.1z', 2);
--> statement-breakpoint
INSERT INTO `national_olympiad` (`id`, `key`, `title`, `announcement`) VALUES
(1, 'current', 'Olimpiada Nacional de Matemática 2026', 'Las inscripciones de la Olimpiada Nacional de Matemática 2026 se abren en septiembre.');
--> statement-breakpoint
INSERT INTO `national_olympiad_stage` (`national_olympiad_id`, `label`, `date`, `sort_order`) VALUES
(1, 'Primera fase', '17 de octubre', 0),
(1, 'Segunda fase', '7 de noviembre', 1),
(1, 'Fase final', '11 y 12 de diciembre', 2);
--> statement-breakpoint
INSERT INTO `national_olympiad_level` (`id`, `national_olympiad_id`, `name`, `description`, `sort_order`) VALUES
('nivel-b', 1, 'Nivel B', 'Estudiantes de hasta 5º de Educación Básica', 0),
('nivel-a', 1, 'Nivel A', 'Estudiantes de hasta 7º de Educación Básica', 1),
('nivel-1', 1, 'Nivel 1', 'Estudiantes de hasta 9º de Educación Básica', 2),
('nivel-2', 1, 'Nivel 2', 'Estudiantes de hasta 1º de Bachillerato General Unificado', 3),
('nivel-3', 1, 'Nivel 3', 'Estudiantes de hasta 3º de Bachillerato General Unificado', 4),
('nivel-u', 1, 'Nivel U', 'Estudiantes universitarios', 5);
--> statement-breakpoint
INSERT INTO `international_olympiad` (`id`, `name`, `description`, `asset_key`, `image_alt`, `href`, `sort_order`) VALUES
('imo', 'IMO', 'La Olimpiada Internacional de Matemáticas es un certamen mundial en el que participan alrededor de 100 países de todos los continentes.', 'international/imo', 'Participantes en la Olimpiada Internacional de Matemáticas', 'http://imo-official.org/', 0),
('egmo', 'EGMO', 'Ecuador es un país invitado a la Olimpiada Europea Femenina, cuya finalidad es promover el estudio de las matemáticas entre las mujeres.', 'international/egmo', 'Participantes en la Olimpiada Europea Femenina de Matemáticas', 'https://www.egmo.org/', 1),
('cono-sur', 'Cono Sur', 'La Olimpiada Matemática de Países del Cono Sur está dirigida a estudiantes de hasta 16 años de 8 países de Sudamérica.', 'international/cono-sur', 'Participantes en la Olimpiada Matemática de Países del Cono Sur', NULL, 2),
('pagmo', 'PAGMO', 'La Olimpiada Panamericana Femenina de Matemáticas tiene como finalidad promover el estudio de las matemáticas en las mujeres. Tiene un límite de edad de 16 años.', 'international/pagmo', 'Participantes en la Olimpiada Panamericana Femenina de Matemáticas', 'https://www.pagmo.info/', 3),
('tjm', 'Torneo de Jóvenes Matemáticos', 'El TJM es una competencia entre países de Latinoamérica, para chicos de 13 a 16 años. Tiene un formato único donde los participantes obtienen retroalimentación sobre sus soluciones en tiempo real.', 'international/tjm', 'Participantes en el Torneo de Jóvenes Matemáticos', NULL, 4),
('apmo', 'APMO', 'La Olimpiada Matemática de Asia-Pacífico se realiza por correspondencia y tiene un formato y una dificultad similares a los de la IMO.', 'logos/apmo', 'Logotipo de la Olimpiada Matemática de Asia-Pacífico', 'https://www.apmo-official.org/', 5),
('mayo', 'Olimpiada de Mayo', 'Conocida como la "Iberoamericana Junior", esta competencia por correspondencia es organizada por Argentina a nivel iberoamericano y está destinada a estudiantes menores de 15 años.', 'logos/mayo', 'Logotipo de la Olimpiada de Mayo', NULL, 6),
('igo', 'IGO', 'La Olimpiada Iraní de Geometría se enfoca exclusivamente en esta área. La competencia se realiza por correspondencia y cuenta con un nivel abierto a todo público.', 'logos/igo', 'Logotipo de la Olimpiada Iraní de Geometría', NULL, 7),
('ciim', 'CIIM', 'La Competencia Iberoamericana Interuniversitaria de Matemáticas tiene el ánimo de incentivar el estudio de las matemáticas en la comunidad universitaria iberoamericana.', 'international/ciim', 'Participantes en la Competencia Iberoamericana Interuniversitaria de Matemáticas', 'http://ciim.uan.edu.co/', 8);
--> statement-breakpoint
INSERT INTO `sponsor` (`id`, `name`, `asset_key`, `image_alt`) VALUES
('usfq', 'Universidad San Francisco de Quito', 'logos/usfq', 'Logotipo de la Universidad San Francisco de Quito'),
('egcs-ucsg', 'Escuela de Graduados en Ciencias de la Salud de la UCSG', 'logos/ucsg', 'Logo de la Escuela de Graduados en Ciencias de la Salud de la Universidad Católica de Santiago de Guayaquil'),
('sponsor', 'Entidad auspiciadora de OMEC', 'logos/sedem', 'Logotipo de la entidad auspiciadora de OMEC');
--> statement-breakpoint
INSERT INTO `sponsor_placement` (`sponsor_id`, `page_key`, `sort_order`) VALUES
('egcs-ucsg', 'home', 0),
('usfq', 'international', 0),
('egcs-ucsg', 'international', 1),
('sponsor', 'international', 2);
--> statement-breakpoint
INSERT INTO `training_material` (`id`, `title`, `description`, `icon`, `asset_key`, `image_alt`, `href`, `sort_order`) VALUES
('estudio-a-profundidad', 'Estudio a profundidad', 'Temario a fondo de teoría de números y álgebra. Incluye temas avanzados.', NULL, 'logos/omec', 'Logotipo de la Olimpiada Matemática Ecuatoriana', 'https://drive.google.com/drive/folders/1PkZNnvenS0Bt9siJlsH8XTa7iEZOVcHj', 0),
('olimpiada-nacional', 'Olimpiada Nacional de Matemáticas', 'Esta carpeta incluye los problemas y las soluciones de todos los niveles de las ONM de 2016 a 2019.', NULL, 'logos/omec', 'Logotipo de la Olimpiada Matemática Ecuatoriana', 'https://drive.google.com/drive/folders/1uHvRIcHWBflcFO0LajeEoJJoS2e8fNVi', 1),
('olimpiadas-internacionales', 'Olimpiadas Internacionales', 'Esta carpeta incluye pruebas pasadas de: IMO, EGMO, Cono Sur, Olimpiada de Mayo, CIIM y APMO', NULL, 'logos/egmo', 'Logotipo de la Olimpiada Europea Femenina de Matemáticas', 'https://drive.google.com/drive/folders/1z2aMiN57ITnnd7oZOtvENsOjDWdRaSkY?usp=sharing', 2),
('pruebas-selectivas', 'Pruebas selectivas', 'Esta carpeta incluye las pruebas selectivas que se realizan cada año para elegir al equipo ecuatoriano que participará en competencias internacionales.', 'presentation', NULL, '', 'https://drive.google.com/drive/folders/1o_tWnaBMD_0B54bZqVKEHmkFZzP9bHAi?usp=sharing', 3),
('listas-semanales', 'Listas semanales', 'Esta carpeta incluye las listas semanales de OMEC publicadas entre 2013 y 2015. Hay material para distintos niveles.', 'calendar_days', NULL, 'Ícono de calendario', 'https://drive.google.com/drive/folders/1yhcXrcbxDZ2fMJtt--jiCUvn4Obog4Yk?usp=sharing', 4);
--> statement-breakpoint
INSERT INTO `team_member` (`id`, `name`, `role`, `contact`, `asset_key`, `image_alt`) VALUES
('adrian-delgado', 'Adrián Delgado', NULL, NULL, NULL, NULL),
('adrian-cerda', 'Adrián Cerda', NULL, NULL, NULL, NULL),
('anthony-flores', 'Anthony Flores', NULL, NULL, NULL, NULL),
('ana-indacochea', 'Ana Indacochea', NULL, NULL, NULL, NULL),
('arody-carlosama', 'Arody Carlosama', NULL, NULL, NULL, NULL),
('cristhyan-cayetano', 'Cristhyan Cayetano', NULL, NULL, NULL, NULL),
('daniel-suarez', 'Daniel Suárez', NULL, NULL, NULL, NULL),
('eduardo-arteaga', 'Eduardo Arteaga', NULL, NULL, NULL, NULL),
('emilio-zamora', 'Emilio Zamora', NULL, NULL, NULL, NULL),
('fernando-gomez', 'Fernando Gómez', 'Director académico', NULL, 'directors/fernando-gomez', 'Retrato de Fernando Gómez, director académico de OMEC'),
('giacomo-yu', 'Giacomo Yu', NULL, NULL, NULL, NULL),
('gratzia-indacochea', 'Gratzia Indacochea', NULL, NULL, NULL, NULL),
('jahir-cajas', 'Jahir Cajas', NULL, NULL, NULL, NULL),
('jordie-astudillo', 'Jordie Astudillo', NULL, NULL, NULL, NULL),
('keny-carlosama', 'Keny Carlosama', NULL, NULL, NULL, NULL),
('lucero-llanos', 'Lucero Llanos', 'Directora de comunicación', NULL, 'directors/lucero-llanos', 'Retrato de Lucero Llanos, directora de comunicación de OMEC'),
('marcelo-rodriguez', 'Marcelo Rodríguez', NULL, NULL, NULL, NULL),
('mauricio-cevallos', 'Mauricio Cevallos', NULL, NULL, NULL, NULL),
('melvin-poveda', 'Melvin Poveda', NULL, NULL, NULL, NULL),
('mia-dunn', 'Mia Dunn', NULL, NULL, NULL, NULL),
('miguel-guzman', 'Miguel Guzmán', NULL, NULL, NULL, NULL),
('pablo-serrano', 'Pablo Serrano', 'Director general', NULL, 'directors/pablo-serrano', 'Retrato de Pablo Serrano, director general de OMEC'),
('pedro-suarez', 'Pedro Suárez', 'Relaciones Interinstitucionales', 'pedro.suarez@omec-mat.org', 'directors/pedro-suarez', 'Retrato de Pedro Suárez, responsable de Relaciones Interinstitucionales de OMEC'),
('romnie-acosta', 'Romnie Acosta', NULL, NULL, NULL, NULL),
('samantha-carrillo', 'Samantha Carrillo', NULL, NULL, NULL, NULL),
('santiago-velazquez', 'Santiago Velázquez', NULL, NULL, NULL, NULL),
('sebastian-regalado', 'Sebastián Regalado', NULL, NULL, NULL, NULL),
('valentina-ulloa', 'Valentina Ulloa', NULL, NULL, NULL, NULL),
('valeria-santana', 'Valeria Santana', 'Tesorera', NULL, 'directors/valeria-santana', 'Retrato de Valeria Santana, tesorera de OMEC'),
('victor-marriott', 'Víctor Marriott', NULL, NULL, NULL, NULL);
--> statement-breakpoint
INSERT INTO `team_member_placement` (`team_member_id`, `page_key`, `placement`, `sort_order`) VALUES
('adrian-delgado', 'about', 'member', 0),
('adrian-cerda', 'about', 'member', 1),
('anthony-flores', 'about', 'member', 2),
('ana-indacochea', 'about', 'member', 3),
('arody-carlosama', 'about', 'member', 4),
('cristhyan-cayetano', 'about', 'member', 5),
('daniel-suarez', 'about', 'member', 6),
('eduardo-arteaga', 'about', 'member', 7),
('emilio-zamora', 'about', 'member', 8),
('fernando-gomez', 'about', 'member', 9),
('giacomo-yu', 'about', 'member', 10),
('gratzia-indacochea', 'about', 'member', 11),
('jahir-cajas', 'about', 'member', 12),
('jordie-astudillo', 'about', 'member', 13),
('keny-carlosama', 'about', 'member', 14),
('lucero-llanos', 'about', 'member', 15),
('marcelo-rodriguez', 'about', 'member', 16),
('mauricio-cevallos', 'about', 'member', 17),
('melvin-poveda', 'about', 'member', 18),
('mia-dunn', 'about', 'member', 19),
('miguel-guzman', 'about', 'member', 20),
('pablo-serrano', 'about', 'member', 21),
('pedro-suarez', 'about', 'member', 22),
('romnie-acosta', 'about', 'member', 23),
('samantha-carrillo', 'about', 'member', 24),
('santiago-velazquez', 'about', 'member', 25),
('sebastian-regalado', 'about', 'member', 26),
('valentina-ulloa', 'about', 'member', 27),
('valeria-santana', 'about', 'member', 28),
('victor-marriott', 'about', 'member', 29),
('fernando-gomez', 'about', 'director', 0),
('pablo-serrano', 'about', 'director', 1),
('lucero-llanos', 'about', 'director', 2),
('valeria-santana', 'about', 'director', 3),
('pedro-suarez', 'about', 'director', 4);
--> statement-breakpoint
INSERT INTO `news_article` (`slug`, `category`, `date`, `date_published`, `author`, `title`, `summary`, `link_label`, `body_markdown`, `sort_order`) VALUES
('logros-de-la-omec-en-2026', 'Noticias', '13 de agosto de 2026', '2026-08-13', 'OMEC', 'Logros de la OMEC en 2026', '17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo.', 'Leer noticia →', '## 17 estudiantes destacan en olimpiadas matemáticas del Cono Sur, APMO y Olimpiada de Mayo

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

En marzo de 2026, 20 estudiantes de entre 12 y 16 años, seleccionados por OMEC, viajaron al **6.° Torneo de Jóvenes Matemáticos** (**TJM**), que se desarrolló en Perú. Ecuador volvió de esta competencia con **2 medallas de plata**, **3 de bronce** y **4 menciones de honor** en la modalidad individual; y con **5 medallas de oro** y **5 de plata** en la modalidad grupal.', 0);
