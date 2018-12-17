<template>
	<div class="top-bar">
		<div class="title">
			{{title}}
		</div>
		<div class="user-id right-side"><small> Created By <a href="mailto:contact@machavia.fr">Machavia Pichet</a></small></div>
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
		padding: 10px;
		margin-bottom: 10px;
		font-size: 16px;
		box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
		transition: background-color 0.3s ease-in-out;
	}

	.title {
		margin-left: 10px;
		float: left;
		color: #42b983;
		font-weight: initial;
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