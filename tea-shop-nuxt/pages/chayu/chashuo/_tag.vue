<template>
   <section class="zixun pf">
     <div class="mescroll" ref="mescroll">
       <div class="sub">
        <nuxt-link :to="`/chayudetail/${item.textType?item.textType:''}${item.articleId}`" class="items" v-for="(item,index) in dataList" :key="`${index}`">
          <div class="itemBottom" v-if="item.articleType==='30001'">
            <div class="left">
              <p>{{item.title}}</p>
              <div class="number">
                <div class="itemTop">
                  <img :src="item.userImage||'static/images/self@2x.png'">
                  <span>{{item.userName}}</span>
                </div>
                <div class="numberbre">
                  <i class="eye"></i>
                  <span class="text">{{item.readCount}}人看过</span>
                </div>
              </div>
            </div>
            <img :src="item.titleImage" alt="">
          </div>
          <div class="itemBottomOther" v-if="item.articleType==='30003'">
            <p>{{item.title}}</p>
            <img :src="item.titleImage" alt="" class="titleImg">
            <div class="number">
              <div class="itemTop">
                <img :src="item.userImage||'static/images/self@2x.png'">
                <span>{{item.userName}}</span>
              </div>
              <div class="numberbre">
                <i class="eye"></i>
                <!-- <span class="num"></span> -->
                <span class="text">{{item.readCount}}人看过</span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
     </div>
   </section>
</template>

<script>
import { chayuList } from '~/api/chayu'
import { mapGetters } from 'vuex'
import { chashuoroute } from '~/assets/js/chashuo'
// const labelId = '2019061911041769116000003'
export default {
  async asyncData ({ $axios, store, route }) {
    let labelId = ''
    chashuoroute.map(item => {
      if (item.name === route.params.tag) {
        labelId = item.id
      }
    })
    const dataList = await ($axios.$post(chayuList, {
      userId: store.getters.user.userId || '',
      labelId: labelId,
      pageNum: 0
    }))
    return { dataList: dataList.list }
  },
  data() {
    return {
      labelId: '',
      dataList: []
    }
  },
  mounted() {
    this.mescrollInit()
    this.getId(this.$route.params.tag)
  },
  watch: {
    $route(val, old) {
      if (val.params.tag !== old.params.tag) {
        this.getId(val.params.tag)
        this.dataList = []
        this.mescroll.resetUpScroll(false)
      }
    }
  },
  methods: {
    jumpToDetail(item) {
      this.$router.push(`/chayudetail/${item.articleId}`)
    },
    mescrollInit() {
      // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        down: {
          auto: false,
          callback: this.downGetList
        },
        up: {
          // auto: false,
          isBounce: false,
          callback: this.getchayuList,
          empty: {
            // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: this.$refs.mescroll, // 父布局的id (1.3.5版本支持传入dom元素)
            icon: require('~/assets/img/common/noData.png'), // 图标,默认null,支持网络图
            tip: '暂无数据' // 提示
          }
        }
      })
    },
    downGetList() {
      this.$axios.$post(chayuList, {
        userId: this.user.userId || '',
        labelId: this.labelId,
        pageNum: 0
      }).then(res => {
        if (res.code === 10000) {
          const arr = res.list
          this.dataList = []
          this.dataList = [...this.dataList, ...arr]
          this.$nextTick(() => {
            this.mescroll.endSuccess(arr.length)
          })
        }
      }).catch(() => {
        this.mescroll.endErr()
      })
    },
    getchayuList(page, mescroll) {
      this.$axios.$post(chayuList, {
        userId: this.user.userId || '',
        labelId: this.labelId,
        pageNum: page.num - 1
      }).then(res => {
        if (res.code === 10000) {
          const arr = res.list
          this.dataList = [...this.dataList, ...arr]
          this.$nextTick(() => {
            this.mescroll.endSuccess(arr.length)
          })
        }
      }).catch(() => {
        this.mescroll.endErr()
      })
    },
    getId(name) {
      chashuoroute.map(item => {
        if (item.name === name) {
          this.labelId = item.id
        }
      })
    }
  },
  components: {

  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~assets/css/variable.scss';
.zixun{
  top: 122px;
  left: 0;
  right: 0;
  bottom: 54px;
  background: #f2f2f2;

  .items {
    margin: 0 10px 10px;
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    display: block;
    .itemBottom {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      img {
        width: 100px;
        height: 75px;
        background: #ccc;
        border: none;
        object-fit: cover;
      }
      .left {
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        p {
          color: #333;
          font-size: 16px;
          font-weight: normal;
          line-height: 20px;
        }
        .number {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          .itemTop {
            display: flex;
            align-items: center;
            img {
              width: 20px;
              height: 20px;
              border: none;
              margin-right: 5px;
              border-radius: 50%;
            }
            span {
              color: #666;
              font-size: 14px;
            }
          }
          .numberbre {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            .eye {
              width: 16px;
              height: 16px;
              @include bg-image('common/eye');
              background-size: cover;
              margin-right: 5px;
            }
            .num {
              color: #333;
              margin-right: 5px;
            }
            .text {
              font-size: 11px;
              color: #999;
            }
          }
        }
      }
    }
    .itemBottomOther {
      p {
        color: #333;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        margin: 10px 0;
      }
      .titleImg {
        width: 100%;
        height: 160px;
        object-fit: cover;

        border: none;
      }
      .number {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-top: 10px;
        .itemTop {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            border: none;
            margin-right: 5px;
            border-radius: 50%;
          }
          span {
            color: #666;
            font-size: 14px;
          }
        }
        .numberbre {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          .eye {
            width: 16px;
            height: 16px;
            @include bg-image('common/eye');
            background-size: cover;
            margin-right: 5px;
          }
          .num {
            color: #333;
            margin-right: 5px;
          }
          .text {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
