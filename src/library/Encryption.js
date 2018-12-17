'use strict'

const remote = require('electron').remote;
const app = remote.app;
const keysPath = app.getPath('userData') +'/keys'
const openpgp = require('openpgp')
const fs = require('fs');

export default class Encryption {


	constructor() {
		this.passPhrase = false;
	}

	async loadPersonalKeys( passPhrase ) {

		if( this.checkIfKeysExists() === false ) {
			return Promise.reject( 'Personal keys does not exist' );
		}

		this.passPhrase = passPhrase
		let personalPrivateKeyString = fs.readFileSync( keysPath + '/private.pgp', 'utf8');
		this.personalPublicKeyString = fs.readFileSync( keysPath + '/public.pgp', 'utf8');

		let privP = this.loadKey(personalPrivateKeyString, this.passPhrase ).then( (key) => {
			this.personalPrivateKey = key

		});

		let pubP =  this.loadKey(this.personalPublicKeyString, false).then( (key) => {
			this.personalPublicKey = key
			return true;
		});


		return Promise.all([privP, pubP]).then((e) => {
			return Promise.resolve(e);
		}).catch((e) => {
			return Promise.reject( e )
		});


	}

	async loadKey( key, passPhrase ) {

		const privKeyObj = (await openpgp.key.readArmored(key)).keys[0]

		//this is a private key
		if (passPhrase !== false) {
			await privKeyObj.decrypt(passPhrase).catch((e) => {
				return Promise.reject( e )
			})
		}

		return Promise.resolve( privKeyObj );

	}

	checkIfKeysExists() {
		if( fs.existsSync(  keysPath + '/private.pgp') ) {
			return true
		}

		return false;
	}

	async createKeys( name, email, passPhrase ) {

		if( this.checkIfKeysExists() ) {
			return Promise.reject( 'Keys already exist')
		}

		let options = {
			userIds: [{ name:name, email:email }],
			numBits: 4096,
			passphrase: passPhrase
		};

		return openpgp.generateKey(options).then(function(key) {
			let privkey = key.privateKeyArmored;
			let pubkey = key.publicKeyArmored;
			let revocationSignature = key.revocationSignature;

			try {
				fs.writeFileSync( keysPath + '/private.pgp', privkey, 'utf8');
				fs.writeFileSync(keysPath + '/public.pgp', pubkey, 'utf8');
				fs.writeFileSync(keysPath + '/revocation.pgp', revocationSignature, 'utf8');
			}
			catch (e) {
				return Promise.reject( e )
			}

			return Promise.resolve( keysPath )

		});
	}

	async encrypt( messageString, receiverPublicKey ) {

		let privKeyObj = this.personalPrivateKey

		const options = {
			message: openpgp.message.fromText(messageString),
			publicKeys: (await openpgp.key.readArmored(receiverPublicKey)).keys, // for encryption
			privateKeys: [privKeyObj]                                 // for signing (optional)
		}

		return openpgp.encrypt(options).then(ciphertext => {
			return ciphertext.data
		})
	}

	async decrypt( encryptedMessage, senderPublicKey  ) {
		let privKeyObj = this.personalPrivateKey

		const options = {
				message: await openpgp.message.readArmored(encryptedMessage),        // parse armored message
			publicKeys: (await openpgp.key.readArmored(senderPublicKey)).keys,   // for verification (optional)
			privateKeys: [privKeyObj]                                   // for decryption
		}

		return openpgp.decrypt(options).then(plaintext => {
			return plaintext.data
		})
	}

}