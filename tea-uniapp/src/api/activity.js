
// 活动商品列表
export function activityList(option) {
  return global.$http.request({
    url: 'activity/recommend/list',
    method: 'post',
    data: option
  })
}
//
// 新人领券
export function Coupon(option) {
  return global.$http.request({
    url: 'user/save/coupon',
    method: 'post',
    data: option
  })
}
// 天天领券
export function CouponSave(option) {
  return global.$http.request({
    url: 'coupon/save',
    method: 'post',
    data: option
  })
}
// 限时购
export function limitTime(option) {
  return global.$http.request({
    url: 'category/limitedTimeProduct/list',
    method: 'post',
    data: option
  })
}
// 限时购提醒
export function limitTimeReminde(option) {
  return global.$http.request({
    url: 'category/limitedTimePurchase/push',
    method: 'post',
    data: option
  })
}


// 兑换CDK

export function getcdk(option) {
  return global.$http.request({
    url: 'activity/conversion/cdKey',
    method: 'post',
    data: option
  })
}