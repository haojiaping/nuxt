
// 获取用户信息
export const getUserData = 'user/info'

// 获取用户订单数量
export const getUserOrder = 'product/order/status/map'

// 获取用户收藏列表
export const getUserColl = 'user/collect/list'

// 获取用户优惠券列表
export const getUserCoupon = 'user/coupon'

// 修改昵称 头像 性别
export const upUserData = 'user/update/info'

// 获取收货地址
export const getAddress = 'user/get/address'

// 添加收货地址
export const setAppendAdd = 'user/save/address'

// 修改收货地址
export const upDateAdd = 'user/update/address'

// 删除收货地址
export const deleteAdd = 'user/delete/address'

// 足迹列表
export const footList = 'user/footprint/list'

// 清空足迹
export const clearfootList = 'user/footprint/del'

// 上传图片
export const upimage = 'user/upload'
// 社区上传
export const upimagePost = 'community/upload'

// return axiosPostUpload(`${urluser/upload` option {'Content-Type': 'multipart/form-data'
// .then(res => {
//   return res.data
// .catch(err => {
//   return err
//

// 上传视频
export const axiosPostUpload = 'comment/video/upload'

// 分享'
export const shareApi = 'user/share/data'
// 签到
export const sign = 'activity/sign'
// 查询签到状态
export const findSign = 'activity/find/signFlag'
// 签到提醒开关
export const remind = 'activity//sign/remind'
