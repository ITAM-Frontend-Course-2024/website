import { randomUUID } from "crypto";
import { octokit } from ".";
import db from "../db";
import { org } from "$lib/config";

const timeout = 500;

/** Checks issues from student repositories. */
export default async function checkIssues() {
	let taskId = randomUUID();
	let ok = true;
	console.log({ task: "checkIssues", taskId, message: "started" });

	let database = await db();
	let students = await getData();
	for (const { prefix, telegram, id: studentId } of students) {
		await new Promise(resolve => setTimeout(resolve, timeout));
		try {
			const repo = `${prefix}-${telegram}`;
			let { data: issues } = await octokit().rest.issues.listForRepo({
				owner: org,
				repo,
				state: "all",
				per_page: 100
			});
			if (issues.length === 0) continue;
			await database.transaction().execute(async trx => {
				await trx
					.deleteFrom("homework")
					.where("studentId", "=", studentId)
					.execute();
				await trx
					.insertInto("homework")
					.values(
						issues.map(({ number, state, title }) => ({
							studentId,
							issue: number,
							title,
							closed: state === "closed"
						}))
					)
					.execute();
			});
		} catch (e) {
			ok = false;
			console.log(e);
			console.log({ task: "checkIssues", taskId, message: "error", telegram });
		}
	}
	console.log({ task: "checkIssues", taskId, message: "completed", ok });
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
