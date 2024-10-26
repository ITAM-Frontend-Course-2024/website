<script lang="ts">
	import type { Selectable } from "kysely";
	import type { Group } from "$lib/server/db.types";
	import LoadButton from "./LoadButton.svelte";
	import { enabledFeatures, org } from "$lib/config";

	let { data } = $props();

	let search: string = $state("");
	let searchF = $derived(search.toLowerCase().trim());

	let groupFilter: Selectable<Group> | null = $state(null);

	let students = $derived(
		data.students
			.filter(
				({ github, telegram }) =>
					telegram.trim().toLowerCase().includes(searchF) ||
					github.trim().toLowerCase().includes(searchF)
			)
			.filter(
				({ groupId }) => groupFilter === null || groupFilter.id === groupId
			)
	);
	let homeworks = $derived(
		data.homeworks
			.filter(({ closed }) => !closed)
			.map(x => ({
				...x,
				student: data.students.find(s => s.id === x.studentId)!
			}))
			.filter(
				({ title, student: { github, telegram } }) =>
					telegram.trim().toLowerCase().includes(searchF) ||
					github.trim().toLowerCase().includes(searchF) ||
					title.trim().toLowerCase().includes(searchF)
			)
			.filter(
				({ student: { groupId } }) =>
					groupFilter === null || groupFilter.id === groupId
			)
	);
</script>

<svelte:head>
	<title>ITAM Frontend 2024</title>
</svelte:head>

<section>
	<header>
		<div class="h1">
			<h1>Домашки для проверки</h1>
			<input bind:value={search} />
			<select bind:value={groupFilter}>
				<option value={null}>Все группы</option>
				{#each data.groups as group}
					<option value={group}>{group.displayName}</option>
				{/each}
			</select>
		</div>
		<div class="h2">
			<h2>Telegram</h2>
			<h2>Github</h2>
			<h2 class="big">Домашнее задание</h2>
			<h2>Группа</h2>
		</div>
	</header>
	<article>
		{#each homeworks as homework}
			{@const group = data.groups.find(x => x.id === homework.student.groupId)!}
			<div class="row">
				<div class="cell">
					<a href={`https://t.me/${homework.student.telegram}`}>
						@{homework.student.telegram}
					</a>
				</div>
				<div class="cell">
					<a href={`https://github.com/${homework.student.github}`}>
						{homework.student.github}
					</a>
				</div>
				<div class="cell big">
					<a
						href={`https://github.com/${org}/${group.prefix}-${homework.student.telegram}/issues/${homework.issue}`}
					>
						{homework.title}
					</a>
				</div>
				<div class="cell">{group.displayName}</div>
			</div>
		{/each}
	</article>
</section>
<section>
	<header>
		<div class="h1">
			<h1>Студенты</h1>
			<input bind:value={search} />
			<select bind:value={groupFilter}>
				<option value={null}>Все группы</option>
				{#each data.groups as group}
					<option value={group}>{group.displayName}</option>
				{/each}
			</select>
		</div>
		<div class="h2">
			<h2>Telegram</h2>
			<h2>Github</h2>
			<h2 class="big">Репозиторий</h2>
			<h2>Группа</h2>
		</div>
	</header>
	<article>
		{#each students as student}
			{@const group = data.groups.find(x => x.id === student.groupId)!}
			<div class="row">
				<div class="cell">
					<a href={`https://t.me/${student.telegram}`}>
						@{student.telegram}
					</a>
				</div>
				<div class="cell">
					<a href={`https://github.com/${student.github}`}>
						{student.github}
					</a>
				</div>
				<div class="cell big">
					<a
						href={`https://github.com/${org}/${group.prefix}-${student.telegram}`}
					>
						{org}/{student.github}
					</a>
				</div>
				<div class="cell">
					{group.displayName}
				</div>
			</div>
		{/each}
	</article>
</section>
<footer>
	{#if enabledFeatures.createRepos}
		<LoadButton onclick={() => fetch("/api/createRepos", { method: "POST" })}>
			Запустить создание репозиториев
		</LoadButton>
	{/if}
	{#if enabledFeatures.watchIssues}
		<LoadButton onclick={() => fetch("/api/checkIssues", { method: "POST" })}>
			Запустить сбор ДЗ
		</LoadButton>
	{/if}
</footer>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		border: 1px solid black;

		header {
			border-bottom: 1px solid black;
			.h1 {
				display: flex;
				background-color: rgb(40, 40, 40);
				align-items: center;
				gap: 16px;
				padding: 0 16px;

				h1 {
					font-size: 18px;
					font-weight: bold;
					color: white;
					padding: 20px;
					margin-right: auto;
				}

				input,
				select {
					border-radius: 0;
					padding: 4px;
					background-color: rgb(230, 230, 230);
					border: 0;
				}
			}
			.h2 {
				display: flex;
				background-color: rgb(230, 230, 230);
				> h2 {
					flex: 1;
					padding: 12px;
					text-align: center;
				}
			}
		}

		article {
			height: 400px;
			overflow-y: scroll;

			.row {
				display: flex;
				border-bottom: 1px solid black;
			}
			.cell {
				flex: 1;
				text-align: center;
				padding: 8px;
				text-align: center;
			}
		}

		header h2,
		article .cell {
			&.big {
				flex: 2;
			}
		}
	}

	footer {
		display: flex;
		gap: 20px;
	}
</style>
