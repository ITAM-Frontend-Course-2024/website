import createRepos from "$lib/server/github/createRepos";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
	let ok = await createRepos();
	return new Response(JSON.stringify({ ok }));
};
