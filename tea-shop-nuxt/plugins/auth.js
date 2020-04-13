
// 鉴权处理
// import { ANDROID, IOS, WX } from '~/environment/esm'
import { setStore } from '~/utils/tool'
import { wxreURL } from '~/config/constant'

export default ({ app: { router }, store }) => {
  // 每次页面切换
  router.beforeEach((to, from, next) => {
    store.dispatch('userStarusInit')
    const needLogin = ['/cart', '/pay/sure', '/self/detail', 'userid/send', '/custom', '/order/list', '/self/addlist', '/self/coll', '/self/foot', '/self/coupon'] // 需要登录名单
    const LoginStatus = store.getters.user.isLogin
    const UA = store.getters.user.userAgent
    const WX = UA.includes('micromessenger')
    if (WX) needLogin.push('/self')
    // 用户登录的时候
    if (LoginStatus) {
      if (['/login', '/wxpage'].includes(to.path)) {
        // 返回首页
        next('/')
        // window.location.replace(`${URL}/`)
        // 返回支付完成时
      } else if (to.path === '/pay/over' && from.path === '/order/detail') {
        next('/')
      } else {
        next()
        // 请求申请个人信息接口 => 当有Token的时候
        // store.dispatch("GetUserInfo");
      }
    } else {
      // 未登录访问需要登录的时候
      if (needLogin.includes(to.path)) {
        setStore('__redirectUrl__', to.path)
        // 微信中  先保存当前url  然后进行重定向获取code  提交code   获取到用户信息 后会跳转到之前保存的url中
        if (WX) {
          window.location.replace(wxreURL)
        } else {
          next('/login')
          // window.location.replace(`${URL}/login`) // 否则全部重定向到登录页
        }
      } else {
        next()
      }
    }
    // //详情页有单独的调用分享
    // if ( WX && to.name!=='productId') {
    //   store.dispatch('getShareWxArg')
    // }
    // next();
  })
}
