import { ANDROID, IOS } from '~/environment/esm'
if (process.BROWSER_BUILD && process.env.NODE_ENV === 'production' && !IOS && !ANDROID) {
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement('script')
    hm.src = 'https://s23.cnzz.com/z_stat.php?id=1277892820&web_id=1277892820'
    hm.id = 'cnzz_tj'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
}
export default ({ app: { router }, store }) => {
  router.afterEach((to, from) => {
    // eslint-disable-next-line
    var _hmt = _hmt || [];
    (function() {
      document.getElementById('cnzz_tj') && document.getElementById('cnzz_tj').remove()
      var hm = document.createElement('script')
      hm.src = 'https://s23.cnzz.com/z_stat.php?id=1277892820&web_id=1277892820'
      hm.id = 'cnzz_tj'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()
  })
}
