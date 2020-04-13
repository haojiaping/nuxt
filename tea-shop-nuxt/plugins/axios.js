import qs from 'qs'
import baseURL from '~/environment/API_URL'
import { Toast } from 'vant'
export default function ({ $axios, redirect }) {
  $axios.defaults.baseURL = baseURL
  $axios.setHeader('tea', 'h5')
  // POST请求发出前进行转字符串操作
  $axios.onRequest(config => {
    if (config.method === 'post' && !(['user/upload', 'community/upload'].includes(config.url))) {
      config.data = qs.stringify(config.data)
    }
  })
  // 请求返回时拦截
  $axios.onResponse(response => {
    // code为非10000是抛错 可结合自己业务进行修改
    const res = response.data
    if (res.code !== 10000) {
      Toast.fail(res.message)
      return Promise.reject(res.message)
    } else {
      return response
    }
  })

  // 报错时跳转页面
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
