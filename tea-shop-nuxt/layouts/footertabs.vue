<template>
   <div class="myTabbar" v-show="menuShow">
     <van-tabbar v-model="active" :safe-area-inset-bottom="true"
      active-color="#333"
      inactive-color="#333"
      :z-index="99">
      <nuxt-link class="link" v-for="(menu,index) in tabbar" :key="index"
        :to="`${menu.path}`">
        <van-tabbar-item :icon="menu.icon">
        <span>{{menu.name}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? menu.active : menu.normal">
      </van-tabbar-item>
    </nuxt-link>
    </van-tabbar>
   </div>
</template>

<script>
export default {
  name: 'footertabs',
  data() {
    return {
      active: 0,
      menuShow: true,
      tabbar: [
        {
          name: '首页',
          path: '/',
          pathName: 'index',
          active: require('~/assets/img/footerBar/home-active@2x.png'),
          normal: require('~/assets/img/footerBar/home@2x.png'),
          info: ''
        },
        {
          name: '分类',
          path: '/type',
          pathName: 'type',
          active: require('~/assets/img/footerBar/type-active@2x.png'),
          normal: require('~/assets/img/footerBar/type@2x.png'),
          info: ''
        },
        {
          name: '社区',
          path: '/chayu',
          pathName: 'chayu',
          active: require('~/assets/img/footerBar/chayu-active@2x.png'),
          normal: require('~/assets/img/footerBar/chayu@2x.png'),
          info: ''
        },
        {
          name: '购物车',
          path: '/cart',
          pathName: 'cart',
          active: require('~/assets/img/footerBar/cart-active@2x.png'),
          normal: require('~/assets/img/footerBar/cart@2x.png'),
          info: ''
        },
        {
          name: '我的',
          path: '/self',
          pathName: 'self',
          active: require('~/assets/img/footerBar/self-active@2x.png'),
          normal: require('~/assets/img/footerBar/self@2x.png'),
          info: ''
        }
      ]
    }
  },
  watch: {
    $route: 'changeActive'
  },
  created() {
    const toName = this.$route.name
    this.setActive(toName)
  },
  methods: {
    changeActive({ name }) {
      this.setActive(name)
    },
    setActive(name) {
      if (name && name.split('-').includes('chayu')) {
        this.active = 2
        this.menuShow = true
      } else if (this.tabbar.findIndex(n => n.pathName === name) === -1) {
        this.menuShow = false
      } else {
        this.active = this.tabbar.findIndex(n => n.pathName === name)
        this.menuShow = true
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.myTabbar{
  .van-tabbar{
    height: auto;
  }
  .van-tabbar-item{
    padding: 10px 0;
  }
  .link{
    flex:1;
  }
}
</style>
