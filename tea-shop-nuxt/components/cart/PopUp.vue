<template>
  <!-- 弹窗组件 -->
  <div class="pop-up"
       v-show="isShow">
    <div class="content">
      <h3 class="title">{{title}}</h3>
      <div class="btn-wrap">
        <span class="cancel"
              @click="handleClickHide">取消</span>
        <span class="deleted"
              @click="handleClickDeleted">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePopUp',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    title: {
      type: String,
      default: '确定要从购物车删除所选商品吗？'
    }
  },
  methods: {
    handleClickHide () {
      this.isShow = false
    },
    handleClickDeleted () {
      this.$emit('deleted')
    },
    show () {
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';

.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 280px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    .title {
      padding: 41px 0 36px;
      text-align: center;
      font-size: 14px;
    }
    .btn-wrap {
      padding: 0 0 25px 30px;
      font-size: 0;
      span {
        display: inline-block;
        vertical-align: center;
        width: 100px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        &.cancel {
          margin-right: 25px;
          background-color: rgb(204, 204, 204);
        }
        &.deleted {
          background-color: rgb(51, 51, 51);
        }
      }
    }
  }
}
</style>
