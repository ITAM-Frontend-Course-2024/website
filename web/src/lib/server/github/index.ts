import { Octokit } from "octokit";
import { env } from "process";

export const octokit = () => {
	return new Octokit({ auth: env.GITHUB_BOT_TOKEN });
};
