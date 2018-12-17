import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(VueRouter)

/* eslint-disable no-new */

import Login from "./components/Login"
import Signup from "./components/Singup"
import Write from '@/components/Write'
import Read from '@/components/Read'
import Contacts from '@/components/Contacts'

const routes = [
	{
		path: '/contacts',
		component: Contacts,
		beforeEnter: (to, from, next) => {
			if( sessionStorage.getItem('passPhrase') == null ) next({ path: '/login' })
			else next()
		}
	},
	{
		path: '/read',
		component: Read,
		beforeEnter: (to, from, next) => {
			if( sessionStorage.getItem('passPhrase') == null ) next({ path: '/login' })
			else next()
		}
	},
	{
		path: '/write',
		component: Write,
		beforeEnter: (to, from, next) => {
			if( sessionStorage.getItem('passPhrase') == null ) next({ path: '/login' })
			else next()
		}
	},
	{
		path: '/login',
		component: Login,
		beforeEnter: (to, from, next) => {
			if( sessionStorage.getItem('passPhrase') != null ) next({ path: '/contacts' })
			else next()
		}
	},
	{
		path: '/signup',
		component: Signup,
		beforeEnter: (to, from, next) => {
			if( sessionStorage.getItem('passPhrase') != null ) next({ path: '/contacts' })
			else next()
		}
	},
]

const router = new VueRouter({
	routes // short for `routes: routes`
})



window.EventBus = new Vue({
	components: {App},
	template: '<App/>',
	router
}).$mount('#app')

router.push('/login')