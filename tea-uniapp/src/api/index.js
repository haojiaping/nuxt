// 获取首页banner
export function getIndexBanner(option) {
	return global.$http.request({
	  url: 'common/banner/list',
	  method: 'post',
	  data: option
	})
}
// 获取首页运营位
export function getIndexCategory(option) {
  return global.$http.request({
    url: 'category/list/app',
    method: 'post',
    data: option
  })
}
// 热销榜和新品榜
export function getHotList(option) {
  return global.$http.request({
    url: 'product/list/app/hot/Boutique',
    method: 'post',
    data: option
  })
}
// 首页下方猜你喜欢
export function getLike(option) {
  return global.$http.request({
    url: 'product/list/app/guess/like',
    method: 'post',
    data: option
  })
}
// 首页上部内容
export function homeTop(option) {
  return global.$http.request({
    url: 'category/initialization/top',
    method: 'post',
    data: option
  })
}
export function homeContent(option) {
  return global.$http.request({
    url: 'category/initialization/operation/content',
    method: 'post',
    data: option
  })
}
// 分类页面
export function list(option) {
  return global.$http.request({
    url: 'category/classify/list',
    method: 'post',
    data: option
  })
}
// 搜索热词
export function hotSearch(option) {
  return global.$http.request({
    url: 'product/hot/search',
    method: 'post',
    data: option
  })
}
// 搜索列表
export function searchList(option) {
  return global.$http.request({
    url: 'product/search',
    method: 'post',
    data: option
  })
}