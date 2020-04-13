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
             :title='title' />
    <div ref="mescroll"
         class="mescroll subWrap pf">
      <div class='listWrap'>
        <div class='top-fix'
             ref='topImg'>
          <div class='top-img'>
            <img :src="require('~/assets/img/activity/teapot/topImg.png')"
                 alt="">
          </div>
        </div>
        <div class='data-content'
             ref='listItem'>
          <div class='products-title'
               ref='title'>
            <img :src="require('~/assets/img/activity/teapot/title5.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <img :src="require('~/assets/img/activity/teapot/title6.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList1'></goodList>
        </div>
        <div class='data-content'>
          <div class='products-title'>
            <img :src="require('~/assets/img/activity/teapot/title7.png')"
                 alt="">
          </div>
          <goodList :dataList='dataList2'></goodList>
        </div>
        <div class='toTop'
             @click="showMoreData">
          <img :src="require('~/assets/img/activity/teapot/bottomTo.png')"
               alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpecial } from '~/api/special'
import backbar from '~/components/backbar'
import { IOS, WX, ANDROID } from '~/environment/esm'
import { URL } from '~/config/constant'
import goodList from '~/components/activity/teapot/goodListOthers'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      dataList: [],
      dataList1: [],
      dataList2: [],
      userId: '',
      isFlag: '',
      style: {
        height: '0px'
      },
      shartOption: {
        type: 'url',
        data: {
          title: '新客福利： 首单1元包邮，数量有限！', // 分享标题
          desc: '茶臻选这个商城不错，现在下载超多福利！你也来看看吧。', // 分享描述
          link: `${URL}/opera/vouchers`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/a92e6704-af57-43ad-bdd4-4635f88fa0a4.jpg'
        }
      },
      title: '',
      bgColor: 'transparent',
      leftColor: '#fff',
      rightIconColor: '#fff'
    }
  },
  mounted () {
    this.getSpecialdata(34)
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    async getSpecialdata (specialType) {
      await this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        // console.log(Promise.resolved)
        const len = [2, 4, 6]
        const arr = res.data
        console.log('tag', '')
        arr.map((item, index) => {
          if (index < len[0]) {
            this.dataList.push(item)
          } else if (index < len[1] && index >= len[0]) {
            this.dataList1.push(item)
          } else if (index < len[2] && index >= len[1]) {
            this.dataList2.push(item)
          }
        })
      })
    },
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          isBounce: false,
          auto: false,
          lazyLoad: {
            use: true
          }
        }
      })
      this.mescroll.optUp.onScroll = this.meScorllScroll
    },
    meScorllScroll (mescroll, y, isUp) {
      if (y >= 50) {
        this.bgColor = '#fff'
        this.leftColor = '#333'
        this.title = '紫砂壶'
        this.rightIconColor = '#333'
      } else {
        this.bgColor = 'transparent'
        this.title = ''
        this.leftColor = '#fff'
        this.rightIconColor = '#fff'
      }
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    getHeight (data) {
      this.isFlag = data
      this.style.height = data + 'px'
    },
    handelCancel () {
      this.isShow = false
    },
    shareFun () {
      if (WX) {
        const option = {
          type: 'url',
          title: '懂茶名家，必备紫砂', // 分享标题
          desc: '你手里少一把紫砂壶！喝茶品茶弄茶，没有紫砂，成何体统', // 分享描述
          link: `${URL}/opera/teapot`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/06b69db3-9fda-4f7f-b29c-c288ffad12a1.jpg'
        }
        this.getShareWxArg(option)
      }
    },
    share () {
      const option = {
        type: 'url',
        data: {
          title: '懂茶名家，必备紫砂', // 分享标题
          desc: '你手里少一把紫砂壶！喝茶品茶弄茶，没有紫砂，成何体统', // 分享描述
          link: `${URL}/opera/teapot`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/06b69db3-9fda-4f7f-b29c-c288ffad12a1.jpg'
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
    showMoreData () {
      if (IOS) {
        window.callback(ios => {
          ios.callHandler(
            'jumpOtherPage',
            { jumpType: 'productList', jumpContent: '{"categoryId":"201907171651462229000190"}' },
            () => { }
          )
        })
      } else if (ANDROID) {
        window.android.jumpOtherPage('productList', '{"categoryId":"201907171651462229000190","title":"岩茶"}')
      } else {
        this.$router.push('/type/201907171651462229000190')
      }
      // this.$router.push({
      //   query: { type: 34, name: '紫砂壶', gobackMyback: this.gobackMyback },
      //   path: '/type/201907171651462229000190'
      // })
    },
    ...mapActions(['getShareWxArg'])
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
$color: #010101;
.semWraper {
  .subWrap {
    height: auto;
    top: 0;
    left: 0;
    bottom: 0;
    .listWrap {
      background: $color;
      padding-bottom: 25px;
      position: relative;
      .top-bg {
        background: #e3d6bc;
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
      .data-content {
        padding-top: 10px;
        .products-title {
          img {
            width: 100%;
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
        width: 345px;
        height: 65px;
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
}
</style>
