
import Cookies from 'js-cookie'
import { WX } from '~/environment/esm'
// import { getCookie } from '~/utils/tool'
import { wxconfig } from '~/utils/shareWX'
// import { URL } from '~/config/constant'

// 用户信息状态管理

export const state = () => ({
  user: {
    userId: '',
    token: '',
    isLogin: false,
    mobileFlag: false,
    userAgent: ''
  }
})
export const mutations = {
  SET_TOKEN: (state, token) => {
    state.user.token = token
  },
  SET_USERID: (state, userId) => {
    state.user.userId = userId
  },
  SET_ISLOGIN: (state, isLogin) => {
    state.user.isLogin = isLogin
  },
  SET_MOBILEFLAY: (state, mobileFlag) => {
    state.user.mobileFlag = mobileFlag
  },
  SET_USERAGENT: (state, userAgent) => {
    state.user.userAgent = userAgent
  }
}
export const actions = {
  // 登录
  saveLogin({ commit }, userInfo) {
    commit('SET_USERID', userInfo.userId)
    commit('SET_TOKEN', userInfo.token)
    commit('SET_MOBILEFLAY', userInfo.mobileFlag)
    commit('SET_ISLOGIN', userInfo.isLogin)

    Cookies.set('__teaUser__', JSON.stringify(userInfo), { expires: 365 })
    // 还需要进行本地存储
  },
  saveUserAgent({ commit }, userAgent) {
    commit('SET_USERAGENT', userAgent)
  },
  userStarusInit(store) {
    const user = decodeURIComponent(Cookies.get('__teaUser__'))
    const userInfo = user === 'undefined' ? {} : JSON.parse(user)
    if (userInfo.userId && userInfo.token) {
      userInfo.isLogin = true
    } else {
      userInfo.isLogin = false
      userInfo.userId = ''
      userInfo.token = ''
      userInfo.mobileFlag = false
    }
    const UA = navigator.userAgent.toLowerCase()
    store.dispatch('saveUserAgent', UA)
    store.dispatch('saveLogin', userInfo)
  },
  // 全局服务初始化
  // nuxtServerInit(store, { req }) {
  //   //检查是否登录
  //   let user = decodeURIComponent(getCookie(req.headers.cookie,'__teaUser__'))
  //   const userInfo = user?JSON.parse(user):{}
  //   if (userInfo.userId&&userInfo.token) {
  //     userInfo.isLogin = true
  //   } else {
  //     userInfo.isLogin = false
  //   }
  //   store.dispatch('saveLogin', userInfo)
  //   // 检查设备类型
  //   const userAgent = isServer ? req.headers['user-agent'].toLowerCase() : navigator.userAgent.toLowerCase()
  //   store.commit('SET_USERAGENT', userAgent)
  // },
  // 微信分享
  async getShareWxArg ({ commit }, optionOther) {
    if (WX) {
      const optionUrl = window.location.href.split('#')[0]
      const wxdata = (await this.$axios.$post('weChat/config', { url: optionUrl })).data
      wxconfig(wxdata, optionOther)
    }
  }
}
export const getters = {
  user: state => state.user
}
