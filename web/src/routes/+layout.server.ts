import type { LayoutServerLoad } from "./$types";
import db from "$lib/server/db";

export const load: LayoutServerLoad = async () => {
	let database = await db();

	let [students, homeworks, groups] = await Promise.all([
		database
			.selectFrom("student")
			.selectAll()
			.orderBy(["groupId desc", "telegram"])
			.orderBy("telegram")
			.execute(),
		database.selectFrom("homework").selectAll().execute(),
		database.selectFrom("group").selectAll().execute()
	]);

	return { students, homeworks, groups };
};
