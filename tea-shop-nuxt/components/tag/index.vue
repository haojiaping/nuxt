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
  padding: 1px 5px;

  color: #333;
  box-sizing: border-box;
  font-size: 12px;
  text-align: center;
  margin-right: 10px;
}
.bgcolor {
  color: #D45949;
  background: #FFDAD5;
}
.color {
  display: inline-block;
  .border:before {
    border: 1px solid #D45949;
  }
}
.def {
  display: inline-block;
  .border:before {
    border: 1px solid #ccc;
  }
}
</style>
