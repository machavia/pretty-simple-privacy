<template>
	<div>
		<top-bar title="Read Encrypted Message"></top-bar>
		<div class="half">
			<select v-model="selected" v-on:change="checkReady()" class="contact-list">
				<option disabled value="">Select the sender</option>
				<option v-for="contact in contacts" v-bind:value="contact.id">
					{{ contact.name }}
				</option>
			</select>
			<router-link to="/contacts">
				<button class="btn-light"><i class="fas fa-user-plus"></i></button>
			</router-link>

			<textarea v-model="message" placeholder="Past your encrypted message" v-on:input="checkReady()"></textarea>
			<br/>
			<button v-bind:class="{ bsecondary: !encryptionReady }" @click="decryptMessage( selected, message )">{{decryptButton}}</button>
		</div>
		<div class="half">
			<h3 v-if="decryptedMessage != ''">Your message:</h3>
			<div v-if="decryptedMessage != ''" class="decryptedMessage">
				<pre>{{ decryptedMessage }}</pre>
			</div>
		</div>
	</div>
</template>

<script>

	import Encryption from "../../library/Encryption"
	import UserRegistry from "../../library/UserRegistry"
	import TopBar from "./TopBar";
	let passPhrase = sessionStorage.getItem('passPhrase');


	let encOb = new Encryption()
	let userOb = new UserRegistry()

	if( passPhrase != null ) {
		encOb.loadPersonalKeys( passPhrase ).catch((e) => {
			alert( 'An error occurred while loading your encryption keys')
			throw e;

		})
	}

	export default {
		name: "Read",
		components: {TopBar },
		methods: {
			decryptMessage( userId, message  ) {

				if( message == "" || userId == '' ) return false;

				let key = window.contacts[userId]['key'];
				if( !key ) {
					alert( "Unknown user key")
					throw( "Unknown user key" )
				}

				this.decryptButton = "Decrypting..."

				encOb.decrypt( message, key ).then( (decMessage) => {
					console.log( decMessage );
					this.encryptionReady = false
					this.decryptedMessage = decMessage;
					this.decryptButton = "Decrypt Message";
				})
			},

			checkReady() {
				this.encryptionReady = false
				if( this.selected.trim() != '' && this.message.trim() != '' ) {
					this.encryptionReady = true
				}
			}
		},

		data() {
			return {
				reactive: true,
				contacts: window.contacts,
				message: "",
				selected: "",
				decryptedMessage: "",
				encryptionReady: false,
				decryptButton: 'Decrypt Message',
			}

		},
	}
</script>

<style scoped>

	textarea {
		margin: 10px 0;
		height: 335px;
		resize: none;
	}

	.contact-list {
		width: 85%;
	}

	button:not(.btn-light) {
		width: 100%;
	}

	.btn-light {
		background-color: white;
		color: #2980B9;
		border: 1px solid #2980B9;
		border-radius: 5px;
		height: 30px;
		float: right;
		padding: 5px;
		width: 10%;
	}

	.btn-light:hover {
		background-color: #2980B9;
		color: white;
	}

	.decryptedMessage {
		width: 100%;
		height: 375px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		padding: 5px;
		font-size: 15px;
		margin-bottom: 10px;
		overflow: auto;
		background-color: white;
	}

	pre {
		font-family: sans-serif;
		color: #34495e;
		font-size: 16px;
	}

</style>