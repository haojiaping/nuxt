
// 获取运营位数据
export function getSpecial(option) {
  return global.$http.request({
    url: 'special/list',
    method: 'post',
    data: option
  })
}
// 运营位列表
export function operate(option) {
  return global.$http.request({
    url: 'category/initialization/operation/detail',
    method: 'post',
    data: option
  })
}
