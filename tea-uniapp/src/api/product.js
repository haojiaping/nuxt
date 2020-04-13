
// 获取产品列表
export function getProductList(option) {
  return global.$http.request({
    url: 'product/list/app',
    method: 'post',
    data: option
  })
}
export function getBrandList(option) {
  return global.$http.request({
    url: 'product/brand/list/app',
    method: 'post',
    data: option
  })
}
// 获取商品详情
export function getProduct(option) {
  return global.$http.request({
    url: 'product/app/detail',
    method: 'post',
    data: option
  })
}
// 添加收藏
export function upColl(option) {
  return global.$http.request({
    url: 'user/collect',
    method: 'post',
    data: option
  })
}
// 添加收藏
export function delColl(option) {
  return global.$http.request({
    url: 'user/collect/del',
    method: 'post',
    data: option
  })
}
// 添加足迹
export function upFoot(option) {
  return global.$http.request({
    url: 'user/footprint',
    method: 'post',
    data: option
  })
}
// 添加产品到购物车
export function upOldCart(option) {
  return global.$http.request({
    url: 'product/order/cart/save',
    method: 'post',
    data: option
  })
}
export function upCart(option) {
  return global.$http.request({
    url: 'product/shop/cart/save',
    method: 'post',
    data: option
  })
}
// 生成订单
export function setOrder(option) {
  return global.$http.request({
    url: 'product/order/save',
    method: 'post',
    data: option
  })
}
// 设置订单地址
export function setOrderAdd(option) {
  return global.$http.request({
    url: 'product/update/order/address',
    method: 'post',
    data: option
  })
}
// 获取购物车数据
export function getCart(option) {
  return global.$http.request({
    url: 'product/shop/cart/list/app',
    method: 'post',
    data: option
  })
}
// 获取购物车下方相关推荐
export function getCartAbout(option) {
  return global.$http.request({
    url: 'product/recommend/list',
    method: 'post',
    data: option
  })
}
// 获取用户购物车数量
export function cartNum(option) {
  return global.$http.request({
    url: 'product/shop/cart/count',
    method: 'post',
    data: option
  })
}
// 购物车获取规格列表

export function attrList(option) {
  return global.$http.request({
    url: 'product/app/attrList',
    method: 'post',
    data: option
  })
}
export function cartOldNum(option) {
  return global.$http.request({
    url: 'product/cart/count',
    method: 'post',
    data: option
  })
}
// 购物车转订单
export function cartToOrder(option) {
  return global.$http.request({
    url: 'product/shop/cart/to/order',
    method: 'post',
    data: option
  })
}
// 更新购物车数量
export function upCartcount(option) {
  return global.$http.request({
    url: 'product/shop/cart/update/count',
    method: 'post',
    data: option
  })
}
// 删除购物车
export function deleteCart(option) {
  return global.$http.request({
    url: 'product/shop/cart/delete',
    method: 'post',
    data: option
  })
}
// 清空购物车
export function deleteCartAll(option) {
  return global.$http.request({
    url: 'product/cart/delete',
    method: 'post',
    data: option
  })
}
// 评论列表
export function disList(option) {
  return global.$http.request({
    url: 'product/comment',
    method: 'post',
    data: option
  })
}
// 评论点赞
export function isLike(option) {
  return global.$http.request({
    url: 'product/save/comment/like',
    method: 'post',
    data: option
  })
}