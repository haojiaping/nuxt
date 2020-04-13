export const URL = 'https://m.chazhenxuan.com'
// export const URL = `10.10.10.71:3000`
// 重定向到wxpage  即之前保存的页面   登录
export const wxreURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx929ed2111ec09011&redirect_uri=${encodeURIComponent(URL)}/wxpage&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
// 重定向到支付确认页面   支付
export const wxreFunPay = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx929ed2111ec09011&redirect_uri=${encodeURIComponent(URL)}/pay/sure&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
// 再次支付页面
export function wxreAgainPay(url) {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx929ed2111ec09011&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
}
