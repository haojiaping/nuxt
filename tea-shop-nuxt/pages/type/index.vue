<template>
   <div class="typeWrap">
     <div class="typehead pf">
      <div class="search df" @click="jumpToSearch">
          <van-icon name="search" size="0.5rem" color="#999"/>
          <span class="f15">老茶头</span>
        </div>
     </div>

     <div class="subWrap pf df">
        <div class="typeleft df mescroll-touch">
          <div class="leftText tac " @click="handelCilckTag(index)"
          :class="tagActive === index?'active':''"
          v-for="(item, index) in datas.data" :key="`left_${index}`">
            <span>{{item.categoryName}}</span>
          </div>
        </div>

        <div class="mescroll typeright" ref="mescroll">

          <div ref="subWrap">

            <div class="rightimg" @click="$router.push(jumpUrl(datas.jumpType,datas.jumpContent))">
              <img :src="datas.image" alt="" width="100%" height="100%">
            </div>
            <div class="rightSub" v-for="(item, index) in datas.data" :key="`right_${index}`" :ref="`sub${index}`">
              <p class="title f15 fw500 c3 " :class="index===0?'':'van-hairline--top'" :ref="`title${index}`">{{item.categoryName}}</p>
              <div class="rightSubWrap df">

                <nuxt-link :to="pro.jumpType==='brandType'?`/pinpai/${getIdBrand(pro.nodeCategoryId)}`:`/type/${getId(pro.nodeCategoryId)}`" class="subItem df" v-for="(pro, index) in item.categoryList" :key="`pro_${index}`">
                  <img :src="pro.categoryLogo" :alt="pro.categoryName">
                  <p class="f14">{{pro.categoryName}}</p>
                </nuxt-link>
              </div>

            </div>

          </div>

        </div>
     </div>

   </div>
</template>

<script>
// 分类页面
import { type } from '~/meta'
import { list } from '~/api/type'
import { jumpUrl } from '~/utils/jump'
import { category } from '~/assets/js/category'
import { brand } from '~/assets/js/brand'
export default {
  name: 'type',
  data() {
    return {
      typeScrollHeight: [],
      tagActive: 0
    }
  },
  head () {
    return type
  },
  async asyncData ({ $axios }) {
    const typeData = await $axios.$post(list)
    return { datas: typeData }
  },
  mounted() {
    this.mescrollInit()
    this.getlist()
  },
  watch: {

  },
  methods: {
    jumpUrl,
    getlist() {
      this.$axios.$post(list).then(res => {
        this.datas = res
        this.$nextTick(() => {
          this.getDomHeight()
        })
      })
    },
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          use: false
        },
        up: {
          auto: false,
          isBounce: false,
          htmlNodata: '<p class="upwarp-nodata">茶有底，道无尽。</p>',
          onScroll: this.meOnScroll
        }
      })
    },
    handelCilckTag(index) {
      this.mescroll.scrollTo(this.typeScrollHeight[index - 1] + 50)
    },
    meOnScroll(mescroll, y, isUp) {
      const interval = this.typeScrollHeight
      // 滑动距离监听 变化左侧tag状态
      if (y <= interval[0]) {
        this.tagActive = 0
      } else {
        for (let i = 0; i < interval.length; i++) {
          if (y > interval[i] && y <= interval[i + 1]) {
            this.tagActive = i + 1

            // -------------  还需要进行  吸顶操作  ------

            // let title = `title${i+1}`
            // console.log(this.$refs[title]);
            // this.$refs[title][0].style.color = 'red'
            return
          }
        }
      }
    },
    getDomHeight() {
      // 计算滑动区间
      const arr = []
      const arrtemp = []
      this.typeScrollHeight = []
      for (let index = 0; index < this.datas.data.length; index++) {
        const temp = `sub${index}`
        arr.push(this.$refs[temp][0].offsetHeight)
      }
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          arrtemp.push(arr[i])
        } else {
          arrtemp.push(arrtemp[i - 1] + arr[i])
        }
      }
      this.typeScrollHeight = arrtemp
    },
    jumpToSearch() {
      this.$router.push('/search')
    },
    getId(id) {
      // let path = ''
      // category.map(item => {
      //   if (item.id === id) {
      //     path = item.path
      //   }
      // })
      // return path
      return id
    },
    getIdBrand(id) {
      // let path = ''
      // brand.map(item => {
      //   if (item.id === id) {
      //     path = item.path
      //   }
      // })
      // return path
      return id
    }
  },

  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {

  }
}
</script>

<style scoped lang='scss'>
.typeWrap{
  .typehead{
    top: 0;
    left: 0;
    right: 0;
    background:#fff;
    .search{
      margin: 10px 10px;
      height:30px;
      background:rgba(242,242,242,1);
      border-radius:15px;
      align-items: center;
      padding-left: 15px;
      span{
        color: #bbb;
        margin-left: 10px;
      }
    }
  }

  .subWrap{
    top: 50px;
    left: 0;
    right: 0;
    bottom: 55px;
    .typeleft{
      flex:0 0 90px;
      flex-direction: column;
      height: 100%;
      overflow-x: scroll;
      .leftText{
        width:90px;
        height:60px;
        line-height:60px;
        color: #333;
        font-size: 15px;
        font-weight: 400;
        &.active{
          background: #fff;
          position: relative;
          color: #D45949;
          font-size: 18px;
          font-weight: 500;
        }
        &.active:before{
          width: 100%;
          height: 2px;
          background: #D45949;
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }

    }

    .typeright{
      flex: 1;
      background: #fff;
      height: 100%;
      .rightimg{
        width:255px;
        height:90px;
        margin: 15px;
      }
      .rightSub{
        .title{
          margin: 10px 15px;
          padding-top: 15px;
          box-sizing: border-box;
        }
        .rightSubWrap{
          flex-wrap: wrap;
          // margin: 0 15px;
          .subItem{
            width: 33.33%;
            flex-direction: column;
            align-items: center;
            margin-bottom: 15px;
            color: #333;
            img{
              width: 45px;
              height: 45px;
              margin: 5px 0;
            }
          }
        }
      }
    }

  }

}
</style>
