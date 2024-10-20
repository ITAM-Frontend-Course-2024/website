<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
		onclick
	}: { children: Snippet; onclick: () => Promise<Response> } = $props();

	let promise: Promise<Response> | null = $state(null);
</script>

<button onclick={() => (promise = onclick())} disabled={promise !== null}>
	{#if promise === null}
		{@render children()}
	{:else}
		{#await promise}
			Загрузка...
		{:then response}
			{#if response.ok}
				{@render children()}
			{:else}
				Ошибка!
			{/if}
		{/await}
	{/if}
</button>

<style lang="scss">
	button {
		color: white;
		background-color: rgb(40, 40, 40);
		border: 0;
		padding: 20px;
		&:hover {
			cursor: pointer;
			background-color: rgb(60, 60, 60);
		}
	}
</style>
