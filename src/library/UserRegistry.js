'use strict'

const fs = require('fs');
const remote = require('electron').remote;
const app = remote.app;
const keysPath = app.getPath('userData') +'/keys'


export default class UserRegistry {


	constructor() {
		this.registry = {}

		if(!fs.existsSync(keysPath )) fs.mkdirSync(keysPath)

		if( !fs.existsSync(  keysPath + '/contacts.json') ) {

			fs.writeFileSync( keysPath + '/contacts.json', JSON.stringify( this.registry ), 'utf8');
			return true;
		}


		this.registry = JSON.parse( fs.readFileSync( keysPath + '/contacts.json', 'utf8') );
	}

	reload() {
		if( !fs.existsSync(  keysPath + '/contacts.json') ) {
			this.registry = JSON.parse( fs.readFileSync( keysPath + '/contacts.json', 'utf8') );
		}

		return this.registry;
	}

	save() {
		fs.writeFileSync( keysPath + '/contacts.json', JSON.stringify( this.registry ), 'utf8');
	}

	add( id, name, email, publicKey ) {
		if( this.registry[id] !== undefined ) throw new Error( "User Id Already Exist")

		for(var user in this.registry ) {
			if( user.mail == email ) {
				throw new Error( "User Email Already Exist")
			}
		}

		this.registry[id] = {
			id: id,
			name: name,
			mail: email,
			key : publicKey
		}

		this.save()
	}

	getKey( userId ) {
		if( this.registry[userId] === undefined ) return false

		return this.registry[userId]['key'];
	}

	getUserBy( userId ) {

		if( this.registry[userId] === undefined ) return false

		return this.registry[userId];
	}

	getUserByMail( mail ) {

	}

	getSimpleList() {

		let arr = []
		for(var userId in this.registry ) {
			let user = this.registry[userId]
			arr.push( {id: user.id, name : user.name });
		}

		return arr

	}

}