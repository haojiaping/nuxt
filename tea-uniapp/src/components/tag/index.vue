<template>
  <div :class="color?'def':'color'" v-if="content">
    <div class="tag-wrap border" :class="bgcolor?'bgcolor':''">
    <span>{{content}}</span>
  </div>
  </div>
</template>

<script>
export default {
  name: 'tag',
  data () {
    return {
    }
  },
  props: {
    color: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ''
    },
    bgcolor: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.tag-wrap {
  display: inline-block;
  min-width: 30px;
  // height: 15px;
  padding: 1upx 5px;

  color: #333;
  box-sizing: border-box;
  font-size: 10px;
  text-align: center;
  margin-right: 10px;
  border-radius:12px;
}
.bgcolor {
  color: #D45949;
  background: #FFDAD5;
}
.color {
  display: inline-block;
  .border {
    border: 1upx solid #D45949;
  }
}
.def {
  display: inline-block;
  .border{
    border: 1upx solid #ccc;
  }
}
</style>
