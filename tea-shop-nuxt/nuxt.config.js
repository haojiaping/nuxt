const axios = require('axios')
// const version = '0.0.130'
module.exports = {
  mode: 'universal',

  render: {
    resourceHints: false
  },
  /*
  ** Headers of the page
  */
  head: {
    // title: process.env.npm_package_name || '',
    title: '茶臻选 - 正品茶城、品质保障、全国包邮',
    meta: [
      { charset: 'utf-8' },
      { name: 'applicable-device', content: 'mobile' },
      { name: 'viewport', content: 'width=device-width,maximum-scale=1.0,minimum-scale=1.0,initial-scale=1.0,user-scalable=no,shrink-to-fit=no,viewport-fit=cover' }
      // { hid: 'default-keywords', name: 'keywords', content: '买茶,茶商城,网上购茶,正品茶,茶臻选' },
      // { hid: 'default-description', name: 'description', content: '茶臻选商城是垂直茶领域的直销电商平台,在这您可以买到优质的普洱茶、绿茶、红茶、黑茶、白茶、花茶、袋泡茶、养生茶等多种茶叶,买正品好茶,就到茶臻选商城' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/mescroll.js@1.4.1/mescroll.min.css' }
      // { rel: 'manifest', href: 'https://m.ithome.com/json/manifest.json?v=20190534', type: 'application/manifest+json' }
    ],
    script: [
      // flexible.js
      // {src: require('assets/flexible.js')},
      // wxjdk
      { src: 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js' },
      // mescroll
      { src: 'https://cdn.jsdelivr.net/npm/mescroll.js@1.4.1/mescroll.min.js', charset: 'utf-8' },
      { src: 'https://unpkg.com/callapp-lib@2.1.5/dist/index.umd.min.js' }
      // 引入头条js
      // { src: '/js/toutiao.js' }
      // process.env.NODE_ENV === 'production' ? { src: '/js/toutiao.js' }: {}
      // 引入百度js
      // { src: '/js/toutiao.js' }
      // process.env.NODE_ENV === 'production' ? { src: '/js/baidu.js' }: {}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#58bb47' },
  /*
  ** Global CSS
  */
  css: [
    {
      src: '~assets/css/index.scss',
      lang: 'scss'
    },
    'swiper/dist/css/swiper.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/swiper.js', ssr: false },
    '~/plugins/axios',
    '~plugins/vant',
    { src: '~/plugins/cnzz_tj.js', ssr: false },
    { src: '~/plugins/auth.js', ssr: false }
    // { src: "~/plugins/vconsole", ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // baseURL : 'https://tea.izhentea.com/v1/'
  },
  router: {
    // middleware: 'permission',
    base: '/'
  },
  generate: {
    interval: 50
    // routes: async function () {
    //   const [product, article] = await Promise.all([
    //     axios.post('http://api.izhentea.com/v1/product/all'),
    //     axios.post('http://api.izhentea.com/v1/article/seo/all')
    //   ]).catch((error) => {
    //     console.log(error)
    //   })

    //   let routes = []
    //   const productAll = product.data.data.map(product => { return `/${product.productId}` })
    //   const articleALL = article.data.data.map(article => { return `/chayudetail/${article.articleId}` })
    //   routes = [...productAll, ...articleALL]
    //   return routes
    // }

    // routes: function () {
    //   return axios.post('http://api.izhentea.com/v1/product/all')
    //     .then((res) => {
    //       return res.data.data.map((product) => {
    //         return `/${product.productId}`
    //       })
    //     })
    // }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */

    // filenames: {
    //   app: `[name]${version}.js`,
    //   chunk: `[name]${version}.js`,
    //   css: `[name]${version}.css`,
    //   img: `[path][name]${version}.[ext]`,
    //   font: `[path][name]${version}.[ext]`,
    //   video: `[path][name]${version}.[ext]`,
    //   vendor: `vendor${version}.js`,
    //   manifest: `manifest${version}.js`
    // },
    vendor: ['axios', 'vant'],
    extractCSS: true,
    extend (config, ctx) {
    },
    maxChunkSize: 300000,
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        maxAsyncRequests: 7,
        cacheGroups: {
          vant: {
            test: /node_modules[\\/]vant/,
            chunks: 'all',
            priority: 20,
            name: true
          }
        }
      }
    },
    postcss: {
      plugins: {
        'postcss-pxtorem': {
          rootValue: 37.5,
          propList: ['*']
        }
      }
    }
  }
}
