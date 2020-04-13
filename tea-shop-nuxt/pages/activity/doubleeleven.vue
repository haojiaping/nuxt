<template>
<client-only>
   <section class="doubleWrpa">
     <backbar bgColor="#fff" leftColor="#333" @setHeight="setHeight" :shartOption="shartOption" title="双11击穿底价"
     :rightIcon="gobackMyback?'share':''"
     />
     <div ref="mescroll"
         class='mescroll'>
     <div>
       <div ref="topWrap">
        <div class="imgwrap">
          <img :src="require('~/assets/img/activity/doubleeleven/top.png')" width="100%">
          <img :src="require('~/assets/img/activity/doubleeleven/toptitle.png')" width="100%">
        </div>
        <div class="topgoodWrap">
          <div class="goods df">
            <div class="good" v-for="(item, index) in dataList" :key="index" @click="jumpDetail(item.productId)">
              <div class="good-img pr van-hairline--bottom">
                <img :src="item.image" alt="" width="100%">
                <div class="good-tag pa f11 fw400 cf tac">{{item.productStyle}}</div>
              </div>
              <p class="c2 f12 good-name">{{item.productName}}</p>
              <p class="f17 good-price">
                <span  style="color:#CF0000;">¥{{item.productPrice}}</span>
                 <span class="f12 c9" style="text-decoration:line-through;">¥{{item.discountsPrice}}</span>
              </p>
              <p class="f11 c9">{{item.wantNumber}}人想买</p>
            </div>
          </div>
        </div>
        <div class="imggoodwrap">
          <img :src="require('~/assets/img/activity/doubleeleven/good.png')" width="100%" @click="jumpDetail('201910101703220275000017')">
        </div>
        <div class="selWraper" ref="selWraper">
          <div class="selectedWraper" ref="selectedWraper">
              <van-tabs v-model="active" :border="false" :line-width="0" line-height="0" @click="changeTab">
                <van-tab v-for="label in tabsData" :title="label.label" :key="label.key" ></van-tab>
              </van-tabs>
          </div>
        </div>

       </div>
       <div>
         <div class="acBlackWrap" v-for="label in tabsData" :key="label.key" :ref="`label${label.key}`">
           <div class="actitle df f18">
              <img :src="require('~/assets/img/activity/doubleeleven/actitle@2x.png')" width="100%">
              <p>{{label.label}}</p>
              <img :src="require('~/assets/img/activity/doubleeleven/actitle@2x.png')" width="100%">
           </div>
           <div class="acgoods df">
             <div class="acgood" v-for="(item,index) in label.dataList" :key="index" @click="jumpDetail(item.productId)">
               <div class="acgood-img pr van-hairline--bottom">
                 <img :src="item.image" width="100%">
                <div class="acgood-tag pa f11 fw400 cf tac">{{item.productStyle}}</div>
               </div>
               <p class="acgood-name">{{item.productName}}</p>
               <p class="acgood-text">
                 <span class="f16" style="color:#CF0000;">¥ {{item.productPrice}}</span>
                 <span class="f12 c9" style="text-decoration:line-through;">原价￥{{item.discountsPrice}}</span>
               </p>
               <div class="acgood-btn cf f15 tac">立即抢购</div>
             </div>
           </div>
         </div>
       </div>
     </div>
     </div>
   </section>
   </client-only>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
import backbar from '~/components/backbar'
import { URL } from '~/config/constant.js'
import { mapGetters, mapActions } from 'vuex'
import { getSpecial } from '~/api/special'
export default {
  data() {
    return {
      shartOption: {
        type: 'url',
        data: {
          title: '11.11狂欢节-击穿底价', // 分享标题
          desc: '无需等待，击穿底价。茶臻选，只为一杯好茶。', // 分享描述
          link: `${URL}/activity/doubleeleven`, // 分享链接
          imgUrl: 'https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/8/9a4d7657-9336-4378-9f66-2516fdadc17e.jpg'
        }
      },
      mescroll: null,
      active: 0,
      dataList: [],
      tabsData: [{
        key: 50,
        label: '为你推荐',
        dataList: []
      },
      // {
      //   key: 51,
      //   label: '品牌5折',
      //   dataList: []
      // },
      {
        key: 52,
        label: '普洱精选',
        dataList: []
      }, {
        key: 53,
        label: '暖胃红茶',
        dataList: []
      }, {
        key: 54,
        label: '清新绿茶',
        dataList: []
      },
      {
        key: 55,
        label: '清甜白茶',
        dataList: []
      }, {
        key: 56,
        label: '浓郁乌龙',
        dataList: []
      }
      ],
      sizeArr: [],
      height: 0
    }
  },
  mounted() {
    this.getShareWxArg(this.shartOption)
    setTimeout(() => {
      this.mescrollInit()
      this.dataInit()
      if (!(IOS || ANDROID)) {
        setTimeout(() => {
          window.location.href = `aisotea://com.aiso.tea?jumpType=webViewX5&jumpContent=${JSON.stringify({ url: `${URL}${this.$route.fullPath}` })}`
        }, 20)
      }
    }, 20)
  },
  watch: {

  },
  methods: {
    dataInit() {
      this.tabsData.map(tabs => {
        this.getSpecialdata(tabs.key)
      })
      this.getSpecialdata(49)
    },
    async getSpecialdata (specialType) {
      await this.$axios.$post(getSpecial, {
        specialType: specialType,
        lastId: 0,
        userId: ''
      }).then(res => {
        const index = this.tabsData.findIndex(item => { return item.key === specialType })
        if (index !== -1) {
          this.tabsData[index].dataList = res.data
        } else {
          this.dataList = res.data
        }
        this.$nextTick(() => {
          this.getSize()
        })
      })
    },
    getSize() {
      this.sizeArr = []
      const arr = []
      const arrtemp = []
      arr.push(this.$refs.topWrap.offsetHeight)
      this.tabsData.map(item => {
        const label = `label${item.key}`
        arr.push(this.$refs[label][0].offsetHeight)
      })
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          arrtemp.push(arr[i] - 50)
        } else {
          arrtemp.push(arrtemp[i - 1] + arr[i] - 50)
        }
      }
      this.sizeArr = arrtemp
    },
    changeTab() {
      this.mescroll.scrollTo(this.sizeArr[this.active] + 50)
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit () {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          isBounce: false
        }
      })
      const navWarp = this.$refs.selWraper
      // if (this.mescroll.os.ios) {
      //   // ios的悬停效果,通过给navWarp添加nav-sticky样式来实现
      //   navWarp.classList.add('nav-sticky')
      //   this.mescroll.optUp.onScroll = (mescroll, y, isUp) => {
      //     this.scrollToTag(y)
      //   }
      // } else {
      // android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
      navWarp.style.height = navWarp.offsetHeight + 'px'// 固定高度占位,避免悬浮时列表抖动
      const navContent = this.$refs.selectedWraper
      this.mescroll.optUp.onScroll = (mescroll, y, isUp) => {
        this.scrollToTag(y)
        if (y >= navWarp.offsetTop) {
          navContent.classList.add('nav-fixed')
          navContent.style.top = `${(this.height + 42) / 37.5}rem`
        } else {
          navContent.classList.remove('nav-fixed')
        }
      }
      // }
    },
    scrollToTag(y) {
      const arr = this.sizeArr
      for (let i = 0; i < arr.length; i++) {
        if (y > arr[i] && y <= arr[i + 1]) {
          this.active = i
          return
        }
      }
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    setHeight(height) {
      this.height = height
      this.$refs.mescroll.style.top = `${(height + 43) / 37.5}rem`
    },
    ...mapActions(['getShareWxArg'])
  },
  components: {
    backbar
  },

  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    ...mapGetters(['user']),
    gobackMyback () {
      return IOS || ANDROID
    }
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.doubleWrpa{
  .mescroll{
    background: #FFE5C1;
    position: fixed;
    top: 46px;
    left: 0;
    height: auto;
    bottom: 0;
    .nav-sticky {
      z-index: 9999;
      position: -webkit-sticky;
      position: sticky;
      top: 46px;
    }
    .nav-fixed {
      z-index: 9999;
      position: fixed;
      top: 46px;
      left: 0;
      width: 100%;
    }
    .imgwrap{
      font-size: 0;

    }
    .imggoodwrap{
      font-size: 0;
      margin: 0 5px 10px;
    }
    .topgoodWrap{
        width: 100%;
        // height: 385px;
        @include bg-image('activity/doubleeleven/topgoods');
        padding: 0 5px 10px;
        box-sizing: border-box;
        .goods{
          width: 100%;
          height: 100%;
          background:linear-gradient(90deg,rgba(241,215,192,1),rgba(246,233,224,1),rgba(241,215,192,1));
          border-radius:0 0 10px 10px;
          flex-wrap: wrap;
          .good{
            background: #fff;
            border-radius:5px;
            width: 31.2%;
            margin:0 1% 5px;
            padding: 8px;
            box-sizing: border-box;
            .good-img{
              width: 100px;
              height: 100px;
              padding-bottom: 10px;
              &.van-hairline--bottom:after{
                border-color: #F74539;
              }
              .good-tag{
                bottom: 0;
                left: 0;
                // width:75px;
                height:15px;
                line-height:15px;
                padding: 0 15px 0 10px;
                box-sizing: border-box;
                background:linear-gradient(90deg,rgba(207,0,0,1),rgba(247,69,57,1));
                border-radius:0px 13px 0px 0px;
              }
            }
            .good-name{
              @include text-over(2);
              margin: 5px 0;
            }
            .good-price{
              margin: 5px 0;
            }
          }
        }
      }
      .selWraper{
        .selectedWraper{
          width: 100%;
          height: 60px;
          @include bg-image('activity/doubleeleven/menu');
          /deep/ .van-tabs__nav{
            background: transparent;
          }
          /deep/ .van-tabs{
            height: 100%;
          }
          /deep/ .van-tabs__nav--line{
            padding:0;
            align-items: center;
          }
          /deep/ .van-tabs__wrap{
            height: 100%;
          }
          /deep/ .van-tab{
            font-size: 15px;
            color: #8B481C;
            line-height: 20px;
            padding: 5px;
            &.van-tab--active{
              background:rgba(139,72,28,1);
              border-radius:17px;
              font-weight: 500;
              color: #fff;
            }
          }
        }
      }
      .acBlackWrap{
        background:rgba(255,229,193,1);
        .actitle{
          color: #BE671E;
          justify-content: center;
          margin: 25px auto;
          p{
            margin: 0 10px;
            line-height: 1;
          }
          img{
            width: 46px;
            height: 14px;
            align-self: flex-end;
            margin-bottom: 2px;
          }
        }
        .acgoods{
          margin: 10px;
          flex-wrap: wrap;
          .acgood{
            background: #fff;
            width: 48.5%;
            margin: 1px;
            padding: 0 10px 15px;
            box-sizing: border-box;
            .acgood-img{
              width:138px;
              height:138px;
              padding: 10px 10px 20px 10px;
              &.van-hairline--bottom:after{
                border-color: #F74539;
              }
              .acgood-tag{
                bottom: 0;
                left: 0;
                // width:75px;
                height:15px;
                line-height:15px;
                padding: 0 15px 0 10px;
                box-sizing: border-box;
                background:linear-gradient(90deg,rgba(207,0,0,1),rgba(247,69,57,1));
                border-radius:0px 13px 0px 0px;
              }
            }
            .acgood-name{
              @include text-over(2);
              margin: 5px 0;
            }
            .acgood-text{
              margin: 8px 0;
            }
            .acgood-btn{
              width:100%;
              height:31px;
              line-height:31px;
              background:rgba(207,0,0,1);
              border-radius:5px;
            }
          }
        }
      }
  }
}
</style>
