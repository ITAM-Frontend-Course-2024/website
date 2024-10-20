import checkIssues from "$lib/server/github/checkIssues";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
	let ok = await checkIssues();
	return new Response(JSON.stringify({ ok }));
};
