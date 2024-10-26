import cron from "node-cron";
import createRepos from "./server/github/createRepos";
import checkIssues from "./server/github/checkIssues";
import { enabledFeatures } from "./config";

export function setupCronJobs() {
	let n = 0;
	if (cronStarted) return;

	if (enabledFeatures.createRepos) {
		cron.schedule("0 13 * * * *", createRepos);
		n += 1;
	}
	if (enabledFeatures.watchIssues) {
		cron.schedule("0 0,15,30,45 * * * *", checkIssues);
		n += 1;
	}

	cronStarted = true;
	console.log(`${n} cron jobs scheduled`);
}
let cronStarted = false;
