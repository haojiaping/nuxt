<template>
  <!-- 个人资料组件 -->
  <div class="self-detail">
    <!-- 返回头 -->
    <!-- <Back title="个人资料"/> -->
    <backbar bgColor="#fff" leftColor="#333" title="个人资料"/>
    <div class="wrap">
      <ul class="content">
        <li class="item border-bottom">
          <span class="left">头像</span>
          <span class="right">
            <img :src="userdata.avatarPath" alt="">
            <!-- <van-icon name="arrow" color="#999" size="0.5rem"/> -->
          </span>
          <!-- <input type="file" accept="image/*" class="file"> -->
        </li>
        <li class="item border-bottom">
          <span class="left">昵称</span>
          <!-- 判断用户是否修改过昵称  0是未修改  1是已修改 -->
          <span class="right" @click="nameshow=true" v-if="userdata.isRename===0">
            <em class="name">{{userdata.nickName}}</em>
            <van-icon name="arrow" color="#999" size="0.5rem"/>
          </span>
          <span class="right" v-if="userdata.isRename===1">
            <em class="name">{{userdata.nickName}}</em>
          </span>
        </li>
        <li class="item border-bottom">
          <span class="left">性别</span>
          <span class="right" @click="show=true">
            <em class="name">{{userdata.sex|setsexshow}}</em>
            <van-icon name="arrow" color="#999" size="0.5rem"/>
          </span>
        </li>
        <li class="item border-bottom">
          <span class="left">绑定手机</span>
          <span class="right"  v-if="userdata.mobile">
            <em class="name" @click="$toast('如需更改号码请联系客服')">{{userdata.mobile|setmobileshow}}</em>
            <!-- <van-icon name="arrow" color="#999" size="1.2rem"/> -->
          </span>
          <router-link to="/bindphone" class="right" tag='span' v-if="!userdata.mobile">
            <em class="name">去绑定</em>
            <van-icon name="arrow" color="#999" size="0.5rem"/>
          </router-link>
        </li>
        <router-link to="/self/addlist" class="item" tag="li">
          <span class="left">收货地址</span>
          <span class="right">
            <van-icon name="arrow" color="#999" size="0.5rem"/>
          </span>
        </router-link>
      </ul>
      <div class="btn" @click="quitLogin" v-if="!isWX">退出登录</div>
      <div class="btn" @click="refreshUser" v-if="isWX">刷新登录信息</div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    <!-- <SelfName v-if="nameshow" @userName="getuserName"></SelfName> -->
  </div>
</template>

<script>
import backbar from '~/components/backbar'
import { getUserData, upUserData } from '~/api/self'
import { WX } from '~/environment/esm'
import { mapActions, mapGetters } from 'vuex'
import { setStore } from '~/utils/tool'
export default {
  name: 'SelfDetail',
  components: {
    backbar
  },
  data () {
    return {
      nameshow: false,
      show: false,
      userdata: {},
      actions: [
        {
          name: '女',
          sex: 0
        },
        {
          name: '男',
          sex: 1
        }
      ]
    }
  },
  mounted () {
    this.getUser()
  },
  computed: {
    isWX() {
      return WX
    },
    ...mapGetters(['user'])
  },
  methods: {
    onUserDate(option) {
      upUserData(option).then(res => {
        if (res.code === 10000) {
          this.$toast('修改成功')
          setTimeout(() => {
            this.$emit('needUpDate')
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })
    },
    quitLogin() {
      this.saveLogin({
        userId: '',
        token: '',
        isLogin: false,
        mobileFlag: false
      })
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push('/login')
    },
    getUser() {
      if (this.user.isLogin) {
        const option = {
          userId: this.user.userId,
          token: this.user.token
        }
        this.$axios.$post(getUserData, option).then(res => {
          if (res.code === 10000) {
            this.userdata = res.data
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    // 选择性别
    onSelect(e) {
      this.show = false
      console.log(e)
      const option = {
        userId: this.userdata.userId,
        uType: 'updateSex',
        str: e.sex
      }
      this.onUserDate(option)
    },
    // 修改昵称
    getuserName(name) {
      this.nameshow = false
      if (name === '') {
        this.$toast('未进行修改')
      } else {
        const option = {
          userId: this.userdata.userId,
          str: name,
          uType: 'updateNickName'
        }
        this.onUserDate(option)
      }
    },
    refreshUser() {
      this.saveLogin({
        userId: '',
        token: '',
        isLogin: false,
        mobileFlag: false
      })
      setStore('__redirectUrl__', '/self')
    },
    ...mapActions(['saveLogin'])
  },
  filters: {
    setsexshow(e) {
      if (e === 0) {
        return '女'
      } else if (e === 1) {
        return '男'
      } else if (e === -1) {
        return '未设置'
      }
    },
    setmobileshow(val) {
      if (val) {
        return `${val.substring(0, 3)}****${val.substring(val.length - 4)}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variable.scss';

.self-detail {
  padding-top: 44px;
  font-size: 14px;
  background-color: #f2f2f2;
  .wrap {
    padding: 10px;
    .content {
      margin-bottom: 20px;
      background-color: #fff;
      .item {
        position: relative;
        padding: 0 5px 0 10px;
        height: 44px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        &:first-child {
          height: 60px;
          img {
            display: inline-block;
            width: 50px;
            height: 50px;
            background-size: cover;
            border-radius: 50%;
            @include bg-image("self/self");
          }
          .file {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        .right{
          display: flex;
          align-items: center;
        }
      }
    }
    .btn {
      height: 44px;
      text-align: center;
      line-height: 44px;
      color: #333;
      background-color: #fff;
    }
  }
}
</style>
