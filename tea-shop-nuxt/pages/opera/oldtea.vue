/* eslint-disable no-undef */
<template>
  <div class="oldTeaWraper">
    <!-- v-show='isFlag!=0' -->
    <Backbar :bgColor="bgColor"

             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :fixed='true'
             :shartOption="shartOption"
     ref='topBar'
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             :title='title'
             class='back' />
    <div ref="mescroll"
         class="mescroll subWrap pf">
      <div class='listWrap'>
        <div class="topimages pr">
          <div class="sub"></div>
          <div class="titleimg"></div>
        </div>
        <div id="oldWraper">
          <!-- <OldTeaItem :datas="dataList"
                      :gobackMyback="gobackMyback"></OldTeaItem> -->
                       <productList :dataList="dataList"></productList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backbar from '~/components/backbar'
// eslint-disable-next-line no-unused-vars
import productList from '~/components/productList'
import OldTeaItem from '~/components/opera/OldItem/OldTeaItem'
// eslint-disable-next-line no-unused-vars
import { getProductList } from '~/api/product'
// eslint-disable-next-line no-unused-vars
import { getSpecial } from '~/api/special'
import { IOS, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      mescroll: null,
      dataList: [], // 列表数据
      jump: null,
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/activity/newcomers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      title: '',
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff',
      isFlag: 0
    }
  },
  watch: {

  },
  // created() {
  //   this.jump = sessionStorage.getItem('__special_h__')
  //   // sessionStorage.removeItem('__special_h__')
  //   // eslint-disable-next-line no-undef
  //   console.log(this.jump)
  // },

  mounted () {
    this.mescrollInit()
    // eslint-disable-next-line no-undef

    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-undef
  },

  methods: {

    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.getdisList,
          isBounce: false,
          lazyLoad: {
            use: true
          },
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 99999 // 每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">茶有底，道无尽。</p>',
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'upscrollWarp', // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }

      })
      this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 50) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '普洱老茶'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },

    getdisList (page, mescroll) {
      // sessionStorage.removeItem('__special_h__')
      // eslint-disable-next-line no-undef
      this.jump = sessionStorage.getItem('__special_h__')
      console.log(this.jump)
      const option = {
        specialType: 1,
        lastId: 0,
        userId: ''
      }
      // eslint-disable-next-line no-unused-vars
      if (IOS) {
        window.callback(ios => {
          ios.callHandler('getUserInfo', null, res => {
            const userId = res.userId
            const token = res.token
            if (userId && token) {
              const isLogin = true
              this.saveLogin({ userId, token, isLogin })
            }
            option.userId = userId
            this.getSpecialdata(page, mescroll, option)
          })
        })
      } else if (ANDROID) {
        const userId = window.android.getUserId()
        const token = window.android.getToken()
        const isLogin = true
        this.saveLogin({ userId, token, isLogin })
        option.userId = userId
        this.getSpecialdata(page, mescroll, option)
      } else {
        option.userId = this.user.userId
        this.getSpecialdata(page, mescroll, option)
      }
    },
    getSpecialdata (page, mescroll, option) {
      // eslint-disable-next-line no-unused-vars
      console.log(this.$refs.mescroll.scrollTop)
      // eslint-disable-next-line no-undef
      // console.log(jump)

      this.$axios.$post(getSpecial, option).then(res => {
        this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
            // mescroll.endSuccess(0)
            console.log(this.$refs.mescroll.scrollTop)
            this.$refs.mescroll.scrollTop = this.jump
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      }).catch(err => {
        mescroll.endErr()
        console.log(err)
      })
    },

    ...mapActions(['saveLogin'])
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    ...mapGetters([
      'user']),
    gobackMyback () {
      return IOS || ANDROID
    }
  },
  components: {
    Backbar,
    // eslint-disable-next-line vue/no-unused-components
    OldTeaItem,
    // eslint-disable-next-line vue/no-unused-components
    productList

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.oldTeaWraper {
  /deep/ .mescroll-upwarp {
    min-height: 0;
  }
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      .top-bg {
        background: url('~assets/img/opera/oldtea/bg.png') repeat;
      }
      .topimages {
        .sub {
          width: 100%;
          height: 120px;
          background-size: cover;
          @include bg-image('opera/oldtea/sub');
        }
        .titleimg {
          display: block;
          margin: 0 auto;
          width: 100%;
          height: 57.5px;
          background-size: cover;
          @include bg-image('opera/oldtea/title');
        }
      }
    }
  }
}
</style>
