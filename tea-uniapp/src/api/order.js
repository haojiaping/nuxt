
// 订单详情页
export function getOrderdetail(option) {
  return global.$http.request({
    url: 'product/order/detail',
    method: 'post',
    data: option
  })
}
// 多商品物流中间页
export function getOrderPro(option) {
  return global.$http.request({
    url: 'product/order/postage',
    method: 'post',
    data: option
  })
}
export function getpostdetail(option) {
  return global.$http.request({
    url: 'product/order/postage/detail',
    method: 'post',
    data: option
  })
}
//查询支付状态
export function getPaystate(option) {
  return global.$http.request({
    url: 'pay/synPay',
    method: 'post',
    data: option
  })
}
// 获取邮费
export function getAddpri(option) {
  return global.$http.request({
    url: 'product/postage',
    method: 'post',
    data: option
  })
}
// 获取订单列表
export function getOrderList(option) {
  return global.$http.request({
    url: 'product/order/list/app',
    method: 'post',
    data: option
  })
}
// 订单初始化
export function orderInit(option) {
  return global.$http.request({
    url: 'product/initialize/order',
    method: 'post',
    data: option
  })
}
// 获取邮费 (新
export function orderInitUpdate(option) {
  return global.$http.request({
    url: 'product/update/initialize',
    method: 'post',
    data: option
  })
}
// 取消订单
export function delOrder(option) {
  return global.$http.request({
    url: 'product/order/cancel',
    method: 'post',
    data: option
  })
}
// 取消订单
    export function sureOrder(option) {
      return global.$http.request({
        url: 'product/order/receive',
        method: 'post',
        data: option
      })
    }
// 发表评论
    export function senddis(option) {
      return global.$http.request({
        url: 'product/save/comment',
        method: 'post',
        data: option
      })
    }
// 发表评论
    export function disGoods(option) {
      return global.$http.request({
        url: 'product/order/detail/comment',
        method: 'post',
        data: option
      })
    }