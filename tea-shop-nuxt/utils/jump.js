export function jumpUrl(jumpType, jumpContent) {
  let url = ''
  switch (jumpType) {
    case 'webViewX5':
      try {
        const orginUrl = JSON.parse(jumpContent).url
        const arrUrl = orginUrl.split('//')
        const start = arrUrl[1].indexOf('/')
        url = arrUrl[1].substring(start)
      } catch (err) {
        console.log(err)
      }
      return url
  }
}
