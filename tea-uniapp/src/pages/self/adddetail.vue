<template>
  <div class="appendadd-wrap">
    <div class="wrap">
      <div class="margin border-bottom">
          <van-field
            :value="add.recipientName"
            clearable
            label="联系人"
            title-width="60px"
            placeholder="用于接收快递时对您的称呼"
            :border="false"
            custom-style="padding:10px 5px;"
            @change="onChangeName"
          />
      </div>
      <div class="item sex border-bottom margin">
        <span>性别</span>
        <div class="inp">
          <radio-group  @change="onChange" style="display:flex;" :value="add.recipientSex">
            <radio class="radio"  color="#D45949" value="1" checked><span>男</span></radio>
            <radio  class="radio"  color="#D45949" value="2" ><span>女</span></radio>
          </radio-group>
        </div>
      </div>
      <div class="border-bottom margin">
        <van-field
            :value="add.recipientMobile"
            clearable
            label="手机号"
            type="tel"
            title-width="60px"
            placeholder="请输入手机号"
            :border="false"
            custom-style="padding:10px 5px;"
            @change="onChangeMobile"
          />
      </div>
      <div class="item sex border-bottom margin">
        <span>地址</span>
        <div class="inp add" v-if="hjp" @click="haojp">请选择您的地址</div>
        <div class="inp" v-else >{{region[0]}} {{region[1]}} {{region[2]}}</div>
      </div>
      <div class="border-bottom margin">
        <van-field
            :value="add.addressDetail"
            clearable
            label="门牌号"
            title-width="60px"
            placeholder="例:8号楼201室"
            :border="false"
            custom-style="padding:10px 5px;"
            @change="onChangeDetail"
          />
      </div>
      <div class="item sex border-bottom margin">
        <span>标签</span>
        <div v-for="tagitem in addTagArr" :key="tagitem"
          @click="handleChangeTag(tagitem)">
          <tag :content="tagitem" :color="tagitem!==add.addressTag"
          :bgcolor="tagitem==add.addressTag"></tag>
        </div>
      </div>
    </div>
    <div class="setDefAdd f15">
      <i class="checkicon" :class="add.defaultStatus===1?'active':''" @click="setdef"></i>
      <span>设为默认地址</span>
    </div>
    <div  v-bind:class="{ active: hao, activee: haoo}">
      <transition name="van-slide-up">
      <view class="area-wrap" >
       <picker mode="region" @change="hjpp" value="{{}}" custom-item="{{}}" >
    <div class="picker" id="picker" v-if="picker">
       选择城市地区：{{region[0]}}，{{region[1]}}，{{region[2]}}
    </div>
    <div v-else>

    </div>
  </picker>
      </view>
    

  </transition>
    </div>
    <div class="btn-wrap mauto" @click="save" v-if="!isEdit">保存</div>
    <div class="btns-wrap" v-if="isEdit">
      <div class="btn red" @click="delAdd">删除</div>
      <div class="btn black" @click="save">保存</div>
    </div>
    
 
  
  </div>
</template>

<script>
import areaLists from '@/utils/area' // 省份列表
import { mapGetters } from 'vuex'
import { setAppendAdd, upDateAdd, deleteAdd } from '@/api/self'
import { mobileReg } from '@/utils/validate'
import tag from '@/components/tag'
const defultAdd = {
  addressDetail: '',
  addressId: '',
  addressTag: '',
  defaultStatus: 1,
  recipientAddress: '',
  recipientMobile: '',
  recipientName: '',
  recipientSex: '1'
}
export default {
  components: {
    tag
  },
  data () {
    return {
      address: '',
      areaList: Object.assign({},areaLists),
      areashow: false,
      check: 0, // 0 不默认 1 默认
      add: {},
      hao:false,
      haoo:true,
      hjp:true,
      picker:true,
        items: [
      { name: 'nan', value: '男' },
      { name: 'nv', value: '女', checked: 'true' },
    
    ],
      region:['北京市', '北京市', '西城区'],
      customItem: '全部',
      isEdit:false,
      addTagArr:['公司','家','学校']
    }
  },
  onLoad(option){
    this.areaList = Object.assign({},areaLists)
    if (option.type==='edit') {
      this.isEdit = true
      this.add = Object.assign({}, JSON.parse(option.adddata))
      this.add.recipientSex = String(this.add.recipientSex)
    } else {
      this.isEdit = false
      this.add = Object.assign({}, defultAdd)
    }
  },
  methods: {
     hjpp (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // 
   
      this.region= e.detail.value
      this.hjp= false
      this.picker=false
      

  console.log(this.region[2])
  },
  haojp(){
    this.hao= true
    this.haoo= false
     let query = wx.createSelectorQuery()
    let picker=  query.select('#picker')
    if(!this.hjp){
   picker.display= 'none'
console.log(picker)
      }
  },
     onChange(event){

       this.add.recipientSex = event.detail.value
      //  console.log(event.detail.value);
     },
     onChangeName(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
       this.add.recipientName = event.detail
      },
     onChangeMobile(event) {
       this.add.recipientMobile = event.detail
      },
     onChangeDetail(event) {
       this.add.addressDetail = event.detail
      },
    // 地址选择确认框
    confirm(event) {
      let selArr = event.detail.values
      this.add.recipientAddress = ''
      selArr.forEach(element => {
        this.add.recipientAddress += element.name + ' '
        console.log(this.add)
      })
      console.log(add.recipientAddress)
      this.areashow = false
    },
    // 是否设置为默认地址
    setdef() {
      this.add.defaultStatus === 0 ? this.add.defaultStatus = 1 : this.add.defaultStatus = 0
    },
    handleChangeTag(tag) {
      console.log(tag)
      this.add.addressTag = tag
    },
    // 给tag标签赋值
    selTag(e) {
      this.tag = e
    },
    delAdd() {
      console.log('1111')
      if (this.isEdit) {
        console.log(this.add)
        const option = {
          userId: this.userId,
          token: this.token,
          addressId: this.add.addressId
        }
        deleteAdd(option).then(res => {
          if (res.code === 10000) {
            uni.showToast({
                title: '地址删除成功',
                duration: 1000
            });
            // let add = sessionStorage.getItem('__teaAdd__')
            // if (add) {
            //   add = JSON.parse(add)
            //   if (this.add.addressId === add.addressId) sessionStorage.removeItem('__teaAdd__')
            // }
            
              uni.navigateBack({delta:1 });
           
          } else {
            this.$toast(res.message)
          }
        })
      }
    },
    save() {
      const option = {
        userId: this.user.userId,
        recipientName: this.add.recipientName,
        recipientSex: Number(this.add.recipientSex),
        recipientMobile: this.add.recipientMobile,
        recipientAddress: this.region,
        addressDetail: this.add.addressDetail,
        addressTag: this.add.addressTag,
        defaultStatus: this.add.defaultStatus // 0 不默认 1 默认
      }
      console.log(option);
      if (!mobileReg.test(option.recipientMobile)) {
        uni.showToast({
            icon:'none',
            title: '请输入正确的手机号',
            duration: 1000
        });
        return
      }
      if (option.recipientName === '' || option.addressDetail === '') {
        uni.showToast({
            icon:'none',
            title: '请填写完整信息',
            duration: 1000
        });
        return
      }
      // 如果从上级页面传过来地址 则调用更新地址接口 否则的话是新增地址接口
      if (!this.isEdit) {
        setAppendAdd(option).then(res => {
          console.log(res)
          if (res.code === 10000) {
            uni.showToast({
                title: '地址保存成功',
                duration: 1000
            });
            setTimeout(() => {
              uni.navigateBack({});
            }, 800)
          }
        })
      } else {
        option.addressId = this.add.addressId
        upDateAdd(option).then(res => {
          console.log(res)
          if (res.code === 10000) {
            uni.showToast({
                title: '地址更新成功',
                duration: 1000
            });
            setTimeout(() => {
              uni.navigateBack({});
            }, 800)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style>
page{
  background-color: #f2f2f2;
}
</style>
<style lang="scss" scoped>
.radio{
  margin: 0 15px;
}
.active{
  display: block;
}
.activee{
  display: none
}
.appendadd-wrap {
  background-color: #f2f2f2;
  .wrap {
    margin: 10px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 5px;
    .border-bottom{
      border-bottom: 1upx solid #e8e8e8;
    }
    .margin{
      margin: 0 10px;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 2px 5px;
      font-size: 14px;
      span {
        flex: 1;
        max-width: 60px;
        color: #333;
      }
      .add {
        color: #999;
      }
      .inp{
        flex: 1;
      }
    }
    .item /deep/ .van-field__label {
      max-width: 60px;
      color: #333;
    }
    .sex {
      padding: 10px 5px;
    }
    .item /deep/ .van-radio {
      // display: inline-block;
      margin-right: 25px;
    }
    .item /deep/ .van-field__control {
      color: #333;
    }
    .item /deep/ .van-field__control::placeholder {
      color: #999;
    }
  }
  .setDefAdd {
    margin: 0 15px;
    padding-left: 5px;
    display: flex;
    align-items: center;
    line-height: 20px;
    .checkicon {
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      @include bg-image('self/check');
      background-size: cover;
      margin-right: 5px;
    }
    .active {
      @include bg-image('self/check-active');
    }
  }
}
.area-wrap {
  position: fixed;
  bottom: -1;
  left: 0;
  right: 0;
}
.btns-wrap{
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  .btn{
    width: 45%;
    line-height: 33px;
    text-align: center;
    border-radius:22px;
    font-size: 15px;
    &.red{
      color: #D45948;
      background: #fff;
    }
    &.black{
      color: #fff;
      background:rgba(51,51,51,1);
    }
  }
}
.btn-wrap {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  width: 270px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background:rgba(51,51,51,1);
  border-radius:22px;
  color: #fff;
}
@media screen and (max-height: 360px) {
  .btn-wrap {
    display: none;
  }
  .area-wrap {
    display: none;
  }
}
</style>
