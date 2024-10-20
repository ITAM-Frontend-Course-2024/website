import cron from "node-cron";
import createRepos from "./server/github/createRepos";
import checkIssues from "./server/github/checkIssues";

export function setupCronJobs() {
	if (cronStarted) return;

	cron.schedule("0 13 * * * *", createRepos);
	cron.schedule("0 0,15,30,45 * * * *", checkIssues);

	cronStarted = true;
	console.log("cron jobs are scheduled");
}
let cronStarted = false;
