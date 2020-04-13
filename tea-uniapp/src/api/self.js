
// 获取用户信息
export function getUserData(option) {
  return global.$http.request({
    url: 'user/info',
    method: 'post',
    data: option
  })
}
// 获取用户订单数量
export function getUserOrder(option) {
  return global.$http.request({
    url: 'product/order/status/map',
    method: 'post',
    data: option
  })
}
// 获取用户收藏列表
export function getUserColl(option) {
  return global.$http.request({
    url: 'user/collect/list',
    method: 'post',
    data: option
  })
}
// 获取用户优惠券列表
export function getUserCoupon(option) {
  return global.$http.request({
    url: 'user/coupon',
    method: 'post',
    data: option
  })
}
// 修改昵称 头像 性别
export function upUserData(option) {
  return global.$http.request({
    url: 'user/update/info',
    method: 'post',
    data: option
  })
}
// 获取收货地址
export function getAddress(option) {
  return global.$http.request({
    url: 'user/get/address',
    method: 'post',
    data: option
  })
}
// 添加收货地址
export function setAppendAdd(option) {
  return global.$http.request({
    url: 'user/save/address',
    method: 'post',
    data: option
  })
}
// 修改收货地址
export function upDateAdd(option) {
  return global.$http.request({
    url: 'user/update/address',
    method: 'post',
    data: option
  })
}
// 删除收货地址
export function deleteAdd(option) {
  return global.$http.request({
    url: 'user/delete/address',
    method: 'post',
    data: option
  })
}
// 足迹列表
export function footList(option) {
  return global.$http.request({
    url: 'user/footprint/list',
    method: 'post',
    data: option
  })
}
// 清空足迹
export function clearfootList(option) {
  return global.$http.request({
    url: 'user/footprint/del',
    method: 'post',
    data: option
  })
}
// // 上传图片
// export const upimage = 'user/upload'
// // 社区上传
// export const upimagePost = 'community/upload'

// // 上传视频
// export const axiosPostUpload = 'comment/video/upload'
