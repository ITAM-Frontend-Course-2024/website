<script lang="ts">
	import "../app.scss";
</script>

<div id="wrapper">
	<slot />
</div>

<style lang="scss">
	#wrapper {
		display: flex;
		flex-direction: column;
		padding: 24px;
		gap: 20px;
	}
</style>
