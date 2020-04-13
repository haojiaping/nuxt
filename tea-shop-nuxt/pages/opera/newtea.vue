<template>
  <div class="semWraper mescroll-touch"
       id="clickDownsem">
    <div :style="style"
         v-show='isFlag!=20'
         class='top-bg'></div>
    <backbar :bgColor="bgColor"
             :rightIcon="gobackMyback?'share':''"
             rightSize="20px"
             :shartOption="shartOption"
             :rightIconColor='rightIconColor'
             :leftColor='leftColor'
             @setHeight='getHeight'
             :title='toptitle' />
    <div ref="mescroll"
         class='mescroll mescroll-content'>
      <div>
        <div class="loading"
             v-show="loading">
          <van-loading type="spinner" />
        </div>

        <div v-show="!loading">

        <div class='top-fix'
             ref='topImg'>
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/teapot/top.png')"
                 alt="">
          </div>
        </div>
        <!-- <div ref='navItem'
             :style='styles'
             :class='fixed'>
          <ul class='nav-items'>
            <li v-for='(item,index) in navitems'
                :key='item.name'
                :class="[navActive.id===item.id?'active':'',index>0?'margin2':'']"
                @click="scrollTo(item)">{{item.name}}</li>
          </ul>
        </div> -->
        <div class='data-content'
             ref='listItem'>
          <div class='products-title'
               ref='title'>
            <img :src="require('~/assets/img/activity/teapot/title1.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList'
                    :specialType='30'
                    :num="80000"
                    :title='title[0]'
                    :color='color'></goodList>
          <img :src="require('~/assets/img/activity/teapot/bottom.png')"
               alt="">
        </div>
        <!-- <div class='data-content'>
          <div class='products-title'>
            <img :src="require('~/assets/img/activity/teapot/title2.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList1'
                    :specialType='31'
                    :title='title[1]'
                    :num="8"
                    :color='color'></goodList>
          <img :src="require('~/assets/img/activity/teapot/bottom.png')"
               alt="">
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <img :src="require('~/assets/img/activity/teapot/title3.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList2'
                    :specialType='32'
                    :title='title[2]'
                    :num="8"
                    :color='color'></goodList>
          <img :src="require('~/assets/img/activity/teapot/bottom.png')"
               alt="">
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <img :src="require('~/assets/img/activity/teapot/title4.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList3'
                    :specialType='33'
                    :title='title[3]'
                    :num="8"
                    :color='color'></goodList>
          <img :src="require('~/assets/img/activity/teapot/bottom.png')"
               alt="">
        </div> -->
        <div class='toTop'
             @click="toTop">
          <img :src="require('~/assets/img/activity/teapot/toTop.png')"
               alt="">
        </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpecialtype } from '~/api/special'
import backbar from '~/components/backbar'
import { IOS, WX, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
import goodList from '~/components/activity/teapot/goodList'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      dataList: [],
      dataList1: [],
      dataList2: [],
      dataList3: [],
      response: [],
      bgColor: 'transparent',
      rightIconColor: '#fff',
      leftColor: '#fff',
      toptitle: '',
      userId: '',
      isFlag: '',
      hjp: null,
      style: {
        height: '0px'
      },
      loading: false,
      shartOption: {
        type: 'url',
        data: {
          title: '小臻邀请您参与限时秒杀', // 分享标题
          desc: '10点开抢，爆品低价，1元，1折，大牌0利润。', // 分享描述
          link: `${URL}/opera/newtea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      newShare: 'newShare',
      changeColor: 'white',
      color: 'man',
      isShow: false,
      navitems: [
        {
          name: '每日上新',
          id: 1,
          scroll: 100
        },
        {
          name: '大牌驾到',
          id: 2,
          scroll: 200
        },
        {
          name: '独家好货',
          id: 3,
          scroll: 300
        },
        {
          name: '更多好茶',
          id: 4,
          scroll: 400
        }
      ],
      navActive: {
        name: '每日上新',
        id: 1,
        scroll: 100
      },
      title: [
        '每日上新',
        '大牌驾到',
        '独家好货',
        '更多好茶'
      ],
      mescroll: null,
      fixed: '',
      styles: {
        top: '40px'
      },
      isAddHeight: 0// 判断是否刘海屏来控制
    }
  },
  mounted () {
    this.loading = true
    // this.getSpecialdata()
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    mescrollInit (mescroll) {
      this.loading = true
      // sessionStorage.removeItem('__special_h__')
      // eslint-disable-next-line
      this.hjp = sessionStorage.getItem('__special_h__')
      sessionStorage.removeItem('__special_h__')
      // console.log(this.hjp)
      // console.log(sessionStorage)
      // this.hjp = sessionStorage.getItem('__special_h__')
      // eslint-disable-next-line no-undef
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getSpecialdata,
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 // 每页数据条数,默认10
          }
        },
        down: {
          use: false
        }
      })
      this.$nextTick(_ => {
        const _self = this
        // const navWarp = this.$refs.navItem
        // eslint-disable-next-line no-unused-vars
        // this.hjp = sessionStorage.getItem('__special_h__')
        // // sessionStorage.removeItem('hjp')
        // console.log(this.hjp)
        if (this.mescroll.os.ios) {
          // ios的悬停效果,通过给navWarp添加nav-sticky样式来实现
          // navWarp.classList.add('nav-sticky')
          // this.styles.top = this.isAddHeight + 'px'
          this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
            // const height = _self.$refs.topImg.offsetHeight + _self.$refs.navItem.offsetHeight - _self.$refs.title.offsetHeight - 20
            // _self.navitems.map((item) => {
            //   if (y >= (height + _self.$refs.listItem.offsetHeight * (item.id - 1)) && y < (height + _self.$refs.listItem.offsetHeight * (item.id))) {
            //     _self.navActive = item
            //   }
            // })
            if (y >= 50) {
              _self.bgColor = '#e3d6bc'
              _self.leftColor = '#333'
              _self.toptitle = '新茶推荐'
              _self.rightIconColor = '#333'
            } else {
              _self.bgColor = 'transparent'
              _self.toptitle = ''
              _self.leftColor = '#fff'
              _self.rightIconColor = '#fff'
            }
          }
        } else {
          // android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
          // navWarp.style.height = navWarp.offsetHeight + 'px'// 固定高度占位,避免悬浮时列表抖动
          this.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
            // const height = _self.$refs.topImg.offsetHeight - 40
            // if (y >= height) {
            //   _self.fixed = 'fixed'
            // } else {
            //   _self.fixed = ''
            // }
            // const Height = _self.$refs.topImg.offsetHeight + _self.$refs.navItem.offsetHeight - _self.$refs.title.offsetHeight - 40
            // _self.navitems.map((item) => {
            //   if (y >= (Height + _self.$refs.listItem.offsetHeight * (item.id - 1)) && y < (Height + _self.$refs.listItem.offsetHeight * item.id)) {
            //     _self.navActive = item
            //   }
            // })
            if (y >= 50) {
              _self.bgColor = '#e3d6bc'
              _self.leftColor = '#333'
              _self.toptitle = '新茶推荐'
              _self.rightIconColor = '#333'
            } else {
              _self.bgColor = 'transparent'
              _self.toptitle = ''
              _self.leftColor = '#fff'
              _self.rightIconColor = '#fff'
            }
          }
        }
      })
    },
    getSpecialdata (page, mescroll) {
      // scrollTo(0)
      const pageNum = page.num - 1
      // this.hjp = sessionStorage.getItem('hjp')
      // // sessionStorage.removeItem('hjp')
      // console.log(this.hjp)
      this.$axios.$post(getSpecialtype, {
        specialType: 46,
        lastId: 0,
        userId: '',
        pageNum: pageNum
      }).then(res => {
        // console.log(Promise.resolved)
        // console.log(this.hjp)
        // console.log(this.$refs.mescroll.scrollTop)
        // this.$refs.mescroll.scrollTop = this.hjp
        // console.log(this.$refs.mescroll.scrollTop)

        const arr = res.data
        if (pageNum === 0) {
          this.dataList = []
        }
        this.dataList = [...this.dataList, ...arr]
        this.mescroll.endSuccess(arr.length)
        this.loading = false
        // this.dataList = res.data.filter((item, index) => { return index < 8 })
        // this.dataList1 = res.data.filter((item, index) => { return index >= 8 && index < 16 })
        // this.dataList2 = res.data.filter((item, index) => { return index >= 16 && index < 24 })
        // this.dataList3 = res.data.filter((item, index) => { return index >= 24 })
        // if (specialType === 30) {
        //   this.dataList = res.data
        // } else if (specialType === 31) {
        //   this.dataList1 = res.data
        // } else if (specialType === 32) {
        //   this.dataList2 = res.data
        // } else {
        //   this.dataList3 = res.data
        // }
        this.$nextTick(() => {
          console.log(this.hjp)
          console.log(this.$refs.mescroll.scrollTop)
          this.$refs.mescroll.scrollTop = this.hjp
          console.log(this.$refs.mescroll.scrollTop)
        })
      }).catch(() => {
        this.mescroll.endErr()
        this.loading = false
      })
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    getHeight (data) {
      this.isFlag = data
      this.style.height = data + 'px'
      this.isAddHeight = data
      this.$refs.navItem.style.top = (this.isAddHeight + 40) + 'px'
      console.log(this.$refs.navItem.style.top)
    },
    // getHeight(height) {
    //   this.$refs.mescroll.style.top = `${(51 + height) / 37.5}rem`
    // },
    handelCancel () {
      this.isShow = false
    },
    scrollTo (val) {
      // this.navActive = val
      const height = this.$refs.topImg.offsetHeight + this.$refs.navItem.offsetHeight + this.$refs.listItem.offsetHeight * (val.id - 1) - this.$refs.title.offsetHeight
      this.mescroll.scrollTo(height - 20)
      console.log(height)
      // sessionStorage.getItem('hjp', height)
      if (this.mescroll.os.ios) {
        this.$refs.navItem.classList.add('nav-sticky')
        // if (this.isAddHeight > 20) {
        //   this.mescroll.scrollTo(height - 20)
        // } else {
        this.mescroll.scrollTo(height - 20)
        // }
      } else {
        this.fixed = 'fixed'
        this.mescroll.scrollTo(height - 40)
      }
      // sessionStorage.removeItem('__special_h__')
    },
    toTop () {
      this.mescroll.scrollTo(0)
    },
    shareFun () {
      if (WX) {
        const option = {
          type: 'url',
          title: '好茶上新，鸿运当头', // 分享标题
          desc: '品一品新茶，好运连连挡都挡不住!', // 分享描述
          link: `${URL}/opera/newtea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/45377b63-cc13-41b1-9998-1c9e0c0498c2.jpg'
        }
        this.getShareWxArg(option)
      }
    },
    share () {
      const option = {
        type: 'url',
        data: {
          title: '好茶上新，鸿运当头', // 分享标题
          desc: '品一品新茶，好运连连挡都挡不住!', // 分享描述
          link: `${URL}/opera/newtea`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/45377b63-cc13-41b1-9998-1c9e0c0498c2.jpg'
        }
      }
      if (IOS) {
        setTimeout(() => {
          window.callback(ios => {
            ios.callHandler('goShareType', JSON.stringify(option), res => {
            })
          })
        }, 20)
      } else if (ANDROID) {
        window.android.goShareType(JSON.stringify(option))
      }
    },
    ...mapActions(['getShareWxArg'])
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    goodList,
    backbar
  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
@mixin icon-change($url) {
  background-image: url('~assets/img/activity/teapot/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/activity/teapot/'+$url+'@2x.png');
  }
}
$color: #e3d6bc;
.semWraper {
  background: $color;
  padding-bottom: 25px;
  position: relative;
  .top-bg {
    background: #e3d6bc;
  }
  .white {
    /deep/ .van-icon-arrow-left {
      color: #6f2a02 !important;
      font-size: 22px !important;
    }
    /deep/ .van-icon-share {
      color: #6f2a02 !important;
      font-size: 22px;
    }
  }
  .top-fix {
    background: $color;
    .top-img {
      img {
        width: 100%;
        font-size: 0;
      }
    }
  }
  .mescroll-content {
    background: $color;
    position: fixed;
    bottom: 0;
    top: 0;
    width: 100%;
    left: 0;
    .nav-items {
      // display: flex;
      // justify-content: space-around;
      // align-items: center;
      padding: 7px 10px;
      background: $color;
      li {
        display: inline-block;
        font-size: 14px;
        color: rgba(162, 107, 70, 1);
        @include icon-change('icon1');
        background-size: cover;
        width: 80px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        &.active {
          color: rgba(227, 214, 189, 1);
          @include icon-change('icon2');
        }
      }
      .margin2 {
        margin-left: 11px;
      }
    }
    .nav-sticky {
      z-index: 9999;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
    }
    .fixed {
      position: fixed;
      top: 40px;
      z-index: 1000;
    }
    .data-content {
      padding-top: 10px;
      .products-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 288px;
        }
      }
      img {
        width: 345px;
        margin: 0 auto;
        display: block;
        margin-top: 23px;
      }
    }
    .toTop {
      width: 105px;
      height: 42px;
      margin: 0 auto;
      padding-top: 15px;
      padding-bottom: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
/deep/ .van-icon {
    font-weight: bold;
  }
  .loading {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 10px;
  }
  /deep/ .mescroll-upwarp{
    display:none !important;
  }
</style>
