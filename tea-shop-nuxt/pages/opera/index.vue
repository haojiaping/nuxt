<template>
   <div class="tongde">
    <!-- <BackAndHome :type="backBar" :title="backTitle" @setHeight="setHeight"/> -->
    <backbar :bgColor="backBar" :fixed='false'
    leftColor="#fff"
    @setHeight="setHeight"/>
    <div ref="mescroll" class="mescroll" >
      <div>
        <div class="header">
          <div class="headimg"></div>
          <div class="title">
            <div class="titlenav df">
              <div class="nav one" :class="active===0?'active':''" @click="change(0)"></div>
              <div class="nav two" :class="active===1?'active':''" @click="change(1)"></div>
              <div class="nav three" :class="active===2?'active':''" @click="change(2)"></div>
            </div>
            <p class="f15 fwb" style="color:#7F2215;text-align: center;" v-if="active===0">赠送品鉴小样，不满意整饼(罐)包退</p>
            <p class="f15 fwb" style="color:#7F2215;text-align: center;" v-if="active===1">可选择小规格（10g，20g）购买</p>
            <p class="f15 fwb" style="color:#7F2215;text-align: center;" v-if="active===2">平台所有商品享受包邮服务</p>
          </div>
          <div class="centertitle"></div>
          <div class="centersub df">
            <div class="blockItem df border-bottom"
            v-for="(item,index) in dataList" :key="index"
            @click="jumpToDetail(item)"
            v-if="index<6">
              <img :src="item.productImage" alt="">
              <p class="border-top itemtitle f12 fw400">{{item.productName}}</p>
              <p class="itemprice"><span class="f12 fw400" v-if="item.discountsPrice">新人价: </span>
                <span class="f10 fw400">¥</span>
                <span>{{item.discountsPrice||item.productPrice}}</span>
              </p>
            </div>
          </div>
          <div class="centerfoot"></div>
        </div>

        <div class="bottom df" v-if="dataList">
          <div class="bottomItem"
          v-for="(item,index) in dataList"
          :key="index" :class="(index%2===0)?'border-rightbottom':'border-bottom'"
          @click="jumpToDetail(item)"
          v-if="index>=6">
            <img :src="item.productImage" alt="">
            <p class="f15 fw400 border-top bottomtitle">{{item.productName}}</p>
            <div class="tagWraper">
              <!-- <van-tag color="#62B34D" plain>新品</van-tag>
              <van-tag color="#D45949" plain>满减</van-tag>
              <van-tag color="#D1B081" plain>无忧品鉴</van-tag> -->
            </div>
            <p class="itemprice"><span class="f15 fw600" v-if="item.discountsPrice">新人价: </span>
              <span class="f12 fw600">¥</span>
              <span class="f15 fw600">{{item.discountsPrice||item.productPrice}}</span>
            </p>
          </div>
        </div>
        <!-- <div id="upscrollWarp">
          <ul id="dataList" class="data-list">
            <GoodLine v-for="(item,index) in dataList" :key="index" :datas="item"></GoodLine>
          </ul>
        </div> -->
      </div>
    </div>
   </div>
</template>

<script>
import backbar from '~/components/backbar'
// import GoodLine from '~/components/activity/zhenxuan/GoodLine'
import { operate } from '~/api/special'
import { ANDROID, IOS } from '~/environment/esm'
export default {
  data() {
    return {
      backBar: 'transparent',
      backTitle: '',

      active: 0,
      navitems: [
        // {
        //   value: 3,
        //   name: '臻选'
        // },
        {
          value: 7,
          name: '无忧品鉴'
        },
        {
          value: 8,
          name: '随心买'
        },
        {
          value: 9,
          name: '同德茶'
        }
      ],
      navActive: {
        value: 7,
        name: '无忧品鉴'
      },
      mescroll: null,
      dataList: [],
      operationId: '2019080118143588012000114'
    }
  },
  mounted () {
    this.backBar = 'transparent'
    this.backTitle = ''
    this.mescrollInit()
    // this.$refs.selectedWraper.classList.remove('nav-fixed')
  },
  watch: {

  },
  methods: {
    change(e) {
      this.active = e
    },
    setHeight(height) {
      this.$refs.selWraper.style.top = `${height + 40}px`
    },
    jumpToDetail(item) {
      this.$router.push({ path: `/${item.productId}`, query: { specialId: item.specialId, gobackMyback: this.gobackMyback } })
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit() {
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
            size: 20 // 每页数据条数,默认10
          }
        }
      })
    },
    getdisList(page, mescroll) {
      // mescroll.endSuccess(0)
      if (!this.operationId) {
        this.$toast('ID不能为空')
        mescroll.endErr()
        return
      }
      const option = {
        // specialType: 11,
        // lastId: page.num === 1 ? 0 : this.dataList[this.dataList.length - 1].pkSid
        pageNum: page.num - 1,
        operationId: this.operationId
      }
      this.$axios.$post(operate, option).then(res => {
        if (page.num === 1) this.dataList = []
        const arr = res.data
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
          // this.dataList = []
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
            // mescroll.endSuccess(0)
          })
        } else {
          this.$toast(res.message)
          mescroll.endErr()
        }
      })
    },
    handChange(val) {
      this.navActive = val
      if (this.backBar === 'transparent') {
        this.backTitle = ''
      } else {
        this.backTitle = val.name
      }
      /* 调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值) */
      const navWarp = this.$refs.selWraper
      const minHight = this.mescroll.getClientHeight() - navWarp.offsetHeight
      document.getElementById('upscrollWarp').style.minHeight = minHight + 'px'
      this.mescroll.resetUpScroll()
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  computed: {
    gobackMyback() {
      return IOS || ANDROID
      // return true
    }
  },
  components: {
    // GoodLine,
    backbar
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.tongde {
  .mescroll {
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
    /deep/ .mescroll-empty {
      top: 57%;
    }
    /deep/ .mescroll-upwarp {
      background: #ffcd93;
    }
  }
}
.header {
  background: #B43929;
  .headimg {
    width: 100%;
    height: 290px;
    @include bg-image('activity/zhenxuan/banner');
    background-size: cover;
  }
  .title {
    width: 350px;
    height: 120px;
    @include bg-image('activity/zhenxuan/titel');
    background-size: cover;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
    .titlenav {
      width: 100%;
      height: 50px;
      .nav {
        width: 96px;
        height: 34px;
        background-size: cover;
        &.one {
          @include bg-image('activity/zhenxuan/wuyou');
          &.active {
            @include bg-image('activity/zhenxuan/one');
          }
        }
        &.two {
          @include bg-image('activity/zhenxuan/mai');
          &.active {
            @include bg-image('activity/zhenxuan/two');
          }
        }
        &.three {
          @include bg-image('activity/zhenxuan/you');
          &.active {
            @include bg-image('activity/zhenxuan/three');
          }
        }
      }
    }
  }
  .centertitle {
    width: 212px;
    height: 43px;
    @include bg-image('activity/zhenxuan/title');
    background-size: cover;
    margin: 0 auto;
  }
  .centersub {
    width: 350px;
    height: 367px;
    @include bg-image('activity/zhenxuan/center');
    background-size: cover;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px 17px 67px;
    box-sizing: border-box;
    .blockItem {
      width: 33.33%;
      height: 150px;
      flex-direction: column;
      align-items: center;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      img {
        width: 85px;
        height: 85px;
      }
      .itemtitle {
        padding: 10px 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .itemprice {
        align-self: flex-start;
        color: #D45949;
      }
    }
  }
  .centerfoot {
    width: 375px;
    height: 80px;
    @include bg-image('activity/zhenxuan/footer');
    background-size: cover;
    margin: 0 auto;
  }
}
.bottom {
  padding: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  background: #FFCD93;
  .bottomItem {
    width: 50%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 14px;
    box-sizing: border-box;
    img {
      width: 150px;
      height: 150px;
    }
    .bottomtitle {
      padding-top: 10px;
      height: 33px;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tagWraper {
      margin: 10px 0;
    }
    .itemprice {
      color: #D45949;
    }
  }
}
.navWraper {
  box-sizing: border-box;
  padding-top: 10px;
  height: 44px;
  background: #fff;
  margin-top: -10px;
  border-radius: 10px 10px 0 0;
  .nav {
    display: flex;
    background: #fff;
    padding: 5px 0 10px;
    .nav-item {
      position: relative;
      width: 25%;
      text-align: center;
      margin: 0 7px;
      padding: 5px 10px;
      font-size: 15px;
      font-weight: 400;
      &.active {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
}
</style>
