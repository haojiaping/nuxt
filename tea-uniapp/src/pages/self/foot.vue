<template>
   <div class="footWraper">
     <!-- 返回头 -->
    <div >
      <div class="content">
        <div v-for="(item,index) in dataList" :key="index" class="item">
          <p class="time" v-if="dataList[index-1]?(item.timeShow===dataList[index-1].timeShow?false:true):true">{{item.timeShow}}</p>
          <div class="list">
            <linelist :datas="item"></linelist>
          </div>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import linelist from '@/components/linelist'
import { footList, clearfootList } from '@/api/self'
import { mapGetters } from 'vuex'
export default {
  name: 'coll',
  data() {
    return {
      dataList: [],
      pageNum:0,
      endFlag:true
    }
  },
  onLoad(){
    this.getCollList()
  },

  onReachBottom(){
    if (!this.endFlag) {
      this.getCollList()
    }
  },
  watch: {

  },
  methods: {
    getCollList() {
      if (this.pageNum === 0) this.dataList = []
      const option = {
        userId: this.user.userId,
        footprintId: this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].footprintId : 0
      }
      footList(option).then(res => {
        const arr = res.list
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
        }
        this.endFlag = res.endFlag
        if (!this.endFlag) this.pageNum++
      }).catch(err => {
        console.log(err)
      })
    },
    clearFoot() {
      this.$dialog.confirm({
        title: '清空',
        message: '确定要清空我的足迹么'
      }).then(() => {
        clearfootList({ userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.$toast('清空成功')
            this.getfootList(0)
          } else {
            this.$toast(res.message)
          }
        })
      }).catch(() => {
        // on cancel
      })
    }
  },
  components: {
    linelist
  },
  computed: {
    ...mapGetters([
      'user'])
  }
}
</script>

<style>
page{
  background: #f2f2f2;
}
</style>
<style lang="scss" scoped>
.footWraper {
  background: #f2f2f2;
  .time {
    padding: 0 15px;
    font-size: 14px;
    color: #666;

    line-height: 40px;
  }
  .content{
    margin: 0 10px 20px;
    .list{
      background: #fff;
      border-radius: 5px;
    }
  }
}
</style>
