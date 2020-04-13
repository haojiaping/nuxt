// import {getToken} from '~/utils/auth' // getToken from cookie
/**
* 路由鉴定
* 一些页面游客无权限访问，需要重新登陆
*/

// import {wxreURL} from "~/config/constant"
// import { setStore, getStore, removeStore } from "~/utils/tool"
// export default async function ({next, route, store,redirect}) {
//   const needLogin = ['/cart',`/self`,'/pay/sure']; // 需要登录名单
//   const LoginStatus = store.getters.user.isLogin
//   const UA = store.getters.user.userAgent
//   console.log(store.getters.user);
//   const WX = UA.includes('micromessenger')
//   // 用户登录的时候
//   if (LoginStatus) {
//     if (['/login','/wxpage'].includes(route.path)) {
//       // 返回首页
//       redirect('/')
//     } else {
//       // 请求申请个人信息接口 => 当有Token的时候
//       // store.dispatch("GetUserInfo");
//     }
//   } else {
//     // 未登录访问需要登录的时候
//     if (needLogin.includes(route.path)) {
//         //微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
//         if (WX) {
//           setStore('__redirectUrl__',route.path)
//           redirect(wxreURL)
//         } else {
//           redirect('/login') // 否则全部重定向到登录页
//         }
//     }
//   }
// }
