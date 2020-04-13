<template>
   <section class="followWrpa">
     <backbar :bgColor="barOption.bgColor" :leftColor="barOption.leftColor" :title="barOption.title"></backbar>
     <div class="mescroll pf" ref="mescroll">
       <div>
         <div class="top pr">
           <div class="info df">
             <img :src="datas.avatarPath||require('~/assets/img/self/self@2x.png')" alt="">
             <div class="name">
               <p class="cf f18 fw600">{{datas.nickName}}</p>
               <p class="cf f15 fw400 df text">
                 <span>{{datas.personalizedSignature}}</span>
                 <span class="edit" @click="jumpToSelfDetail" v-if=" followId === user.userId"></span>
               </p>
             </div>
           </div>
           <div class="tab cf df f15">
             <p class="tabItem" @click="jumpToFollow('1')">
               <span class="mright">关注</span>
               <span class="fw600">{{datas.attentionNum}}</span>
             </p>
             <p class="line"></p>
             <p class="tabItem" @click="jumpToFollow('0')">
               <span class="mright">粉丝</span>
               <span class="fw600">{{datas.fansNum}}</span>
             </p>
           </div>
           <div class="btn pa">
             <span>+</span>
             <span>关注</span>
           </div>
         </div>

        <div class="listWrap">
          <chayuItem v-for="(item,index) in dataList" :key="`chayu_${index}`"
          :datas="item"></chayuItem>
        </div>

       </div>
     </div>
   </section>
</template>

<script>
import chayuItem from '~/components/chayu/chayuItem'
import backbar from '~/components/backbar'
import { info, infolist } from '~/api/post'
import { mapGetters } from 'vuex'
const defaultBarOption = {
  bgColor: 'transparent',
  leftColor: '#fff',
  title: ''
}
const activeBarOption = {
  bgColor: '#fff',
  leftColor: '#333',
  title: ''
}
export default {
  data() {
    return {
      barOption: Object.assign({}, defaultBarOption)
    }
  },
  // 异步获取数据
  async asyncData ({ $axios, route, store }) {
    try {
      // const datas = await $axios.$post(info, {
      //   followId: route.params.followId,
      //   userId: ''
      // })
      const [datas, dataList] = await Promise.all([
        $axios.$post(info, { followId: route.params.followId, userId: '' }),
        $axios.$post(infolist, { pageNum: 0, followId: route.params.followId })
      ])
      return {
        datas: datas.data,
        followId: route.params.followId,
        dataList: dataList.data
      }
    } catch (error) {
      console.log(error)
    }
  },
  mounted() {
    this.init()
  },
  watch: {

  },
  methods: {
    init() {
      this.$axios.$post(info, { userId: this.user.userId, followId: this.followId })
      this.mescrollInit()
    },

    mescrollInit() {
    // eslint-disable-next-line
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          isBounce: false,
          callback: this.getList,
          lazyLoad: {
            use: true
          },
          onScroll: this.onScroll
        }
      })
    },
    getList(page, mescroll) {
      this.$axios.$post(infolist, { followId: this.followId, pageNum: page.num - 1 }).then(res => {
        const arr = res.data
        if (page.num === 1) {
          this.dataList = []
        }
        this.dataList = [...this.dataList, ...arr]
        this.$nextTick(() => {
          this.mescroll.endSuccess(arr.length)
        })
      }).catch(() => {
        this.mescroll.endErr()
      })
    },
    onScroll(mescroll, y, isUp) {
      if (y > 150) {
        this.barOption = Object.assign({}, activeBarOption)
        this.barOption.title = this.datas.nickName
      } else {
        this.barOption = Object.assign({}, defaultBarOption)
      }
    },
    jumpToSelfDetail() {
      this.$router.push('/self/detail')
    },
    jumpToFollow(type) {
      this.$router.push({ path: '/userid/list', query: { listType: type, followId: this.followId } })
    }
  },
  beforeDestroy () {
    this.mescroll.destroy()
  },
  components: {
    backbar,
    chayuItem
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped lang='scss'>
@import '~/assets/css/variable.scss';
.followWrpa{
  .mescroll{
    top: 0;
    left: 0;
    bottom: 0;
    height: auto;
    .top{
      width: 100%;
      height: 229px;
      @include bg-image('tiezi/bg');
      .info{
        padding: 65px 0 30px 30px;
        img{
          width: 60px;
          height: 60px;
          border-radius: 30px;
          margin-right: 15px;
        }
        .name{
          .text{
            margin-top: 10px;
            align-items: center;
            .edit{
              width: 15px;
              height: 15px;
              @include bg-image('tiezi/edit');
            }
          }
        }
      }

      .tab{
        justify-content: center;
        align-items: center;
        .tabItem{
          padding: 0 30px;
          .mright{
            margin-right: 15px;
          }
        }
        .line{
          width: 1px;
          height: 12px;
          background: #fff;
        }
      }

      .btn{
        width: 88px;
        height: 30px;
        line-height: 30px;
        background: #D55847;
        color: #fff;
        text-align: center;
        border-radius: 15px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

    }

    .listWrap{
      margin: 15px 10px 0;

    }
  }
}
</style>
