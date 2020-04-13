<template>
   <div class="Wrap pa mescroll" ref="mescroll">
     <div>

       <div class="banner-wrapper pr">
            <div v-swiper:mySwiperBanner="swiperOptionBanner">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="ban in bannerList" :key="ban.bannerId">
                  <nuxt-link class="alink" :to="`${jumpUrl(ban.jumpType,ban.jumpContent)}`">
                    <img :src="ban.imageUrl" width="100%" height="100%" style="object-fit: cover;">
                  </nuxt-link>
                </div>
              </div>
              <div class="swiper-pagination swiper-pagination-bullets"></div>
            </div>
          </div>

      <div class="listWrap">
        <chayuItem v-for="(item,index) in dataList" :key="`chayu_${index}`"
        :datas="item"></chayuItem>
      </div>
     </div>
   </div>
</template>

<script>
import { recommend } from '~/api/post'
import { mapGetters } from 'vuex'
import chayuItem from '~/components/chayu/chayuItem'
import { chayuSwiperOptionBanner } from '~/assets/js/swiperOptios'
import { jumpUrl } from '~/utils/jump'
export default {
  data() {
    return {
      swiperOptionBanner: Object.assign({}, chayuSwiperOptionBanner)
    }
  },
  async asyncData ({ $axios }) {
    const dataList = await $axios.$post(recommend, { pageNum: 0, userId: '' })
    const bannerList = dataList.data[0].bannerList
    return { dataList: dataList.data, bannerList: bannerList }
  },
  mounted() {
    this.mescrollInit()
  },
  watch: {

  },
  methods: {
    jumpUrl,
    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: this.$refs.mescroll, // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    getList(page, mescroll) {
      this.$axios.$post(recommend, { pageNum: page.num - 1, userId: this.user.userId }).then(res => {
        if (res.code === 10000) {
          const arr = res.data
          if (page.num === 1) {
            this.dataList = []
            this.bannerList = []
            this.bannerList = arr[0].bannerList
          }
          this.dataList = [...this.dataList, ...arr]
          this.$nextTick(() => {
            this.mescroll.endSuccess(arr.length)
          })
        }
      }).catch(() => {
        this.mescroll.endErr()
      })
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    chayuItem
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.Wrap{
  top: 86px;
  left: 0;
  right: 0;
  bottom: 60px;
  background: #f2f2f2;
  &.mescroll{
    height: auto;
  }
  .banner-wrapper{
    margin: 9px 10px 6px 10px;
    height: 135px;
    overflow: hidden;
    .alink{
      display: block;
      width: 100%;
      height: 100%;
      img{
        height: 130px;
      }
    }
  }
  .listWrap{
    margin: 0 10px;
  }
}
</style>
