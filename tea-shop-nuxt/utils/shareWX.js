// import { axiosPost } from 'api/config'
// import wx from 'weixin-js-sdk'
import { URL } from '~/config/constant'
// 分享系列函数
// export function getShareWxArg( optionOther)  {
//   console.log($axios);
//   console.log(this);
//   return
//   let optionUrl = window.location.href.split('#')[0]
//   this.$axios.$post(`${baseURL}weChat/config`, {url: optionUrl}).then(res => {
//     if (!optionOther) {
//       optionOther = {
//         type: 'index',
//         title: '同德臻茶', // 分享标题
//         desc: '臻选只为一杯好茶', // 分享描述
//         link: `${URL}/#/index`, // 分享链接
//         imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/4/ef8dcf10-1556-4b4f-aadc-e8ca40f617de.jpg'// 分享图标
//       }
//     }
//     wxconfig(res.data.data, optionOther)
//   }).catch(err => {
//     return err
//   })
// }
// 微信分享配置
export function wxconfig (data, option) {
  if (!option) {
    option = {
      type: 'url',
      data: {
        title: '茶臻选', // 分享标题
        desc: '臻选只为一杯好茶', // 分享描述
        link: `${URL}/`, // 分享链接
        imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/0baa146b-47e8-4fbb-ac08-bd43f8a4f7a7.jpg'// 分享图标
      }
    }
  }
  // eslint-disable-next-line
  wx.config({
    debug: false,
    appId: data.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.nonceStr, // 必填，生成签名的随机串
    signature: data.signature, // 必填，签名，见附录1
    // 需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
  })
  // eslint-disable-next-line
  wx.ready(function () {
    // 发送给朋友
    // eslint-disable-next-line
    wx.onMenuShareAppMessage({
      title: option.data.title, // 分享标题
      desc: option.data.desc, // 分享描述
      link: option.data.link, // 分享链接
      imgUrl: option.data.imgUrl, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        //            alert("canceled");
      }
    })

    // eslint-disable-next-line
    wx.onMenuShareTimeline({
      title: option.data.title, // 分享标题
      link: option.data.link, // 分享链接
      imgUrl: option.data.imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        //            alert("canceled");
        // 用户取消分享后执行的回调函数
      }
    })

    // eslint-disable-next-line
    wx.onMenuShareQQ({
      title: option.data.title, // 分享标题
      desc: option.data.desc, // 分享描述
      link: option.data.link, // 分享链接
      imgUrl: option.data.imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })

    // eslint-disable-next-line
    wx.onMenuShareWeibo({
      title: option.data.title, // 分享标题
      desc: option.data.desc, // 分享描述
      link: option.data.link, // 分享链接
      imgUrl: option.data.imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  })
}
