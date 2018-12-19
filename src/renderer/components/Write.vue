<template>
	<div>
		<top-bar title="Write Message"></top-bar>
		<div class="half">
			<select v-model="selected" v-on:change="checkReady()" class="contact-list">
				<option disabled value="">Select the recipient</option>
				<option v-for="contact in contacts" v-bind:value="contact.id">
					{{ contact.name }}
				</option>
			</select>
			<router-link to="/contacts">
				<button class="btn-light"><i class="fas fa-user-plus"></i></button>
			</router-link>

			<textarea v-model="message" placeholder="Write your message" v-on:input="checkReady()"></textarea>
			<br/>
			<button v-bind:class="{ bsecondary: !encryptionReady }" @click="encryptMessage( selected, message )">{{encryptButton}}</button>
		</div>
		<div class="half">
			<div v-if="encryptedMessage != ''" class="encryptedMessage">
				<code>
					{{ encryptedMessage }}
				</code>
			</div>
			<button v-if="encryptedMessage != ''" @click.once="copyToClip( encryptedMessage )">Copy to clipboard</button>
		</div>
	</div>
</template>

<script>

	import Encryption from "../../library/Encryption"
	import UserRegistry from "../../library/UserRegistry"
	import TopBar from "./TopBar";
	let passPhrase = sessionStorage.getItem('passPhrase');

	const {clipboard} = require('electron')


	let encOb = new Encryption()
	let userOb = new UserRegistry()

	if( passPhrase != '' && passPhrase != null ) {
		encOb.loadPersonalKeys(passPhrase).catch((e) => {
			alert('An error occurred while loading your encryption keys')
			throw e;

		})
	}

	window.contacts = userOb.reload();

	export default {
		name: "CleanMessage",
		components: {TopBar },
		methods: {
			encryptMessage( userId, message  ) {

				if( message == "" || userId == '' ) return false;

				let key = window.contacts[userId]['key'];
				if( !key ) {
					alert( "Unknown user key")
					throw( "Unknown user key" )
				}

				this.encryptButton = "Encrypting..."

				encOb.encrypt( message, key ).then( (encMessage) => {
					this.encryptionReady = false
					this.encryptedMessage = encMessage;
					this.encryptButton = "Encrypt Message";
				})
			},

			checkReady() {
				this.encryptionReady = false
				if( this.selected.trim() != '' && this.message.trim() != '' ) {
					this.encryptionReady = true
				}
			},
			copyToClip( message ) {
				clipboard.writeText(message)
			}
		},

		data() {
			return {
				reactive: true,
				contacts: window.contacts,
				message: "",
				selected: "",
				encryptedMessage: "",
				encryptionReady: false,
				encryptButton: 'Encrypt Message',
			}

		},
		mounted() {

		}
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

	.encryptedMessage {
		width: 100%;
		height: 375px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		border: 1px solid lightslategray;
		padding: 5px;
		font-size: 15px;
		margin-bottom: 10px;
		overflow: auto;
		background-color: white;
	}
</style>