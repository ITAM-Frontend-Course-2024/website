import { enabledFeatures } from "$lib/config";
import createRepos from "$lib/server/github/createRepos";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
	if (!enabledFeatures.createRepos) {
		error(422, { message: "feature is disabled" });
	}
	let ok = await createRepos();
	return new Response(JSON.stringify({ ok }));
};
