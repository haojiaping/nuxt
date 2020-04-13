/* eslint-disable camelcase */
<template>
  <div class="bottom"
       :class='color'
       v-if="dataList">
    <div class="bottomItem"
         v-for="(item,index) in dataList"
         :key="index"
         v-if='index<num'
          @touchstart="touchstart(index, $event)"
         @click="jumpDetail(item.productId)">
      <img :src="item.image"
           alt="">
      <div class='right'>
        <p class="bottomtitle">{{item.title}}</p>
        <p class='line'></p>
        <p class="dec">{{item.productDescription}}</p>
        <div class='product-bottom'>
          <p class="itemprice">
            <i class='left'>尝鲜价:</i>
            <span class="f24">¥</span>
            <span class="fw600 font44">{{item.productPrice}}</span>
          </p>
          <p class='toLook'>
            <span>去看看</span>
            <van-icon name="arrow"
                      class='arrow' />
          </p>
        </div>
      </div>
    </div>
    <!-- <div class='show-more'
         @click='showMoreData'>
      <p>点击查看更多</p>
      <van-icon name="arrow"
                class='arrow' />
      <van-icon name="arrow"
                class='arrow' />
      <van-icon name="arrow"
                class='arrow' />
    </div> -->
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
// eslint-disable-next-line no-unused-vars
import BScroll from 'better-scroll'
export default {
  name: 'list',
  data () {
    return {
      flag: false,
      productList: []
    }
  },
  props: {
    num: {
      type: Number,
      default: 4
    },
    dataList: {
      type: Array
    },
    color: {
      type: String
    },
    specialType: {
      type: Number
    },
    title: {
      type: String
    }
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    touchstart (index, e) {
      // eslint-disable-next-line no-unused-vars
      // const p = e.target.parentNode.clientHeight
      // eslint-disable-next-line no-unused-vars
      // const a = e.touches[0].clientY
      // const p = e.target.parentNode.scrollHeight
      // eslint-disable-next-line no-unused-vars
      const a = window.screen.height
      const p = e.target.parentNode.offsetTop
      // console.log(e.target.scrollHeight)
      console.log(p)
      // console.log(a)
      // console.log(window.screen.height)
      // const height = Math.ceil(index * p + e.touches[0].clientY + index * 12 + 24)
      // eslint-disable-next-line no-unused-vars
      console.log(e.target.parentNode.clientHeight)
      // eslint-disable-next-line no-unused-vars
      const b = e.target.parentNode.offsetHeight
      const hjp = e.touches[0].pageY
      // eslint-disable-next-line no-unused-vars
      const c = a - hjp
      const height = p
      console.log(hjp)
      // eslint-disable-next-line no-unused-vars
      // const height = e.touches[0].clientY
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line no-unused-vars
      // const curH = window.innerHeight
      // // eslint-disable-next-line no-unused-vars
      // const docH = Math.max(document.documentElement.clientHeight, document.body.clientHeight)
      // eslint-disable-next-line no-unused-vars
      // console.log(document.documentElement.scrollTop)
      sessionStorage.setItem('__special_h__', height)
      sessionStorage.setItem('hjp', height)
      console.log(sessionStorage)
      console.log('存储成功')
      // console.log(p)
      // console.log(a)
      console.log(e)
    },
    jumpDetail (productId) {
      this.$router.push({ path: `/${productId}`, query: { gobackMyback: this.gobackMyback } })
    },
    showMoreData () {
      this.$router.push({
        query: { type: this.specialType, name: this.title, gobackMyback: this.gobackMyback },
        path: '/opera/special'
      })
    }
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    },
    isShow () {
      const self_ = this
      if (this.dataList.length > this.num) {
        self_.flag = true
      }
      return this.flag
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
$man: #dff7ff;
$woman: #fee5ed;
@mixin icon-change($url) {
  background-image: url('~assets/img/activity/teapot/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/activity/teapot/'+$url+'@2x.png');
  }
}
.bottom {
  margin: 10px;
  position: relative;
  margin-top: 0;
  padding: 4px;
  .bottomItem {
    width: 100%;
    background: #f0e6d2;
    display: flex;
    padding: 14px;
    box-sizing: border-box;
    margin-top: 10px;
    border: 1px solid #c9a47a;
    img {
      flex: 0 0 100px;
      width: 100px;
      height: 100px;
    }
    .right {
      margin-left: 10px;
      .bottomtitle {
        margin-bottom: 10px;
        width: 209px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(110, 42, 10, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .line {
        height: 1px;
        @include icon-change('border');
        background-repeat: repeat;
        margin-top: 5px;
      }
      .dec {
        font-size: 12px;
        font-weight: 400;
        color: rgba(162, 107, 70, 1);
        line-height: 18px;
        margin-top: 5px;
      }
      .product-bottom {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .itemprice {
          .left {
            width: 43px;
            height: 13px;
            font-size: 13px;
            color: rgba(162, 107, 70, 1);
            line-height: 18px;
          }
          height: 20px;
          line-height: 20px;
          .font44 {
            font-size: 22px;
          }
          span {
            color: rgba(192, 56, 50, 1);
          }
        }
        .toLook {
          width: 80px;
          height: 22px;
          background: rgba(192, 56, 50, 1);
          border-radius: 22px;
          text-align: center;
          color: rgba(229, 218, 206, 1);
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 4px;
          /deep/.van-icon {
            margin-left: 2px;
          }
        }
      }
    }
  }
  .border-none {
    &.border-rightbottom:after {
      border: none;
    }
    &.border-bottom:before {
      border: none;
    }
  }
}
.show-more {
  background: #e3d6bc;
  display: flex;
  width: 189px;
  height: 37px;
  border: 1px solid rgba(140, 83, 48, 1);
  border-radius: 37px;
  justify-content: center;
  align-items: center;
  margin: auto;
  top: 15px;
  position: relative;
  p {
    color: rgba(45, 127, 185, 1);
    font-size: 14px;
    color: rgba(140, 83, 48, 1);
  }
  .arrow {
    width: 6px;
    font-size: 16px;
    color: rgba(140, 83, 48, 1);
  }
}
</style>
