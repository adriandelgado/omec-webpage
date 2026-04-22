export const default_local_database_url = "file:local.db";

type resolve_database_config_options = {
	database_auth_token?: string | null;
	database_url?: string | null;
	allow_local_default: boolean;
	context: string;
	require_remote?: boolean;
};

function normalize_env_value(value?: string | null) {
	const trimmed_value = value?.trim();
	return trimmed_value ? trimmed_value : undefined;
}

export function is_local_database_url(database_url: string) {
	return database_url.startsWith("file:") || database_url === ":memory:";
}

export function resolve_database_config({
	database_auth_token,
	database_url,
	allow_local_default,
	context,
	require_remote = false,
}: resolve_database_config_options) {
	const resolved_database_url =
		normalize_env_value(database_url) ??
		(allow_local_default ? default_local_database_url : undefined);

	if (!resolved_database_url) {
		throw new Error(
			`${context}: DATABASE_URL is required. Use ${default_local_database_url} for local development or set a remote Turso/libSQL URL.`,
		);
	}

	const local_database = is_local_database_url(resolved_database_url);

	if (require_remote && local_database) {
		throw new Error(
			`${context}: DATABASE_URL must be a remote Turso/libSQL URL. Local file URLs are not allowed in this mode.`,
		);
	}

	const resolved_auth_token = normalize_env_value(database_auth_token);

	if (!local_database && !resolved_auth_token) {
		throw new Error(`${context}: DATABASE_AUTH_TOKEN is required for remote Turso/libSQL URLs.`);
	}

	return {
		url: resolved_database_url,
		auth_token: resolved_auth_token,
		is_local: local_database,
	};
}
