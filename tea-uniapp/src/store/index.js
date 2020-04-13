import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		user: {},
	},
	mutations: {
		login(state, provider) {

			state.hasLogin = true;
			state.user = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'user',  
			    data: provider  
			}) 
			console.log(state);
		},
		logout(state) {
			state.hasLogin = false;
			state.user = {};
			uni.removeStorage({  
                key: 'user'  
            })
		}
	},
	actions: {
		saveLogin({commit},userInfo){
			commit('login',userInfo)
		},
		logout({commit}){
			commit('logout')
		}
	},
	getters : {
		user: state => state.user,
		hasLogin: state => state.hasLogin,
	}
})

export default store
