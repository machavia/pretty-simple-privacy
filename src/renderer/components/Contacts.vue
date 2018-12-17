<template>
	<div>
		<top-bar title="Contacts"></top-bar>
		<div class="half">
			<h3>Add new contact</h3>
			<form>
				<label>Name</label><br/>
				<input type="text" placeholder="John Doe" v-model="cName"/>
				<br/><br/>
				<label>Public Key</label><br/>
				<textarea v-model="cPubKey" placeholder="-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----"></textarea>
				<br/><br/>
				<button type="button" @click="addContact( cName, cPubKey)">Add</button>
			</form>
		</div>
		<div class="half text-center">
			<button  class="share-btn" @click="copyKey()">Copy Your Own Key To Share</button>
			<br/>
			<label>Contact List</label>
			<ul id="contact-list">
				<li v-for="contact in contacts">
					{{ contact.name }}
				</li>
			</ul>

		</div>
	</div>
</template>

<script>

	const crypto = require("crypto");
	const {clipboard} = require('electron')
	import TopBar from "./TopBar";
	import Encryption from "../../library/Encryption"
	import UserRegistry from "../../library/UserRegistry"

	let passPhrase = sessionStorage.getItem('passPhrase');


	let encOb = new Encryption()
	let userOb = new UserRegistry()

	if( passPhrase != '' && passPhrase != null ) {
		encOb.loadPersonalKeys( passPhrase ).catch((e) => {
			alert( 'An error occurred while loading your encryption keys')
			throw e;

		})
	}




	export default {
		name: "AddContact",
		components: {TopBar},
		data() {
			return {
				contacts: userOb.getSimpleList(),
				cName : '',
				cPubKey: '',
			}
		},
		methods: {
			copyKey() {
				clipboard.writeText( encOb.personalPublicKeyString )
			},
			addContact( name, publicKey ) {

				if( name.trim() == '' || publicKey.trim() == '' ) return false;

				let id = crypto.randomBytes(16).toString("hex");
				userOb.add( id, name, name, publicKey );
				this.contacts.push( {
					id : id,
					name: name
				});

				this.cName = ''
				this.cPubKey = ''

				window.contacts = userOb.reload()

				console.log( window.contacts );
			}
		}
	}

</script>

<style scoped>

	h3 {
		margin-bottom: 10px;
	}

	textarea {
		margin-top: 5px;
		height: 250px;
		resize: none;
	}

	ul {
		margin-top: 10px;
	}

	ul>li {
		list-style: none;
		color: #34495e;
		font-size: 16px;
		font-weight: normal;
		margin-bottom: 10px;
	}

	.share-btn {
		margin-top: 50px;
		margin-bottom: 45px;
	}
	input {
		margin-top: 5px;
	}

	#contact-list {
		height: 300px;
		overflow: auto;
	}


</style>