import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("group")
		.addColumn("id", "text", c => c.notNull().primaryKey())
		.addColumn("displayName", "text", c => c.notNull())
		.addColumn("prefix", "text", c => c.notNull())
		.execute();
	await db
		.insertInto("group")
		.values([
			{ id: "university", displayName: "Студенты", prefix: "EDU" },
			{ id: "school", displayName: "Школьники", prefix: "SCH" }
		])
		.execute();

	await db.schema
		.createTable("student")
		.addColumn("id", "integer", c => c.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("groupId", "text", c => c.notNull().references("group.id"))
		.addColumn("github", "text", c => c.unique().notNull())
		.addColumn("telegram", "text", c => c.unique().notNull())
		.execute();

	await db.schema
		.createTable("homework")
		.addColumn("id", "integer", c => c.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("studentId", "integer", c =>
			c.notNull().references("student.id")
		)
		.addColumn("title", "text", c => c.notNull())
		.addColumn("issue", "integer", c => c.notNull())
		.addColumn("closed", "boolean", c => c.notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	const tables = ["homework", "student", "group"];
	await Promise.all(
		tables.map(t => db.schema.dropTable(t).ifExists().execute())
	);
}
