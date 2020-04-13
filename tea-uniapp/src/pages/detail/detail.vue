<template>
  <div class="OutWrap">
      <div class="mengceng" v-if="mengceng">
         <div class="mengcengtu">
           <div class="mengcengtitle">
             <img src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/e91321d4-2cd9-41db-967e-b3be33eb2744.jpg" alt="">买真茶，上臻茶商城
           </div>
           <div class="mengcengimg">
             <img :src="xun" alt="" class="mengcengtupian">
           </div>
           <div class="mengcengzi">
             <div class="mengcengzileft">
               <p>{{teaProduct.productName}}</p>
               <p class="redziti">¥ {{selData.productPrice||defaultAttr.productPrice}}</p>
             </div>
             <div class="mengcengziright">
               <image src="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/26fab60e-d49a-407c-9eaf-118b6a26cd69.jpg" alt="">
             </div>
           </div>
         </div>
     <div class="fenxiangtu">
           <div class="fenxiangbaocun"> 
             <div class="floatleft hhh" @click="fenxianga">
               <img src='https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/afb3dbc7-4102-4cc1-89c3-cff9db48668e.jpg'>
               <button open-type="share" class="haoyou">分享给好友</button>
             </div>
             <div class="floatright hhh" @click="downloadImage(xun)">
               <img src='https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2020/1/1cac78ae-f03a-44d5-a024-1fd00b3a0fed.jpg'>
               <p>保存图片</p>
             </div>
           </div>
           <div class="quxiao" @click="quxiaomengceng"> 取消</div>
         </div>
      </div>
     
         
    <div>
      <div  class="detail-wrap" ref="container">
        <div ref="goodWrap">
          <!-- 商品图片 -->
          <div class="img-wrpper pr" ref="top" v-if="teaProduct">
            <swiper circular="true" interval="5000" style="height:100%;">
              <swiper-item v-for="(image , index) in banner" :key="index">
                <img
                  :src="image.productImage"
                  width="100%"
                  height="100%"
                  class="banner-img"
                  :class="image.bannerSort===-1?'videoFast':''"
                  @click="ViewBannerImages(image.productImage)"
                />
                <div class="custom-indicator">
              <div class="swiper-pagination"  >
              {{index+1}}/{{banner.length}}
              </div>
            </div>
              </swiper-item>
            </swiper>
            

            <div class="playerWraper" @click="onClickPlay" v-show="playerBtnShow&&videoTemp">
              <van-icon
                name="https://osstea.oss-cn-huhehaote.aliyuncs.com/user/2019/7/4785fa13-a1b5-4f39-932d-45d94d689f04.jpg"
                size="70"
                color="#fff"
              />
            </div>
          </div>
          <!-- 限时购 -->
          <div class="timeWraper df" v-if="showLimtTime">
            <div class="left df">
              <div class="text f12 center">限时购&nbsp;</div>
              <div class="pri fw600 f24 cf" v-if="teaData.discountPrice">¥ {{teaData.discountPrice}}</div>
              <div
                class="oldpri f18 fw400 cf"
                style="text-decoration:line-through;line-height:24px;"
              >¥ {{selData.productPrice||defaultAttr.productPrice}}</div>
            </div>
            <div class="right">
              <p class="f15 fw400 ctea timetext">距离结束还有</p>
              <div class="timedown f28 fw400 ctea">
                <!-- <van-count-down :time="countTime"
                                format="HH:mm:ss">
                  <template v-slot="timeData">
                    <span class="timebg cf tac">{{ timeData.hours|formatTime }}</span>
                    <span class="ctea">:</span>
                    <span class="timebg cf tac">{{ timeData.minutes|formatTime }}</span>
                    <span class="ctea">:</span>
                    <span class="timebg cf tac">{{ timeData.seconds|formatTime }}</span>
                  </template>
                </van-count-down>-->
              </div>
            </div>
          </div>
          <div class="priWraper" v-else>
            <span class="ctea f28 fw600">¥ {{selData.productPrice||defaultAttr.productPrice}}</span>
            <div class="tuijian" @click="fenxiang" > <van-icon name="good-job-o" size=15px class="shouzhi"/>推荐好物</div>

          </div>

          <div class="timebefore df" v-if="selData.defaultStatus===1&&teaData.discountFlag===2">
            <div class="f10 van-hairline--surround tips">限时购预告</div>
            <p class="f15">{{teaData.endTime | formatStartTime}} 开抢 抢购价: ¥{{teaData.discountPrice}}</p>
          </div>
          <!-- 商品信息 -->
          <div class="pro-wrap" v-if="teaAttr[0]">
            <div class="content">
              <h3 class="title">{{teaProduct.productName}}</h3>
              <p class="desc">{{teaProduct.productDescription}}</p>
              <div class="price-wrap">
                  <div class="hhot" style="margin-right:10px;">
                  <i></i>
                  <span class="text">销量</span>
                  <span class="num">{{teaData.saleTotal||100}}</span>
                </div>
                <div class="pingfen" @click="jumpToDis">
                  <i></i>
                  <span class="text">品评分</span>
                  <span class="num">{{disData.synthesize||10}}</span>
                </div>
              </div>
            </div>
            <div
              class="state-wrap border-bottom"
              @click="handleClickShowlayer"
              style="margin-top:15px;"
            >
              <div class="left" v-if="selData.productStyle">
                <span class="lefttitle">已选</span>
                <span class="nameselect">{{selData.productStyle}}</span>
                <span class="nameselect" style="margin-right:10px;">数量:</span>
                <span class="nameselect">{{selData.num}}</span>
              </div>
              <div class="left" v-if="!selData.productStyle">
                <span class="selected">选择商品规格</span>
              </div>
              <div class="right">
                <div class="newtips" v-if="teaData.labelStatus"></div>
                <van-icon name="arrow" color="#999" size="20px" />
              </div>
            </div>
            <div class="address-wrap" @click="productArg=true">
              <div class="left attrd">
                <span class="name">
                  <i class="icon brand"></i>
                  <span class="text">{{teaProduct.productBrand}}</span>
                </span>
                <span
                  class="name"
                  v-if="teaProduct.productYear&&teaProduct.productYear!=='-'&&teaProduct.productType!==1"
                >
                  <i class="icon year"></i>
                  <span class="text">{{teaProduct.productYear}}</span>
                </span>
                <span
                  class="name"
                  v-if="teaProduct.textureMaterial&&teaProduct.textureMaterial!=='-'&&teaProduct.productType===1"
                >
                  <i class="icon caizhi"></i>
                  <span class="text">{{teaProduct.textureMaterial}}</span>
                </span>
                <span class="name" v-if="teaProduct.productPlace&&teaProduct.productPlace!=='-'">
                  <i class="icon address"></i>
                  <span class="text">{{teaProduct.productPlace}}</span>
                </span>
              </div>
              <div class="right">
                <van-icon name="arrow" color="#999" size="20px" />
              </div>
            </div>
          </div>
          <div class="fuwuWraper" @click="productfuwu=true" v-if="teaProduct">
            <div class="left">
              <span class="lefttitle fw400">服务</span>
              <div class="tagWraper df">
                <van-tag
                  size="large"
                  :round="true"
                  color="#FFE8E5"
                  v-if="teaProduct.dayDayRealSelect===1"
                >
                  <div class="tagsub df">
                    <i class="tag tui"></i>
                    <span class="f15 text">无忧退</span>
                  </div>
                </van-tag>
                <van-tag
                  size="large"
                  :round="true"
                  color="#FFE8E5"
                  v-if="teaProduct.dayDayRealSelect===1"
                >
                  <div class="tagsub df">
                    <i class="tag mai"></i>
                    <span class="f15 text">随心买</span>
                  </div>
                </van-tag>
                <van-tag
                  size="large"
                  :round="true"
                  color="#FFE8E5"
                  v-if="teaProduct.dayDayRealSelect===0"
                >
                  <div class="tagsub df">
                    <i class="tag baozhan"></i>
                    <span class="f15 text">正品保障</span>
                  </div>
                </van-tag>
                <van-tag
                  size="large"
                  :round="true"
                  color="#FFE8E5"
                  v-if="teaProduct.dayDayRealSelect===0"
                >
                  <div class="tagsub df">
                    <i class="tag tuikuan"></i>
                    <span class="f15 text">极速退款</span>
                  </div>
                </van-tag>
                <van-tag size="large" :round="true" color="#FFE8E5">
                  <div class="tagsub df">
                    <i class="tag you"></i>
                    <span class="f15 text">包邮</span>
                  </div>
                </van-tag>
              </div>
            </div>
            <van-icon name="arrow" color="#D45949" size="20px" />
          </div>
          <!-- 用户评价 -->
          <div class="eva-wrap"
               v-if="disData.commentId">
            <div class="titleWraper">
              <div>
                <span class="disstitle">茶评</span>
                <span class="dissnum">({{disData.totalCount}})</span>
              </div>
              <div class="lookAll"
                   @click="jumpToDis">查看全部</div>
            </div>
            <!-- <Discuss v-if="disData&&disData.commentId"
                     :dianzanShow="false"
                     :lineShow="false"
                     :itemdata="disData"
                     @videoPlay="videoPlay"
                     @videoExit="videoExit"></Discuss> -->
          </div>
          <!-- 上拉加载更多 -->
          <div class="pull"></div>
        </div>
        <div class="detail-img" ref="detail">
          <div class="bottomWraper" v-for="(img,index) in detailImg" :key="index">
            <image
              :src="img.productImage"
              alt
              style="width: 100%; height: 100%;display:block;vertical-align:text-bottom;"
              mode="widthFix"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 加入购物车 -->
    <!-- <div class="btnWrap">
      <van-icon
        :icon="teaData.collectionFlag===0?'like-o':'like'"
        custom-style="color:red;"
        @click="collgood"
      />
      <van-icon
        icon="cart-o"
        :info="userCartNum"
        @click="jumpToCart"
      />
     <van-button
    type="warning"
        text="加入购物车"
        class="shoppingbtn"
        @click="handleShowLayer('cart')"
      />
     <van-button
     type="danger"
        text="立即购买"
        class="btnshopping"
        @click="handleShowLayer('pay')"
      />
    </div>-->
    <div class="shopping-wrap border-top" v-if="gouwu">
      <div class="icon-wrap">
        <!-- <i class="iphone"
        @click="customchat"></i>-->
        <van-icon name="service-o"    @click="customchat" size=20px class=" i iphone" />
        <van-icon
        :name="teaData.collectionFlag===0?'like-o':'like'"
         size=20px
          class="i"
         
          @click="collgood"
        />
        <!-- <i class="like"
           @click="collclose"
        v-if="teaData.collectionFlag===1"></i>-->
        <!-- <i class="coll"
           @click="collgood"
        v-else-if="teaData.collectionFlag===0"></i>-->
        <!-- <i class="car"
           @click="jumpToCart">
          <span class="cartnum"
                v-if="userCartNum!==0">{{userCartNum}}</span>
        </i>-->
        <van-icon  @click="jumpToCart"  name= "cart-o" size=20px class=" i " :info="userCartNum"    />
      </div>
      <div class="btnWrap">
        <!-- <van-button type="default"
                    class="shopping"
                    @click="handleClickAddCart">加入购物车</van-button>
        <! <van-button type="default"
                    class="shopping"
                    :class="{'opacity':toCart}"
        v-show='toCart'>加入购物车</van-button>-->
        <!-- <van-button type="default"
                    class="pay"
                    style='float:right;'
        @click="handleClickPay">立即购买</van-button>-->
        <button
           @click="handleShowLayer('cart')"
         
          class="shopping"
          style="width:110px;border-radius:0;font-size:14px"
         
        >加入购物车</button>
        <button  @click="handleShowLayer('pay')" style="width:110px;border-radius:0;font-size:14px"  class="pay"  >立即购买</button>
      </div>
    </div>

    <!-- 选购商品类型 -->
    <!-- !!!!!!! -->

    <!-- <transition name="van-fade"> -->
    <layer
      ref="proSelected"
      :typeData="teaAttr"
      :teaProduct="teaProduct"
      :selData="selData"
      :type="typeLayer"
      :isShow="isShow"
      @userSelect="userSelect"
      @handleClickAddCart="handleClickAddCart"
      @handleClickPay="handleClickPay"
      @isShowToOther="isShowToOther"
    ></layer>

    <!-- </transition> -->
    <!-- 微信登录未绑定手机弹出绑定手机 -->
    <!-- !!!!!!!!! -->
    <!-- <PopBindphone ref="Popphone"></PopBindphone> -->
    <!-- 商品属性弹出 -->
    <transition name="van-fade">
      <div v-show="productArg" class="productArgWrap">
        <van-action-sheet :show="productArg" :overlay="false">
          <div class="proArgTitle">
            <span>产品参数</span>
            <i class="closeicon" @click="productArg=false"></i>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productBrand&&teaProduct.productBrand!=='-'"
          >
            <span>品牌</span>
            <span>{{teaProduct.productBrand}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.textureMaterial&&teaProduct.textureMaterial!=='-'"
          >
            <span>材质</span>
            <span>{{teaProduct.textureMaterial}}</span>
          </div>
          <div class="proArgInfo border-bottom" v-if="teaProduct.style&&teaProduct.style!=='-'">
            <span>风格</span>
            <span>{{teaProduct.style}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.dateManufacture&&teaProduct.dateManufacture!=='-'"
          >
            <span>生产日期</span>
            <span>{{teaProduct.dateManufacture}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productYear&&teaProduct.productYear!=='-'"
          >
            <span>年份</span>
            <span>{{teaProduct.productYear}}年</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productPlace&&teaProduct.productPlace!=='-'"
          >
            <span>产区</span>
            <span>{{teaProduct.productPlace}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productMaterial&&teaProduct.productMaterial!=='-'"
          >
            <span>原料</span>
            <span>{{teaProduct.productMaterial}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productStyle&&teaProduct.productStyle!=='-'"
          >
            <span>净重</span>
            <span>{{defaultAttr.productStyle}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productStorageCondition&&teaProduct.productStorageCondition!=='-'"
          >
            <span>贮藏条件</span>
            <span>{{teaProduct.productStorageCondition}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productCraft&&teaProduct.productCraft!=='-'"
          >
            <span>工艺</span>
            <span>{{teaProduct.productCraft}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productionLicense&&teaProduct.productionLicense!=='-'"
          >
            <span>生产许可证</span>
            <span>{{teaProduct.productionLicense}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.productStandards&&teaProduct.productStandards!=='-'"
          >
            <span>产品标准</span>
            <span>{{teaProduct.productStandards}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.factoryName&&teaProduct.factoryName!=='-'"
          >
            <span>厂名</span>
            <span>{{teaProduct.factoryName}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.factoryAddress&&teaProduct.factoryAddress!=='-'"
          >
            <span>厂址</span>
            <span>{{teaProduct.factoryAddress}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.numberApplicant&&teaProduct.numberApplicant!=='-'"
          >
            <span>适用人数</span>
            <span>{{teaProduct.numberApplicant}}</span>
          </div>
          <div
            class="proArgInfo border-bottom"
            v-if="teaProduct.qualityGuaranteePeriod&&teaProduct.qualityGuaranteePeriod!=='-'"
          >
            <span>保质期</span>
            <span>{{teaProduct.qualityGuaranteePeriod}}</span>
          </div>
        </van-action-sheet>
      </div>
    </transition>
    <!-- 商品保证弹出 -->
    <transition name="van-fade">
      <div v-show="productfuwu" class="productfuwuWrap">
        <van-action-sheet :show="productfuwu" :overlay="false">
          <div class="proArgTitle">
            <span>茶臻选基础保障</span>
            <i class="closeicon" @click="productfuwu=false"></i>
          </div>
          <div class="proArgInfo border-bottom" v-if="teaProduct.dayDayRealSelect===1">
            <p>无忧退</p>
            <p>凡是加入品鉴计划的商品，消费者收到茶叶后，可先冲泡品鉴装。对比茶叶品质后，再决定是否购买。若要退货，快递费由平台承担。</p>
          </div>
          <div class="proArgInfo border-bottom" v-if="teaProduct.dayDayRealSelect===1">
            <p>随心买</p>
            <p>为满足不同客户需求，加入“随心买”的产品可选择小规格（10g，20g）购买</p>
          </div>
          <div class="proArgInfo border-bottom">
            <p>正品保证</p>
            <p>商品支持正品保证服务</p>
          </div>
          <div class="proArgInfo border-bottom">
            <p>极速退款</p>
            <p>极速退款是为诚信会员提供的退款退货流程，收到退货包裹确认无误后，将在48小时内办理退款，退款原路退回</p>
          </div>
          <div class="proArgInfo border-bottom">
            <p>全场包邮</p>
            <p>平台全品类包邮服务已开启</p>
          </div>
        </van-action-sheet>
      </div>
    </transition>
    <!-- !!!!!!!!! -->
    <!-- <MyVideoDis :videoOption="videoOption"
                v-if="VideoShow"
    @videoExit="videoExit"></MyVideoDis>-->
  </div>
</template>

<script>
// import Discuss from "@/components/detail/Discuss";
import layer from "@/components/detail/layer";
import {
  getProduct,
  upCart,
  cartNum,
  upFoot,
  upColl,
  delColl
} from "@/api/product";
import { parseTime } from "@/utils/index";
import { mapGetters } from "vuex";

export default {
  data() {
    var that = this;
    return {
      current: 0,
      backBarActive: 0,
      productId: "",
      specialId: "",
      userCartNum: 0,
      gobackMyback: false,
      productArg: false, // 产品参数弹窗
      productfuwu: false, // 产品服务弹窗
      MyVideoControls: false,
      playerBtnShow: true,
      videoOption: {},
      VideoShow: false,
      countTime: 0,
      shartOption: {},
      downBtn: false,
      videoTemp: false,
      teaData: {},
      teaProduct: {},
      teaAttr: [],
      banner: [],
      detailImg: [],
      disData: {},
      videoSrc: "",
      selData: {},
      typeLayer: "2",
      isShow: false,
      xun:0,
      huan:null,
      mengceng:false,
      gouwu:true
    };
  },
  onLoad(option) {
    this.productId = option.id;
    this.productDetail();
    this.findUser();
  },
  methods: {
    parseTime,
    videoInit() {},
    onClickPlay() {
      this.$refs.mySwiper.swiper.slideTo(1);
      this.playerBtnShow = false; // 播放安宁
      this.MyVideoControls = true; // 显示默认的控制栏
    },
    videoPlay(val) {
      this.videoOption = val;
      this.VideoShow = true;
      console.log(val);
    },
    fenxiang(){
      console.log('666')
      this.mengceng= true
      this.gouwu= false
    },
    downloadImage(imageUrl) {  
      // 下载文件  
      wx.downloadFile({  
        url: imageUrl,  
        success: function (res) {  
          console.log("下载文件：success");  
          console.log(res);  
      
          // 保存图片到系统相册  
          wx.saveImageToPhotosAlbum({  
            filePath: res.tempFilePath,  
            success(res) {  
              console.log("保存图片：success");  
              wx.showToast({  
                title: '保存成功',  
              });  
            },  
            fail(res) {  
              console.log("保存图片：fail");  
              console.log(res);  
            }  
          })  
        },  
        fail: function (res) {  
          console.log("下载文件：fail");  
          console.log(res);  
        }  
      })  
    },
     
  
    onSavePicClick(){  
        console.log("onSavePicClick");  
        var downloadUrl = this.data.imageUrl;  
        console.log("downloadUrl=" + downloadUrl);  
      
        if (!wx.saveImageToPhotosAlbum) {  
          wx.showModal({  
            title: '提示',  
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'  
          })  
          return;  
        }  
      
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
        wx.getSetting({  
          success(res) {  
            console.log("getSetting: success");  
            if (!res.authSetting['scope.writePhotosAlbum']) {  
              console.log("1-没有授权《保存图片》权限");  
                
              // 接口调用询问  
              wx.authorize({  
                scope: 'scope.writePhotosAlbum',  
                success(){  
                  console.log("2-授权《保存图片》权限成功");  
                   util.downloadImage(downloadUrl);  
                },  
                fail(){  
                  // 用户拒绝了授权  
                  console.log("2-授权《保存图片》权限失败");  
                  // 打开设置页面  
                  wx.openSetting({  
                    success: function(data) {  
                      console.log("openSetting: success");  
                    },  
                    fail: function(data) {  
                      console.log("openSetting: fail");  
                    }  
                  });  
                }  
              })  
            } else {  
              console.log("1-已经授权《保存图片》权限");  
              util.downloadImage(downloadUrl)  
            }  
          },  
          fail(res) {  
            console.log("getSetting: success");  
            console.log(res);  
          }  
      
        })  
        
      } ,
 
    onShareAppMessage(){
      const img= this.xun
      const title = this.teaProduct.productName

         return {
            title: title,//自定义转发标题
            // path: '/page/user?id=123', //分享页面路径
           
            imageUrl:img//分享图片 宽高比 5:4
             
        }

    },
  

    quxiaomengceng(){
      this.mengceng=false
      this.gouwu= true
    },
      jumpToDis () {
      // this.$router.push({ name: 'prodis', query: { productId: this.productId } })
    },
    videoExit() {
      this.videoOption = {};
      this.VideoShow = false;
      if (this.videoSrc) {
        this.playerBtnShow = true;
      }
    },
    onChange(index) {
      this.current = index;
    },
    // 跳转全部评价
    handleClickMorePj() {
      this.$router.push("/evaluate");
    },
    // 添加购物车
    handleClickAddCart() {
      if (this.hasLogin) {
        this.addToCart();
      } else {
        this.jumpToLogin();
      }
    },
    handleShowLayer(val) {
      if (this.teaAttr.length > 1) {
        this.typeLayer = val;
        this.isShow = true;
      } else {
        if (val === "cart") {
          this.handleClickAddCart();
        } else if (val === "pay") {
          this.handleClickPay();
        }
      }
    },
    // 立即购买 跳转支付页面
    handleClickPay() {
      // if (getLocalStorage('mobileFlag') || this.mobileFlag) {
        console.log('1111')
      const orderData = [
        {
          productName: this.teaProduct.productName,
          productImage: this.teaProduct.productImage,
          productId: this.productId,
          productCount: this.selData.num,
          attrId: this.selData.attrId,
          productPrice: this.selData.productPrice,
          unitPrice: this.selData.productPrice
        }
      ];
      if (this.hasLogin) {
        uni.navigateTo({
          url: `/pages/pay/paysure?orderData=${JSON.stringify(
            orderData
          )}&payType=detail`
        });
      } else {
        this.jumpToLogin();
      }
    },
    // 加入购物车
    addToCart() {
      const option = {
        orderDetailStr: `${this.productId}&${this.selData.num}&${this.selData.attrId}`,
        userId: this.user.userId
      };
      console.log(option);
      upCart(option).then(res => {
        if (res.code === 10000) {
          uni.showToast({
            title: "添加购物车成功",
            duration: 2000
          });
          const productId = { productId: this.productId };
          setTimeout(() => {
            this.findUser();
          }, 100);
        } else {
          this.$toast(res.message);
        }
      });
    },
    isShowToOther(arg) {
      this.isShow = arg === 1 ? false : true;
    },
    // 添加收藏
    collgood() {
      if (this.hasLogin) {
        if (this.teaData.collectionFlag === 1) {
          this.upCollClose();
        } else {
          this.upgoodColl();
        }
      } else {
        this.jumpToLogin();
      }
    },
    jumpToLogin() {
      uni.navigateTo({
        url: `/pages/login/login`
      });
    },
    upgoodColl() {
      const option = {
        userId: this.user.userId,
        productId: this.productId,
        productPrice: this.selData.productPrice
          ? this.selData.productPrice
          : this.teaAttr[0].productPrice
      };
      upColl(option).then(res => {
        if (res.code === 10000) {
          uni.showToast({
            title: "收藏成功",
            duration: 1500
          });
          this.teaData.collectionFlag = 1;
        } else {
          this.$toast(res.message);
        }
      });
    },
    collclose() {
      const option = {
        userId: "",
        productId: this.productId,
        delType: "0"
      };
      option.userId = "";
      this.upCollClose(option);
    },
    upCollClose() {
      const option = {
        userId: this.user.userId,
        productId: this.productId,
        delType: "0"
      };
      delColl(option).then(res => {
        if (res.code === 10000) {
          uni.showToast({
            title: "取消成功",
            duration: 1500
          });
          this.teaData.collectionFlag = 0;
        }
      });
    },
    // 获取购物车数量 先拿取用户信息,未登录就不在请求接口  当中 会添加本商品到足迹
    findUser() {
      if (this.hasLogin) {
        cartNum({ userId: this.user.userId }).then(res => {
          if (res.code === 10000) {
            this.userCartNum = res.data.count;
          }
        });
        // 添加到足迹
        if (this.productId) {
          upFoot({ userId: this.user.userId, productId: this.productId }).then(
            res => {}
          );
        }
      }
    },
    // 点击购物车icon跳转到购物车页面
    jumpToCart() {
      if (this.hasLogin) {
        wx.switchTab({
          url: `/pages/cart/cart`
        });
      } else {
        this.jumpToLogin();
      }
    },
    showpopcustom() {
      this.$refs.popcustom.show = true;
    },
    // 显示商品属性选择
    handleClickShowlayer() {
      this.typeLayer = "2";
      this.isShow = true;
      console.log("object");
      // this.$refs.proSelected.toggle()
    },
    // 显示绑定手机
    handleClickPopBindphone() {
      this.$refs.PopBindphone.toggle();
    },
    // 返回到顶部
    scrollTotop() {
      this.mescroll.scrollTo(0);
    },
    // 滑动到商品详情
    scrollTodetail() {
      const goodHeight = this.$refs.goodWrap.clientHeight;
      this.mescroll.scrollTo(goodHeight);
    },
    // 用户选择的商品属性
    userSelect(selData) {
      this.selData = Object.assign({}, selData);
      // this.selData.num = num
    },
    // 获取商品详情
    productDetail() {
      const option = {
        productId: this.productId,
        specialId: this.specialId,
        userId: this.user.userId
      };
      getProduct(option)
        .then(res => {
          if (res.code === 10000) {
            try {
              this.teaData = res.data;
              this.teaProduct = res.data.teaProduct;
              this.teaAttr = res.data.teaAttrProduct;
              this.banner = res.data.teaProductBannerTop;
              this.detailImg = res.data.teaProductBannerBottom;
              this.disData = res.data.productComment;
              this.videoSrc = res.data.productVideo;
              this.huan=this.banner.length;
              this.xun = this.banner[0].productImage
              console.log(this.banner[0].productImage);
          

              // this.videoInit()
              // this.countTime = this.teaData.endTime - new Date().getTime()
              this.teaAttr.forEach(item => {
                item.num = 1;
                if (item.defaultStatus === 1) {
                  // item.num = 1
                  this.selData = item;
                  this.defaultAttr = item;
                  this.$refs.proSelected.isSelect = Object.assign({}, item);
                }
              });
              if (res.data.teaAttrProduct.length === 1) {
                this.selData = res.data.teaAttrProduct[0];
              }
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    productId(newval) {
      if (!newval) {
        this.$toast("产品ID不能为空");
      }
    }
  },
  computed: {
    shareshow() {
      return false;
    },
    showLimtTime() {
      if (this.selData && this.defaultAttr) {
        return (
          ([0, 1].includes(this.selData.defaultStatus)
            ? this.selData.defaultStatus === 1
            : this.defaultAttr.defaultStatus === 1) &&
          this.teaData.discountFlag === 1
        );
      } else {
        return false;
      }
    },
    shoTagPlan() {
      // return this.teaProduct.productType === 0 && this.teaAttr.length > 1
      return false;
    },
    showTagBuy() {
      // return this.teaProduct.productType === 0 && this.teaAttr.length > 1
      return false;
    },
    toCart() {
      return false;
    },
    ...mapGetters(["user", "hasLogin"])
  },
  filters: {
    formatTime(val) {
      return val < 10 ? `0${val}` : val;
    },
    formatStartTime(val) {
      const today = parseTime(new Date(), "{m}-{d}");
      const dateformat = parseTime(val, "{m}-{d}");
      const timeformat = parseTime(val, "{h}:{i}");
      if (today === dateformat) {
        return `今天${timeformat}`;
      } else if (
        parseInt(dateformat.split("-")[1]) - parseInt(today.split("-")[1]) ===
        1
      ) {
        return `明天${timeformat}`;
      } else {
        return `${dateformat} ${timeformat}`;
      }
    }
  },
  components: {
    // backbar,
    // jump,
    // // BackShare,
    // // Back,
    // // PopCustom,
  // xiangqing,
    layer,

    //  Discuss
    // // PopBindphone,
    
    // // MescrollVue,
    // MyVideoDis
    // // videoPlayer
  }
};
</script>

<style lang="scss" scoped>
.mengceng{
  display: flex;
    position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;

}
.mengcengtu{
  display: flex;
  flex: 40px 1 100px;
   flex-direction:column;
 justify-content: center;
 align-items: center;
  width: 300px;
  height: 450px;
position: absolute;
top:25px;
background-color: #FFFFFF

}
.mengcengtitle{
  display: flex;
  justify-content: center;
  width:300px;
  height: 35px;
  font-size: 16px;text-align: center;
  line-height: 35px;
  display: flex;
  background-color: #F2F2F2;
  padding-top:5px;
  color: #222222;
  font-weight: 400;

}
.mengcengtitle image{
  width:35px;
  height: 35px;
  vertical-align: middle
}
.mengcengimg{
  width: 300px;
  height: 320px;
  background-color: #ffffff;
  padding-top:10px;

}
.mengcengimg image{
  width: 270px;
  height: 270px;
  position: absolute;
  left:10px;
  right:10px;
  // top:10px;
  // bottom: 10px;

}
.mengcengzi{
  display: flex;
  flex: 2 1 ;
  // margin-top: 15px

margin-bottom: 10px;
}
.mengcengzileft{
  display: flex;
  // visibility: 
  flex-direction:column;
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  width: 180px;
  overflow:hidden; 

text-overflow:ellipsis;

display:-webkit-box; 

-webkit-box-orient:vertical;

-webkit-line-clamp:2; 
// margin:20px 0;
}
.redziti{
  font-weight: 600;
color: #D45949;
font-size: 28px;
}
.mengcengziright image{
width: 80px;
height: 80px;

// margin:20px;
margin-bottom: 10px;
}
.fenxiangtu{
  display: flex;
  flex-direction:column;
  width:100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  background:rgba(241,241,241,1);
border-radius:20px 20px 0px 0px;
}

.fenxiangbaocun{
  display: flex;
  flex-direction: row;
  width:100%;
  height: 65px;
  // justify-content: space-between;
font-size: 16px;
}
.hhh{
  // width:85px;
  height: 65px;
  margin:0 60px;
  font-size: 14px;
  // display: flex;
    line-height: 30px;
  text-align: center;

}
.fenxiangbaocun image{
  width: 40px;
  height: 40px;

}
.haoyou{
  text-align: center;
  line-height: 20px;
  height:20px;
  width: 60px;
  border:0px solid white;
  border-radius:0px;
  font-size:14px;
}
.haoyou ::after {
    border-radius: 0;
     border:0px solid white;
}
.quxiao{
  // margin-bottom: 0px
  // width:20px;
  text-align: center;
  line-height: 35px;
}
.shouzhi{
  position: relative;
  top:2px
}
.tuijian{
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right:5px;
  text-align: center;
  line-height: 50px;

}
.iphone{
  
   margin: 0 12px;
        // display: inline-block;
        // vertical-align: top;
        // width: 20px;
        // height: 20px;
        // background-size: 20px 20px;
        // background-position: center center;
        // background-repeat: no-repeat;
  
  
}
.shopping-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 19;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 40px;
    background-color: #ffffff;
    .icon-wrap {
      flex: 1;
      padding: 0 0 0 15px;
      display: flex;
      align-items: center;
        width: 40px;
        height: 40px;
       
      .i {
        margin: 0 12px;
        display: inline-block;
        vertical-align: middle;
      
        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;
        
        //   &.iphone {
        //   @include bg-image('detail/iphone');
        //   width: 100%;
        //   height: 100%;
        // }
        }
      }
    }
    button{
    border-radius: 0;
}
button::after {
    border-radius: 0;
    border:0px solid white;
}
  
    .btnWrap {
      flex: 0 0 220px;
      display: flex;
      width: 220px;
      height: 40px;
    }
    .btnWrap /deep/ .van-button {
      border-radius: 0;
        width: 110px;
      height: 40px;
    }
    .pay{
     background:linear-gradient(90deg,rgba(245,109,104,1),rgba(240,125,110,1));
    color:white;
     text-align: center;
      line-height: 40px

    }
    .shopping{
     background:linear-gradient(90deg,rgba(243,141,95,1),rgba(250,157,101,1));
      color:white;
      text-align: center;
      line-height: 40px;
      border-radius: 0px;
    }
    

.OutWrap {
  /deep/ .van-icon-like {
    color: #d45949;
  }
  .downBtnWrap {
    width: 90px;
    height: 46px;
    @include bg-image("common/downbtn");
    right: 0;
    top: 20%;
    transform: translateY(-50%);
    z-index: 999;
  }
  .detail-wrap {
    z-index: 10;
    background-color: #f2f2f2;
    font-weight: normal;
    .img-wrpper {
      // width: 100%;
      height: 375px;

      background-position: 50% 50%;
      background-size: 120%;
      .swiper-slide {
        .videoFast {
          object-fit: contain;
          background: #000;
        }
        *::-webkit-media-controls-panel {
          display: none !important;
          -webkit-appearance: none;
        }

        /* Old shadow dom for play button */

        *::--webkit-media-controls-play-button {
          display: none !important;
          -webkit-appearance: none;
        }

        /* New shadow dom for play button */

        /* This one works */

        *::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }
      }
      img {
        width: 100%;
        height: 375px;
      }
      .custom-indicator {
        position: absolute;
        right: 50%;
        bottom: 5px;
        z-index: 12;
        padding: 3px 9px;
        box-sizing: border-box;
        transform: translate(50%, 0);
        font-size: 14px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        /deep/ .swiper-pagination {
          position: static;
        }
      }
      .playerWraper {
        position: absolute;
        // bottom: 50px;
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      /deep/ #videoSlide {
        width: 375px;
        height: 375px;
        background: rgba(0, 0, 0, 1);
      }
    }
    .timeWraper {
      width: 100%;
      height: 60px;
      background-size: cover;
      @include bg-image("detail/timewraper");
      align-items: center;
      justify-content: space-between;
      .left {
        flex: 0 0 200px;
        justify-content: space-between;
        align-items: center;
        .text {
          width: 49px;
          height: 22px;
          line-height: 22px;
          color: #fe7e71;
          text-align: center;
          background-size: cover;
          @include bg-image("detail/text");
        }
      }
      .right {
        flex: 0 0 100px;
        height: 100%;
        .timetext {
          margin: 5px 0 4px;
        }
        .timedown {
          .timebg {
            display: inline-block;
            width: 22px;
            height: 22px;
            line-height: 22px;
            background-size: cover;
            @include bg-image("detail/timebg");
          }
        }
      }
    }
    .priWraper {
      padding: 15px 15px 0;
      background: #fff;
      display: flex
    }
    .timebefore {
      padding: 15px 15px 0;
      background: #fff;
      color: #e8b563;
      align-items: center;
      .tips {
        padding: 1px 15px;
        margin-right: 10px;
        &.van-hairline--surround:after {
          border: 1px solid #e8b563;
          border-radius: 50px;
        }
      }
    }
    .pro-wrap {
      .content {
        padding: 15px;
        background: #fff;
        &:before {
          border-color: #e8e8e8;
        }
        .title {
          margin-bottom: 10px;
          font-size: 18px;
          line-height: 22px;
          font-weight: bold;
        }
        .desc {
          line-height: 22px;
          font-size: 14px;
          color: #666;
        }
        .price-wrap {
          font-size: 18px;
          color: #d45949;
          display: flex;
          justify-content:  flex-start;
          align-items: center;
          .price {
            margin-left: 5px;
            font-size: 24px;
          }
           .hhot {
            display: flex;
            align-items: center;
            i {
              width: 10px;
              height: 10px;
              @include bg-image("detail/hot");
              background-size: cover;
              margin-bottom: 1px;
            }
            .text {
              color: #999;
              font-size: 12px;
              margin: 0 5px;
            }
            .num {
              color: #333;
              font-size: 12px;
            }
          }
          .pingfen {
            display: flex;
            align-items: center;
            i {
              width: 10px;
              height: 10px;
              @include bg-image("detail/star");
              background-size: cover;
              margin-bottom: 1px;
            }
            .text {
              color: #999;
              font-size: 12px;
              margin: 0 5px;
            }
            .num {
              color: #333;
              font-size: 12px;
            }
          }
        }
      }
    }
    .state-wrap,
    .address-wrap {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      height: 43px;
      background: #fff;
      .left {
        font-size: 15px;
        display: flex;
        align-items: center;
        width: 80%;
        &.attrd {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .name {
            .text {
              font-size: 15px;
              line-height: 18px;
              color: #333;
            }
          }
        }
        .lefttitle {
          color: #999;
          font-size: 15px;
          flex: 0 0 50px;
        }
        .nameselect {
          margin-right: 15px;
          font-size: 15px;
          flex: 0 0 auto;
        }
        .name {
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 16px;
            height: 16px;
            background-size: cover;
            &.brand {
              @include bg-image("detail/brand");
            }
            &.year {
              @include bg-image("detail/year");
            }
            &.caizhi {
              @include bg-image("detail/caizhi");
            }
            &.address {
              @include bg-image("detail/address");
            }
          }
          .text {
            margin-top: 0.01px;

            vertical-align: top;
            white-space: nowrap;
            font-weight: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 31px;
            font-size: 12px;
          }
          &:nth-child(2) {
            margin: 0 30px 0 30px;
          }
        }
        .selected {
          margin-right: 15px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .newtips {
          width: 25px;
          height: 10px;
          @include bg-image("detail/tag");
          background-size: cover;
        }
      }
    }
    .address-wrap {
      .name {
        font-size: 0;
        .icon {
          margin-right: 15px;
        }
      }
      .text {
        font-size: 15px;
        color: #333;
        font-weight: normal;
      }
    }
  }
  .fuwuWraper {
    display: flex;

    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 15px;
    background: #ffe8e5;
    .tagWraper {
      // align-items: center;
      .tagsub {
        justify-content: space-between;
        .tag {
          width: 17px;
          height: 17px;
          margin-right: 7px;
          background-size: cover;
          display: inline-block;
          &.baozhan {
            @include bg-image("detail/baozhan");
          }
          &.tuikuan {
            @include bg-image("detail/tuikuan");
          }
          &.tui {
            @include bg-image("detail/tui");
          }
          &.mai {
            @include bg-image("detail/mai");
          }
          &.you {
            @include bg-image("detail/you");
          }
        }
        .text {
          // height: 15px;
          line-height: 16px;
          color: #d45949;
        }
      }
    }
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      color: #d45949;
      .lefttitle {
        font-size: 15px;
        flex: 0 0 40px;
      }
      .name {
        margin-right: 15px;
        font-size: 15px;
        line-height: 16px;
      }
      .plan {
        position: relative;
        margin-right: 25px;
        .planImg {
          @include bg-image("detail/tag");
          background-size: cover;
          width: 25px;
          height: 10px;
          top: -20px;
          right: -15px;
          position: absolute;
        }
      }
    }
    .eval-wrap {
      padding-left: 10px;
      overflow: hidden;
      .title {
        float: left;
        font-size: 14px;
        font-weight: 700;
      }
      .sub {
        float: right;
        font-size: 12px;
      }
    }
    .content {
      width: 100%;
      height: 90px;
      .group {
        height: 90px;
        white-space: nowrap;
        .item {
          box-sizing: border-box;
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
          padding: 10px;
          width: 350px;
          height: 100%;
          background-color: #fff;
          .info {
            width: 100%;
            .img {
              display: inline-block;
              vertical-align: top;
              width: 33px;
              height: 33px;
              background-color: #000000;
            }
            .name-wrap {
              margin-left: 10px;
              display: inline-block;
              vertical-align: top;
              .name {
                margin-bottom: 4px;
                line-height: 19px;
              }
              .icon-wrap {
                display: block;
                width: 100%;
                height: 10px;
                background-color: red;
              }
            }
          }
          .text {
            margin: 20px 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .more {
      float: right;
      padding: 10px;
      margin: 5px 0.01px 0 0;
    }
  }
  .eva-wrap {
    margin-top: 15px;
    .titleWraper {
      padding: 15px 13px 15px 14px;
      font-weight: normal;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      .disstitle {
        color: #333;
      }
      .dissnum {
        color: #666;
      }
      .lookAll {
        color: #666;
        font-size: 14px;
      }
    }
  }
  .rele-wrap {
    padding-left: 10px;
    .title {
      margin: 10px 0 14px 5px;
      font-size: 14px;
      font-weight: 700;
    }
  }
  .pull {
    width: 125px;
    height: 23px;
    margin: 15px auto;
    background-size: cover;
    @include bg-image("detail/detailtitle");
  }
  .detail-img {
    min-height: 250px;
    line-height: 0;
  }
  // .shopping-wrap {
  //   position: fixed;
  //   left: 0;
  //   bottom: 0;
  //   z-index: 19;
  //   display: flex;
  //   flex-flow: row nowrap;
  //   width: 100%;
  //   height: calc(48px + constant(safe-area-inset-bottom));
  //   background-color: #ffffff;
  //   .icon-wrap {
  //     flex: 1;
  //     padding: 0 0 0 15px;
  //     display: flex;
  //     align-items: center;
  //     i {
  //       margin: 0 10px;
  //       display: inline-block;
  //       vertical-align: top;
  //       width: 20px;
  //       height: 20px;
  //       background-size: 20px 20px;
  //       background-position: center center;
  //       background-repeat: no-repeat;
  //       &.iphone {
  //         @include bg-image("detail/iphone");
  //       }
  //       &.coll {
  //         @include bg-image("detail/coll");
  //       }
  //       &.like {
  //         @include bg-image("detail/like");
  //       }
  //       &.car {
  //         position: relative;
  //         @include bg-image('detail/car');
  //         .cartnum {
  //           position: absolute;
  //           top: -8px;
  //           right: -6px;
  //           display: block;
  //           width: 16px;
  //           height: 16px;
  //           line-height: 16px;
  //           background: #ea6f5f;
  //           border-radius: 50%;
  //           text-align: center;
  //           color: #fff;
  //           font-size: 12px;
  //         }
  //       }
  //     }
  //   }
  //   .btnWrap {
  //     flex: 0 0 220px;
  //     display: flex;
  //   }
  //   .btnWrap /deep/ .van-button {
  //     border-radius: 0;
  //   }
  //   .btnWrap /deep/ .van-button--normal {
  //     flex: 0 0 110px;
  //     height: 49px;
  //     color: #fff;
  //     font-size: 18px;
  //     padding: 0;
  //     &.shopping {
  //       background-color: #ea6f5f;
  //     }
  //     &.opacity {
  //       opacity: 0;
  //     }
  //     &.pay {
  //       background-color: #d45949;
  //     }
  //   }
  //   .btnWrap /deep/ .van-button--default {
  //     border: 0;
  //   }
  // }
  .selected-wrapper {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    .selected-item {
      position: relative;
      margin: 0 10px;
      padding: 2px 20px;
      font-size: 15px;
      color: #666;
      font-family: PingFang-SC-Regular;
      &.active {
        font-weight: 600;
        font-size: 18px;
        color: #333;
        // @include under();
      }
    }
  }
  .productArgWrap {
    font-size: 15px;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 22;
    background: rgba(0, 0, 0, 0.5);
    .proArgTitle {
      color: #333;
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: relative;
      .closeicon {
        display: block;
        position: absolute;
        right: 15px;
        top: 15px;
        width: 20px;
        height: 20px;
        padding: 5px;
        box-sizing: border-box;
        @include bg-image('detail/closebtn');
        background-size: 74%;
        background-repeat: no-repeat;
        font-weight: normal;
      }
    }
    .proArgInfo {
      height: 44px;

      margin: 0 10px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      white-space: nowrap;
      :first-child {
        color: #999;
        width: 25%;
      }
      :last-child {
        width: 75%;
        color: #333;
        font-weight: normal;
        white-space: normal;

        text-overflow: ellipsis;
      }
    }
  }
  .productArgWrap /deep/ .van-action-sheet__content {
    padding-bottom: 25px;
  }
  .productfuwuWrap {
    font-weight: normal;
    font-size: 15px;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 22;
    background: rgba(0, 0, 0, 0.5);
    .proArgTitle {
      color: #333;
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: relative;
      .closeicon {
        display: block;
        position: absolute;
        right: 15px;
        top: 15px;
        width: 20px;
        height: 20px;
        padding: 5px;
        box-sizing: border-box;
        @include bg-image('detail/closebtn');
        background-size: 74%;
        background-repeat: no-repeat;
        font-weight: normal;
      }
    }
    .proArgInfo {
      margin: 0 10px;
      padding: 0 5px;
      white-space: nowrap;
      :first-child {
        color: #333;
        width: 100%;
        font-size: 18px;
        padding-top: 15px;
      }
      :last-child {
        width: 100%;
        color: #999;
        font-size: 15px;
        line-height: 16px;
        font-weight: normal;
        white-space: normal;
        padding: 15px 0;

        text-overflow: ellipsis;
      }
    }
  }
}
.palyer {
  width: 2.5px;
  height: 2.5px;
  overflow: hidden;
  position: relative;

  z-index: 30;
  margin: 0 10px 10px 0;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  .btn {
    position: absolute;
    width: 17px;
    height: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // @include bg-image('btnplayer');
    background-size: cover;
  }
  video {
    width: 100%;
    width: 350px;
    height: 350px;
  }
}
.videofixed {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  video {
    // width: 90%;
    // height: 90%;
    width: 350px;
    height: 350px;
  }
  .exitBtn {
    margin: 0 auto;
    width: 80px;
    text-align: center;
    margin-top: 15px;
    font-size: 15px;
    color: #333;
    letter-spacing: 0;
    padding: 10px 15px;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 2.5px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 15px;
  }
}
</style>