
// 获取验证码
export function getCheckCode(option) {
  return global.$http.request({
    url: 'auths/getCheckCode',
    method: 'post',
    data: option
  })
}
export function AppletData(option) {
  return global.$http.request({
    url: 'weChat/Applet/getAppletData',
    method: 'post',
    data: option
  })
}

// 验证验证码
export function collCheckCode(option) {
  return global.$http.request({
    url: 'auths/register',
    method: 'post',
    data: option,
    headers: { tea: 'h5' }
  })
}
export function collCheckCodeHeader(option, headers) {
  return global.$http.request({
    url: 'auths/register',
    method: 'post',
    data: option,
    headers: headers
  })
}
// 验证验证码
export function bindphone(option) {
  return global.$http.request({
    url: 'auths/bindMobile',
    method: 'post',
    data: option
  })
}
export function getwxLgin(option) {
  return global.$http.request({
    url: 'auths/thirdLogin',
    method: 'post',
    data: option
  })
}
// 获取手机号
export function getwxPhone(option) {
  return global.$http.request({
    url: 'weChat/Applet/getMobile',
    method: 'post',
    data: option
  })
}