import { env } from "$env/dynamic/public";

export const org = env.PUBLIC_GITHUB_ORGANIZATION;

export const enabledFeatures = {
	createRepos: env.PUBLIC_ITAM_ENABLE_REPO_CREATION === "true",
	watchIssues: env.PUBLIC_ITAM_ENABLE_WATCH_ISSUES === "true"
};
