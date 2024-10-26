import { enabledFeatures } from "$lib/config";
import checkIssues from "$lib/server/github/checkIssues";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
	if (!enabledFeatures.watchIssues) {
		error(422, { message: "feature is disabled" });
	}
	let ok = await checkIssues();
	return new Response(JSON.stringify({ ok }));
};
