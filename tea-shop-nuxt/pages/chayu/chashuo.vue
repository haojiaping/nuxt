<template>
  <!-- 直播组件 -->
  <div id="LiveWraper">
    <div class="liveTag">
      <div v-swiper:mySwiper="swiperOption" class="tag-wrapper" ref="mySwiper" v-if="labels.length>1">
        <div class="swiper-wrapper">
          <div v-for="(item , index) in labels" :key="`tag_${index}`" class="swiper-slide">
            <nuxt-link :to="item.path" class="swiper-item van-hairline--surround"
              :class="{'active':activetab.id===item.id}">
                {{item.text}}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { chashuoroute } from '~/assets/js/chashuo'
export default {
  data () {
    var that = this
    return {
      activetab: {},
      swiperOption: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 13,
        on: {
          init() {
            // swiper 初始化时获取所需数据
            that.swiperWidth = this.$el[0].clientWidth
            that.maxTranslate = this.maxTranslate()
            that.maxWidth = -that.maxTranslate + that.swiperWidth / 2
          },
          tap() {
            // 点击时  处理
            if (that.activetab.id === that.labels[this.clickedIndex].id) {
              return
            }
            that.activetab = that.labels[this.clickedIndex]
            // that.mescroll.resetUpScroll()
            // that.mescroll.scrollTo(0, 0)
            var slide, slideLeft, slideWidth, slideCenter, nowTlanslate
            slide = this.slides[this.clickedIndex]
            slideLeft = slide.offsetLeft
            slideWidth = slide.clientWidth
            slideCenter = slideLeft + slideWidth / 2

            this.setTransition(300)
            if (slideCenter < that.swiperWidth / 2) {
              this.setTranslate(0)
            } else if (slideCenter > that.maxWidth) {
              this.setTranslate(that.maxTranslate)
            } else {
              nowTlanslate = slideCenter - that.swiperWidth / 2
              this.setTranslate(-nowTlanslate)
            }
          }
        }
      },
      swiperWidth: '',
      maxTranslate: '',
      maxWidth: '',
      labels: [...chashuoroute] // 文章顶部标签列表
    }
  },
  mounted () {
    // 根据路由设置当前active
    this.labels.map(label => {
      if (label.path === this.$route.path) {
        this.activetab = Object.assign({}, label)
      }
    })
  },
  methods: {
  },
  components: {
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
#LiveWraper {
  /deep/ .mescroll-totop {
    width: 1rem;
    height: 1rem;
    bottom: 1.05rem;
    right: 10px;
  }
}
.live-wrap {
  font-weight: normal;
}
.liveTag {
  position: fixed;
  top: 92px;
  left: 10px;
  right: 10px;
  .swiper-slide {
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    border-radius: 25px;
    .swiper-item {
      display: inline-block;
      color: #333;
      padding: 2px 10px;

      border-radius: 25px;
      box-sizing: border-box;
      /deep/ &.van-hairline--surround::after {
        border-color: #ccc;
        border-radius: 25px;
      }
      &.active {
        background: #FFDCD8;
        color: #D45949;
        /deep/ &.van-hairline--surround::after {
          border-color: #D45949;
          border-radius: 25px;
        }
      }
      // &.nuxt-link-active {
      //   background: #FFDCD8;
      //   color: #D45949;
      //   /deep/ &.van-hairline--surround::after {
      //     border-color: #D45949;
      //     border-radius: 25px;
      //   }
      // }
    }
  }
}
</style>
