<template>
   <div>
     <div class="header f14">
       <div class="userInfo  df">
         <img :src="userInfo.avatarPath||require('~/assets/img/self/userbg.png')" alt="">
         <p class="f15 text textcenter">{{userInfo.userName}}</p>
         <p class="f15 text" v-if="userInfo.mobile">{{regMobile(userInfo.mobile)}}</p>
       </div>
       <div class="walInfo df border-top">
         <div class="walitem" @click="$router.push({path:'/market/flow'})">
           <div class="itemtop">
              <span class="f24 num">{{userInfo.price>=0?userInfo.price.toFixed(2):userInfo.price}}</span>
              <span class="f15">元</span>
           </div>
           <p class="f15 itembottom">累计收入</p>
         </div>
         <div class="walitem" @click="$router.push({path:'/market/myuser'})">
           <div class="itemtop">
              <span class="f24 num">{{userInfo.num}}</span>
              <span class="f15">人</span>
           </div>
           <p class="f15 itembottom">我的用户</p>
         </div>
       </div>
     </div>
     <div class="list">
       <div class="listitem df border-bottom" @click="jumpTocash">
         <span class="f15">我要提现</span>
        <van-icon name="arrow" color="#999" size="20px"/>
       </div>
       <div class="listitem df" @click="getCode">
         <span class="f15">我的二维码</span>
        <van-icon name="arrow" color="#999" size="20px"/>
       </div>
     </div>
   </div>
</template>

<script>
import { getUserData } from '~/api/market'
import { mapGetters } from 'vuex'
import { regMobile } from '@/utils/index'
export default {
  name: 'Home',
  data() {
    return {
      userInfo: {}
    }
  },
  mounted() {
    this.getData()
  },
  watch: {

  },
  methods: {
    regMobile,
    getData() {
      if (this.user.isLogin) {
        this.$axios.$post(getUserData, { userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.userInfo = res.data
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    getCode() {
      window.open(this.userInfo.qrCodePath)
    },
    jumpTocash() {
      this.$router.push('/market/tocash')
    }
  },
  components: {

  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.header {
  @include bg-image('market/bg');
  height: 320px;
  background-size: cover;
  .userInfo {
    padding: 60px 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
    .text {
      font-weight: 600;
      color: #fff;
      text-align: center;
      &.textcenter {
        margin: 15px 0;
      }
    }
  }
  .walInfo {

    margin: 0 25px;
    font-weight: normal;
    justify-content: space-between;
    padding: 25px;
    .walitem {
      .itemtop {
        span {
          color: #fff;
          &.num {
            font-weight: 600;
          }
        }
      }
      .itembottom {
        color: #fff;
        opacity: 0.5;
      }
    }
  }
  .border-top:before {
    border-color: rgba(242, 242, 242, 0.2);
  }
}
.list {
  margin: 10px;
  .listitem {
    font-weight: normal;
    background: #fff;
    padding: 13px 15px;
    justify-content: space-between;
  }
}
</style>
