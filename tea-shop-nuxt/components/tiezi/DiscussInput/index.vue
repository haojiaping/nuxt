<template>
  <div class="DiscussInputWraper">
    <img :src="userimage||require('~/assets/img/self/self@2x.png')">
    <div class="inp van-hairline--surround"
         id="test">
      <!-- <input type="textarea"
      name="" placeholder="填写评论"
      v-model="message"
      rows="1"
      autosize
      @blur="inputBlur"> -->
      <van-field v-model.trim="message"
                 type="textarea"
                 :placeholder="placeholder"
                 rows="1"
                 :autosize="{ maxHeight: 100, minHeight: 30}"
                 @blur="inputBlur"
                 ref="vantfield" />
    </div>
    <div class="sendBtn"
         @click="sendDis">
      <span>发送</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscussInput',
  data () {
    return {
      message: ''
    }
  },
  props: {
    userimage: {
      type: String,
      default: ' '
    },
    placeholder: {
      type: String,
      default: '填写评论'
    }
  },
  mounted () {
    this.message = ''
  },
  watch: {

  },
  methods: {
    sendDis () {
      if (this.message !== '') {
        this.$emit('sendDis', this.message)
      }
    },
    inputBlur () {
      window.scrollTo(0, 0)
    },
    inputFocus () {
      this.$refs.vantfield.focus()
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/variable.scss';
.DiscussInputWraper {
  display: flex;
  padding: 0 15px;
  /deep/ .van-hairline--surround::after {
    border-color: #ccc;
  }
  img {
    width: 33px;
    height: 33px;
    @include bg-image('self/self');
    background-size: cover;
    border-radius: 50%;
    border: 0;
  }
  .inp {
    margin: 0 10px;
    flex: 1;
    /deep/ .van-cell {
      padding: 0;
      line-height: 30px;
    }
    /deep/ .van-field__control {
      padding: 8px;
      box-sizing: border-box;
      line-height: 20px;
    }
    /deep/ textarea {
      height: 33px;
    }
    input {
      width: 100%;
      border: none;
    }
  }
  .sendBtn {
    width: 60px;
    text-align: center;
    height: 33px;
    line-height: 33px;
    box-sizing: border-box;
    color: #fff;
    font-size: 15px;
    background-color: #d45949;
  }
}
</style>
