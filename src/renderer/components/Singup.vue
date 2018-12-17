<template>
	<div class="text-center">
		<h1>Create Account</h1>
		<form>
			<div class="error">{{error}}</div>
			<label>Name</label><br/>
			<input type="email" placeholder="John Doe" v-model="name" :disabled="loading ==1" required/><br/>

			<label>E-Mail</label><br/>
			<input type="email" placeholder="john.doe@secret.com" v-model="mail" :disabled="loading==1" required/><br/>


			<label>Password</label><br/>
			<small>Make sure you don't lost it.<br/>Your password can not be recovered</small><br/>
			<input type="password" v-model="password" :disabled="loading==1" required/><br/>

			<label>Repeat Password</label><br/>
			<input type="password" v-model="rePassword" :disabled="loading==1" required/><br/>

			<button type="button" @click="signup( name, mail, password, rePassword)" @keyup.enter="signup( name, mail, password, rePassword)" :disabled="loading==1">{{button}}</button>
		</form>
	</div>
</template>

<script>

	import Encryption from "../../library/Encryption"

	let encOb = new Encryption()


	export default {
		name: "Signup",
		methods: {
			signup( name, mail, password, rePassword ) {

				if( name.trim() == '' || mail.trim() == '' ) {
					this.error = 'Please provide a name and a valid e-mail'
					return false;
				}

				if( !validateEmail( mail ) ) {
					this.error = 'Invalid e-mail address'
					return false;
				}

				if( password.trim() == '' || password.length < 6 ) {
					this.error = 'Password must be at least 6 characters long'
					return false;
				}

				if( password != rePassword) {
					this.error = 'Passwords does not match'
					return false;
				}

				this.loading = true;
				this.button = 'Creating your personal keys...';

				encOb.createKeys( name, mail, password ).then((e) => {
					sessionStorage.setItem('passPhrase', password);
					location.reload();
				}).catch((e) => {
					this.error = e
					this.button = 'Create A Key';
					this.loading = false;
				});
			}
		},
		data() {
			return {
				name: '',
				mail: '',
				password: '',
				rePassword: "",
				error : '',
				button : 'Create A Key',
				loading : false
			}
		}
	}


	function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

</script>

<style scoped>
	input {
		width: 50%;
		margin-bottom: 20px;
	}

	h1 {
		margin: 30px;
	}

	.error {
		color: red;
		font-size: 18px;
	}
</style>