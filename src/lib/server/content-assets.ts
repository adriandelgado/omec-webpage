import home_hero from "#lib/assets/home/imo-team-2026.jpeg?enhanced";
import home_about from "#lib/assets/home/olympiad-student.jpeg?enhanced";
import home_national from "#lib/assets/home/national-olympiad-participants.jpg?enhanced";
import logo_apmo from "#lib/assets/logos/apmo.svg";
import logo_egmo from "#lib/assets/logos/egmo.svg";
import logo_igo from "#lib/assets/logos/igo.svg";
import logo_mayo from "#lib/assets/logos/mayo.svg";
import logo_omec from "#lib/assets/logos/omec.svg";
import logo_sedem from "#lib/assets/logos/sedem.svg";
import logo_ucsg from "#lib/assets/logos/ucsg.svg";
import logo_usfq from "#lib/assets/logos/usfq.svg";
import about_imo_2018 from "#lib/assets/nosotros/imo-2018.jpg";
import about_imo_2018_enhanced from "#lib/assets/nosotros/imo-2018.jpg?enhanced";
import director_fernando_gomez from "#lib/assets/nosotros/fernando-gomez.jpg?enhanced";
import director_lucero_llanos from "#lib/assets/nosotros/lucero-llanos.jpg?enhanced";
import director_pablo_serrano from "#lib/assets/nosotros/pablo-serrano.jpg?enhanced";
import director_pedro_suarez from "#lib/assets/nosotros/pedro-suarez.png?enhanced";
import director_valeria_santana from "#lib/assets/nosotros/valeria-santana.jpeg?enhanced";
import olympiad_ciim from "#lib/assets/olimpiadas/internacionales/olympiad-ciim.jpg?enhanced";
import olympiad_cono_sur from "#lib/assets/olimpiadas/internacionales/olympiad-cono-sur.jpeg?enhanced";
import olympiad_egmo from "#lib/assets/olimpiadas/internacionales/olympiad-egmo.jpeg?enhanced";
import olympiad_imo from "#lib/assets/olimpiadas/internacionales/olympiad-imo.jpeg?enhanced";
import olympiad_pagmo from "#lib/assets/olimpiadas/internacionales/olympiad-pagmo.jpeg?enhanced";
import olympiad_tjm from "#lib/assets/olimpiadas/internacionales/olympiad-tjm.jpeg?enhanced";
import national_awards from "#lib/assets/olimpiadas/nacionales/onm-2019-awards.jpg?enhanced";
import national_video from "#lib/assets/olimpiadas/nacionales/onm-2019-video-thumbnail.jpg?enhanced";
import type { Picture } from "@sveltejs/enhanced-img";

export const CONTENT_ASSETS = {
	"home/hero": home_hero,
	"home/about": home_about,
	"home/national": home_national,
	"logos/apmo": logo_apmo,
	"logos/egmo": logo_egmo,
	"logos/igo": logo_igo,
	"logos/mayo": logo_mayo,
	"logos/omec": logo_omec,
	"logos/sedem": logo_sedem,
	"logos/ucsg": logo_ucsg,
	"logos/usfq": logo_usfq,
	"about/imo-2018": about_imo_2018,
	"about/imo-2018-enhanced": about_imo_2018_enhanced,
	"directors/fernando-gomez": director_fernando_gomez,
	"directors/lucero-llanos": director_lucero_llanos,
	"directors/pablo-serrano": director_pablo_serrano,
	"directors/pedro-suarez": director_pedro_suarez,
	"directors/valeria-santana": director_valeria_santana,
	"international/ciim": olympiad_ciim,
	"international/cono-sur": olympiad_cono_sur,
	"international/egmo": olympiad_egmo,
	"international/imo": olympiad_imo,
	"international/pagmo": olympiad_pagmo,
	"international/tjm": olympiad_tjm,
	"national/awards-2019": national_awards,
	"national/video-2019": national_video,
} as const;

export type ContentAsset = (typeof CONTENT_ASSETS)[keyof typeof CONTENT_ASSETS];
export type ContentAssetMap = Readonly<Record<string, string | Picture>>;
