<template>
   <view>
     <div class="nav pf">
        <div :class="{'active':tabType==0}" class="navitem pr fw400 f30" @click="changeTab(0)">未使用({{couponUnusedCount}})</div>
        <div :class="{'active':tabType==1}" class="navitem pr fw400 f30" @click="changeTab(1)">已使用</div>
        <div :class="{'active':tabType==2}" class="navitem pr fw400 f30" @click="changeTab(2)">已过期</div>
      </div>
      <div class="list-wrap">
        <couponListItem v-for="(item,index) in dataList" :key="index" :datas="item"></couponListItem>
      </div>
   </view>
</template>

<script>
import { getUserCoupon } from '@/api/self'
import { mapGetters } from 'vuex'
import couponListItem from '@/components/self/couponListItem'
export default {
  data() {
    return {
      tabType:0,
      pageNum:0,
      dataList:[],
      couponUnusedCount:0,
      endFlag:1
    }
  },
  onLoad() {
    this.getListData()
  },
  onReachBottom(){
    if (this.endFlag===0) {
      this.getListData()
    }
  },
  methods: {
    changeTab(e){
      this.tabType = e
      this.pageNum = 0
      this.getListData()
    },
    getListData(){
      uni.showLoading({
        });
      getUserCoupon({ userId: this.user.userId, couponFlag: this.tabType, pageNum: this.pageNum }).then(res => {
        if (res.code === 10000) {
          this.couponUnusedCount = res.couponUnusedCount
          if (this.pageNum === 0) this.dataList = [] // 如果是第一页需手动制空列表
          this.endFlag = res.isEnd
          if (this.endFlag===0) {
            this.pageNum++ 
          }
          this.dataList = this.dataList.concat(res.data)
        }
        uni.hideLoading();
      }).catch(err=>{
        uni.hideLoading();
      })
    }
  },
  components: {
    couponListItem
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>
<style>
page{
  background: #f2f2f2;
}
</style>
<style scoped lang='scss'>
.nav {
    text-align: center;
    height: 40px;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    .navitem {
      display: inline-block;
      width: 28%;
      line-height: 36px;
      font-size: 14px;
      &.active {
        color: #333;
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
  .list-wrap{
    padding-top: 40px;
  }
</style>
