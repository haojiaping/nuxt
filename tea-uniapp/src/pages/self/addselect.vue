<template>
   <div>
     <add :isSelect="true" ref="add"></add>
   </div>
</template>

<script>
import add from '@/components/self/add'
export default {
  data() {
    return {

    }
  },
  onShow(){
    this.$refs.add.Address()
  },
  watch: {

  },
  methods: {

  },
  components: {
    add
  }
}
</script>

<style>
page{
  background: #F2F2F2;
}
</style>
<style scoped lang='scss'>

</style>
