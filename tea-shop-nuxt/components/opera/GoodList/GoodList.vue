<template>
  <div class="good van-hairline--bottom"
       @click="jumpToDetail($event)">
    <!-- <img :src="datas.productImage" alt=""> -->
    <div class='good-img'>
      <span :class="showRank">
        {{ranking+1}}
      </span>
      <img :src="datas.image"
           class='good-content'
           alt='' />
    </div>
    <div class="goodInfo">
      <p class="name">{{datas.title}}</p>
      <div class='center'>
        <p class="dec">月销量{{datas.interest}}件</p>
        <div class="price">
          <span>¥</span>
          <span>{{datas.productPrice}}</span>
        </div>
      </div>
      <p class='grab'>马上抢</p>
    </div>
    <div class='evaluation'
         v-if="datas.productComment">
      <img :src="datas.productComment.avatarPath"
           alt=""
           v-if="datas.productComment.avatarPath&&datas.productComment.avatarPath!='-'" />
      <img :src="require('~/assets/img/self/self@2x.png')"
           alt=""
           v-else />
      <span>{{datas.productComment.content}}</span>
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  data () {
    return {
      showRank: ''
    }
  },
  props: {
    datas: {},
    ranking: {
      type: Number
    }
  },
  created () {
    const rank = this.ranking
    switch (rank) {
      case 0:
        this.showRank = 'first'
        break
      case 1:
        this.showRank = 'second'
        break
      case 2:
        this.showRank = 'third'
        break
      default:
    }
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    jumpToDetail (e) {
      this.$router.push({ path: `/${this.datas.productId}`, query: { gobackMyback: this.gobackMyback } })
      // eslint-disable-next-line eqeqeq
      if (e.target.tagName == 'P' && e.target.className !== 'dec') {
        // eslint-disable-next-line no-unused-vars
        const p = e.target.parentNode.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        // console.log('ppp')
        console.log(p)
        console.log(e.target.parentNode.parentNode)
      // eslint-disable-next-line eqeqeq
      } else if (e.target.tagName == 'DIV' && e.target.className !== 'center') {
        const p = e.target.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        console.log(p)
        console.log(e.target.parentNode)
        // console.log('div')
      // eslint-disable-next-line eqeqeq
      } else if (e.target.tagName == 'IMG') {
        const p = e.target.parentNode.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        console.log(p)
        console.log(e.target.parentNode)
      // eslint-disable-next-line eqeqeq
      } else if (e.target.className == 'center') {
        console.log('divaaa')
        const p = e.target.parentNode.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        console.log(p)
        console.log(e.target.parentNode)
      // eslint-disable-next-line eqeqeq
      } else if (e.target.className == 'dec') {
        const p = e.target.parentNode.parentNode.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        console.log(p)
        console.log(e.target.parentNode)
      // eslint-disable-next-line eqeqeq
      } else if (e.target.tagName == 'SPAN') {
        const p = e.target.parentNode.parentNode.parentNode.parentNode.offsetTop - e.clientY + 100
        sessionStorage.setItem('__special_h__', p)
        console.log(p)
        console.log(e.target.parentNode)
      // eslint-disable-next-line eqeqeq
      }
    }
  },
  components: {

  },
  computed: {
    gobackMyback () {
      return IOS || ANDROID
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin bg-image($url) {
  background-image: url('~assets/img/'+$url+'.png');
  @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
    background-image: url('~assets/img/'+$url+'@2x.png');
  }
}
.good {
  padding: 25px 20px;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  position: relative;
  .good-img {
    width: 100px;
    height: 100px;
    font-size: 0;
    span {
      font-size: 13px;
      position: absolute;
      left: 0;
      top: 0;
      height: 20px;
      width: 23px;
      font-weight: bold;
      background-size: cover;
      text-align: center;
      line-height: 20px;
      @include bg-image('opera/bangdan/other');
      color: rgba(204, 204, 204, 1);
    }
    .first {
      @include bg-image('opera/bangdan/first');
      color: #fff;
    }
    .second {
      @include bg-image('opera/bangdan/second');
      color: #fff;
    }
    .third {
      @include bg-image('opera/bangdan/third');
      color: #fff;
    }
    .good-content {
      height: 100px;
      background: #ccc;
    }
  }
  .goodInfo {
    position: relative;
    width: calc(100% - 100px);
    height: 100px;
    .name {
      font-size: 15px;
      line-height: 17px;
      font-weight: 400;
    }
    .center {
      position: absolute;
      bottom: 0;
      left: 0;
      .dec {
        display: inline-block;
        font-weight: 400;
        margin-top: 25px;
        padding: 0 7px;
        height: 16px;
        line-height: 16px;
        font-size: 10px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        background: rgba(241, 157, 146, 1);
        border-radius: 14px;
      }
      .price {
        color: #d45949;
        font-size: 15px;
        margin-top: 12px;
      }
    }
    .grab {
      position: absolute;
      right: 0;
      bottom: -5px;
      @include bg-image('opera/bangdan/grap');
      background-size: cover;
      width: 80px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }
  .evaluation {
    width: 335px;
    height: 30px;
    background: rgba(248, 248, 248, 1);
    border-radius: 30px;
    margin-top: 10px;
    & > * {
      float: left;
    }
    img {
      height: 22px;
      width: 22px;
      border-radius: 50%;
      margin: 4px;
    }
    span {
      font-size: 12px;
      width: 80%;
      color: rgba(153, 153, 153, 1);
      display: inline-block;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i {
      float: right;
      font-size: 11px;
      color: rgba(153, 153, 153, 1);
      height: 22px;
      line-height: 22px;
      margin: 4px 8px;
    }
  }
}
</style>
