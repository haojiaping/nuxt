<template>
  <section class="prolistWrap df"
           :style="`background:${bgcolor}`">
    <nuxt-link :to="`/${pro.productId}`"
               class="prolistItem df pr"
               :style="`width:${width}`"
               v-for="(pro, index) in dataList"
               :key="`pro_${index}`"
               :class="index%2===0?'van-hairline--right van-hairline--bottom':'van-hairline--bottom'">
      <img class="imgItem"
           :src="pro.productImage||pro.image"
           :alt="pro.productName||pro.title"
           @touchstart="touchstart(index, $event)"
           @click="setOption">
      <div class="desc-wrapper border-top"
           @touchstart="touchstart(index, $event)"
           @click="setOption">
        <div class="desc">
          <span class="text">{{pro.productName||pro.title}}</span>
        </div>
        <div class="sign-wrapper df">
          <span class="sign border"
                v-for="(tag,index) in splitTag(pro.productTitle)"
                :key="`tag_${index}`">{{tag}}</span>
        </div>
      </div>
      <div class="pri pa"
           @click="setOption">
        ¥ {{pro.productPrice}}
      </div>
    </nuxt-link>
  </section>
</template>

<script>
import { IOS, ANDROID } from '~/environment/esm'
export default {
  name: 'productList',
  data () {
    return {

    }
  },
  props: {
    bgcolor: {
      type: String,
      default: '#fff'
    },
    // 决定一行显示几个商品
    width: {
      type: String,
      default: '50%'
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
  },
  watch: {

  },
  methods: {
    touchstart (index, e) {
      const p = e.target.parentNode.clientHeight
      const height = Math.floor(index / 2) * p - 30
      sessionStorage.setItem('__special_h__', height)
      // localStorage.setItem('hjp', height)
      console.log(sessionStorage)
      // console.log(localStorage)
      console.log('存储成功')
      console.log(p)
      console.log(index)
      console.log(e)
    },
    testDemo (e) {
      const clientY = e.targetTouches[0].clientY
      const offsetY = e.targetTouches[0].offsetY
      const screenY = e.targetTouches[0].screenY
      const y = e.targetTouches[0].y
      const laylerY = e.targetTouches[0].laylerY
      const pageY = e.targetTouches[0].pageY
      const scrollY = window.scrollY
      const width = document.getElementsByClassName('listSub')[0].clientHeight
      console.log('==>' + clientY)
      console.log('==>' + offsetY)
      console.log('==>' + screenY)
      console.log('==>' + y)
      console.log('==>' + laylerY)
      console.log('==>' + pageY)
      console.log('==>' + scrollY)
      console.log('==>' + width)
    },
    setOption () {
      sessionStorage.setItem('__jump__', 'backmypage')
    },
    splitTag (tags) {
      if (tags) {
        return tags.split(',')
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

<style scoped lang='scss'>
.prolistWrap {
  flex-wrap: wrap;
  .prolistItem {
    flex-direction: column;
    padding: 13px 13px 30px;
    box-sizing: border-box;
    color: #333;
    // &:nth-child(2n) {
    //   &:before {
    //     border: 0;
    //   }
    // }
    .imgItem {
      width: 150px;
      height: 150px;
    }
  }
  .desc-wrapper {
    margin-top: 10px;
    &:before {
      border-color: #cccccc;
    }
    .desc {
      padding: 10px 0 7px;
      overflow: hidden;
      font-size: 15px;
      line-height: 15px;
      .text {
        display: inline-block;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .sign-wrapper {
      overflow: hidden;
      margin-bottom: 5px;
      flex-wrap: wrap;
      .sign {
        padding: 2px 6px;
        margin: 0 5px 5px 0;
        color: #d45949;
        font-size: 10px;
        &:before {
          border-color: #d45949;
        }
      }
    }
  }
  .pri {
    color: #d45949;
    font-weight: bold;
    bottom: 10px;
  }
}
</style>
