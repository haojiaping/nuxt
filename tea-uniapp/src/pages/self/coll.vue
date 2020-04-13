<template>
   <div class="footWraper">
     <!-- 返回头 -->
    <div>
      <div class="content">
        <linelist v-for="(item,index) in dataList" :key="index" :datas="item"></linelist>
      </div>
    </div>
   </div>
</template>

<script>
import linelist from '@/components/linelist'
import { getUserColl } from '@/api/self'
import { mapGetters } from 'vuex'
export default {
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
        collectId: this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].collectId : 0
      }
      getUserColl(option).then(res => {
        const arr = res.list
        if (res.code === 10000) {
          this.dataList = this.dataList.concat(arr)
        }
        this.endFlag = res.endFlag
        if (!this.endFlag) this.pageNum++
      }).catch(err => {
        console.log(err)
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
  .content{
    background: #fff;
    margin: 10px;
    border-radius: 5px;
  }
}
</style>
