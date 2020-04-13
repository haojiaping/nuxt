<template>
   <div class="chayuWrap pr">
     <div class="header df pr">
      <!-- <van-icon :name="require('~/assets/img/self/selfhei@2x.png')" color="#fff" size="20px" @click="jumpToUser"/> -->
      <span class="self" @click="jumpToUser"></span>
       <span class="f18 c3">茶人茶语</span>
      <van-icon :name="require('~/assets/img/tiezi/fatie@2x.png')" color="#fff" size="20px" @click="jumpToSend" />
      <div class="tips pa" @click="jumpToSend" v-show="tipsShow"></div>
     </div>
     <div class="tabs df">
      <div class="tab" @click="changeTab(item)"
      :class="tabactive===item.id?'active':''"
      v-for="(item,index) in tablist" :key="index">
        <p class="tac text">{{item.text}}</p>
        <p class="line"></p>
      </div>
     </div>

    <nuxt-child/>

   </div>
</template>

<script>
import { mapGetters } from "vuex";
import { WX } from "~/environment/esm";
import { setStore } from '~/utils/tool'
import { wxreURL } from '~/config/constant'
export default {
  name: 'chayu',
  data() {
    return {
      tabactive: 1,
      tablist: [
        {
          id: 0,
          path: '/chayu/flow',
          name: 'chayu-flow',
          text: '关注'
        },
        {
          id: 1,
          path: '/chayu',
          name: 'chayu',
          text: '推荐'
        },
        {
          id: 2,
          path: '/chayu/chashuo',
          name: 'chayu-chashuo',
          text: '茶说'
        },
        {
          id: 3,
          path: '/chayu/chaping',
          name: 'chayu-chaping',
          text: '茶评'
        }
      ],
      tipsShow:false
    }
  },
  mounted() {
    if (this.$route.name.split('-').includes('chashuo')) {
      this.tabactive = 2
    } else {
      this.tabactive = this.tablist.findIndex(n => n.name === this.$route.name)
    }
    let tipsShow = localStorage.getItem('tipsShow')
    if (tipsShow) {
      this.tipsShow = false
    } else {
      this.tipsShow = true
      localStorage.setItem('tipsShow','111')
    }
  },
  watch: {
    $route: 'changeActive'
  },
  methods: {
    changeTab(item) {
      this.tabactive = item.id
      this.$router.replace(item.path)
    },
    changeActive({ name }) {
      if (name.split('-').includes('chashuo')) {
        this.tabactive = 2
      } else {
        this.tabactive = this.tablist.findIndex(n => n.name === name)
      }
    },
    jumpToUser(){
      if (this.user.isLogin) {
        this.$router.push(`/userid/${this.user.userId}`)
      } else if(WX){
        setStore('__redirectUrl__', this.$route.fullPath)
          window.location.href = `${wxreURL}`
      } else {
        setStore('__redirectUrl__', this.$route.fullPath)
        this.$router.push('/login')
      }
    },
    jumpToSend(){
      if (this.user.isLogin) {
        this.$router.push(`/userid/send`)
      } else if(WX){
        setStore('__redirectUrl__', this.$route.fullPath)
          window.location.href = `${wxreURL}`
      } else {
        setStore('__redirectUrl__', this.$route.fullPath)
        this.$router.push('/login')
      }
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
.chayuWrap{
  height: 100%;
  .header{
    padding: 10px 20px;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .self{
      width: 22px;
      height: 22px;
      @include bg-image('self/selfhei');
      border-radius: 15px;
    }
    .tips{
      width: 103px;
      height: 47px;
      @include bg-image('tiezi/tips');
      right: 30px;
      top: 5px;
    }
  }

  .tabs{
    justify-content: space-between;
    background: #fff;
    padding: 0 10px 10px;
    .tab{
      flex:1;
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      .text{
        color:#333;
      }
      &.active{
        .text{
          font-size: 18px;
          font-weight: 600;
        }
        .line{
          height: 2px;
          width: 35px;
          margin: 0 auto 0;
          background: #D45949;
        }
      }
    }
  }
}
</style>
