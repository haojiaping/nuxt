<template>
   <div style="width:100%;height:100%;">
    <input type="file" accept="image/*" style="opacity:0;width:100%;height:100%;" @change="handleFile"/>
    <div>222121</div>
   </div>
</template>

<script>
import { upimage } from '~/api/self'
import { upimagePost } from '~/api/self'
export default {
  name: 'UpImage',
  data() {
    return {

    }
  },
  props: {
    type:{
      type:String,
      default:''
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    handleFile(e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files[0]) {
        return
      }
      const formData = new FormData()
      formData.append('file', files[0])
      this.$toast.loading({
        mask: true,
        message: '上传中...',
        duration: 0
      })
      if (this.type==='post') {
        

      this.$axios.$post(upimagePost, formData).then(res => {
          if (res.code === 10000) {
            this.$emit('imgUrl', res)
            this.$toast.clear()
            this.$toast.success('上传成功')
          } else {
            this.$toast.fail(res.message)
          }
        })
      }else {
        this.$axios.$post(upimage, formData).then(res => {
          if (res.code === 10000) {
            this.$emit('imgUrl', res.data)
            this.$toast.clear()
            this.$toast.success('上传成功')
          } else {
            this.$toast.fail(res.message)
          }
        })
      }
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>

</style>
