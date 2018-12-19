<template>
	<div class="top-bar">
		<div class="title">
			{{title}}
		</div>
		<div class="clearfix"></div>
	</div>
</template>

<script>
	export default {
		name: "TopBar",
		props: ['title'],
	}
</script>

<style scoped>

	.top-bar {
		padding: 20px 10px;
		margin-bottom: 10px;
		font-size: 18px;
		box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
		transition: background-color 0.3s ease-in-out;
		background-color: white;
	}

	.title {
		font-family: 'Source Sans Pro', sans-serif;
		margin-left: 10px;
		color: #2980B9;
		font-weight: initial;
		text-align: center;
	}

	.user-id {
		float: right;
		color: #34495e;
	}

	.clearfix::after {
		content: "";
		clear: both;
		display: table;
	}
</style>