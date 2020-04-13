
import { isBrowser } from '~/environment/esm'
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (isBrowser) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  }
}

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (isBrowser) {
    if (!name) return
    return window.localStorage.getItem(name)
  }
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (isBrowser) {
    if (!name) return
    window.localStorage.removeItem(name)
  }
}

// 对cookie的操作
export function setcookie (type, key, val, days = 30, path = '/') {
  const method = {
    // 获取cookies
    get () {
      var arr = []; var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
      if (arr === document.cookie.match(reg)) {
        return unescape(arr[2])
      } else {
        return null
      }
    },
    // 设置cookies
    set () {
      var Days = days
      var exp = new Date()
      var args = ''
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      args = key + '=' + escape(val) + ';expires=' + exp.toGMTString()
      if (path) args += ';path=' + path

      document.cookie = args
    },
    // 删除cookie
    delete () {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.getCookie(key)
      if (cval != null) document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
  return method[type]()
}
export function getCookie (cookie, name) {
  if (!cookie) {
    return ''
  }
  const arrcookie = cookie.split('; ')// 分割
  // 遍历匹配
  for (let i = 0; i < arrcookie.length; i++) {
    const arr = arrcookie[i].split('=')
    if (arr[0] === name) {
      return arr[1]
    }
  }
  return ''
}
