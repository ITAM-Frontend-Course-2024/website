import { PUBLIC_GITHUB_ORGANIZATION as org } from "$env/static/public";
import { randomUUID } from "crypto";
import { octokit } from ".";
import db from "../db";

/* Timeout between API invocations. */
const timeout = 500;

/** Creates repositories for students. */
export default async function createRepos() {
	let taskId = randomUUID();
	let ok = true;
	console.log({ task: "createRepos", taskId, message: "started" });

	let data = await getData();

	let { data: repositories } = await octokit().rest.repos.listForOrg({
		org,
		// TODO: handle pagination
		per_page: 100
	});

	for (const { github, telegram, prefix } of data) {
		let repoStatus: "ok" | "fail";
		let inviteStatus: "ok" | "fail" | "skip";

		await new Promise(resolve => setTimeout(resolve, timeout));

		const repoName = `${prefix}-${telegram}`;

		try {
			if (repositories.find(x => x.name === repoName) !== undefined) {
				continue;
			}
			await octokit().rest.repos.createUsingTemplate({
				template_owner: org,
				template_repo: "template",
				owner: org,
				name: repoName,
				private: true
			});
			repoStatus = "ok";
		} catch {
			ok = false;
			repoStatus = "fail";
		}

		if (repoStatus === "ok") {
			try {
				await octokit().rest.repos.addCollaborator({
					owner: org,
					repo: repoName,
					username: github,
					permission: "maintain"
				});
				inviteStatus = "ok";
			} catch {
				ok = false;
				inviteStatus = "fail";
			}
		} else {
			inviteStatus = "skip";
		}

		console.log({
			task: "createRepos",
			taskId,
			github,
			telegram,
			repoStatus,
			inviteStatus,
			message: "step completed"
		});
	}
	console.log({ task: "createRepos", taskId, message: "completed", ok });
	return ok;
}

async function getData() {
	let database = await db();
	return await database
		.selectFrom("student")
		.leftJoin("group", "group.id", "student.groupId")
		.selectAll("student")
		.select("group.prefix")
		.execute();
}
