<template>
	<div id="app">
		<div class="row">
			<div class="sidenav">
				<router-link to="/write"><i class="fas fa-pencil-alt"></i></router-link>
				<router-link to="/read"><i class="fas fa-book-open"></i></router-link>
				<router-link to="/contacts"><i class="fas fa-user-friends"></i></router-link>
				<!--<a href="#" @click="logout()"><i class="fas fa-sign-out-alt"></i></a>-->

			</div>
			<div class="content">
				<router-view></router-view>
			</div>

		</div>
	</div>
</template>

<script>


	export default {
		name: 'secret-share-vue',
		components: {

		},
		data() {
			return {
				isLoggedId: sessionStorage.getItem('passPhrase') != null
			}
		},
		methods: {
			logout() {
				sessionStorage.clear()
				location.reload();
			}
		},
		mounted: function(){
		}
	}
</script>

<style>
	@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
	@import './assets/main.css';

	.sidenav {
		background: #2C3E50;
		float: left;
		height: 100vh;
		display: flex;
		flex-direction: column;
		width: 10%;

		box-shadow: 1px 0 0 rgba(0, 0, 0, 0.25);
		transition: background-color 0.3s ease-in-out;


	}

	.sidenav a {
		text-align: center;
		text-decoration: none;
		font-size: 30px;
		color: #6a869a;
		display: block;
		margin: 30px;
	}


	.content {
		width: 90%;
		float: right;
	}

</style>
