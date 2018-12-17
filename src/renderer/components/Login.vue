<template>
	<div class="text-center">
		<h1>Login</h1>
		<form>
			<div class="error">{{error}}</div>
			<input type="password" placeholder="Password" v-model="password"/><br/>

			<button type="button" @keyup.enter="login( password)" @click="login( password)">{{button}}</button>
		</form>
	</div>
</template>

<script>

	import Encryption from "../../library/Encryption"
	let encOb = new Encryption()


	export default {
		name: "Login",
		data() {
			return {
				password : '',
				error : '',
				button : 'Login'
			}
		},
		methods: {
			login( password ) {

				if (password.trim() == '') return false;

				this.button = 'Loading...'

				this.error = '';
				encOb.loadPersonalKeys( password ).then( ()=> {
					sessionStorage.setItem('passPhrase', password);
					setTimeout(()=> { location.reload() }, 2000 );

				}).catch((e) => {
					this.error = 'Wrong Password';
				})
			}
		},
		mounted: function() {

			if( encOb.checkIfKeysExists() === false ) {
				this.$router.push('/signup')
			}
		}
	}
</script>

<style scoped>
	input {
		width: 50%;
		margin-bottom: 50px;
	}

	h1 {
		margin: 50px;
	}

	.error {
		color: red;
		font-size: 18px;
	}
</style>