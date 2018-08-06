<template>
  <div class="main-content" v-if="show">
    <div class="title">
      <img :src="headimgurl" alt="">
      <span>您正在为 [心迹教育] 会员卡充值</span>
    </div>
    <!-- <div class="desc">
      <span>充值金额</span>
      <span>会员福利</span>
    </div> -->
    <ul class="re_box">
      <li class="re_item" v-for="item in quotalist" @click="createOrder(item.id)">
        <div class="discount">
          <span>充值 {{ item.amount }}元</span>
        </div>
        <div class="total">
          <div>
            <div class="total_number">到账 {{ item.amount + item.giftAmount }}元</div>
            <div class="gift">{{ item.quotaDesc }}</div>
          </div>
          <div class="pay_btn arrow">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import CourseItem from 'components/CourseItem'

  import { Alert, XInput, Flexbox, FlexboxItem } from 'vux'

  export default {
    components: {
      CourseItem,
      XInput,
      Flexbox,
      FlexboxItem,
      Alert
    },
    data() {
      return {
        salesId: '',
        rechargeId: '',
        show: true,
        info: {},
        quotalist: [],
        payConfig: '',
        configLoad: false,
        JSBridgeReady: false
      }
    },
    computed: {
      headimgurl() {
        try {
          if (this.info.childrenList[0].headimgUrl) {
            return this.info.childrenList[0].headimgUrl
          }
          if (this.info.childrenList[0].sex === null) {
            return '/static/img/boy.png'
          } else {
            return this.info.childrenList[0].sex ? '/static/img/girl.png' : '/static/img/boy.png'
          }
        } catch (error) {
          return '/static/img/boy.png'
        }
      }
    },
    created() {
      var salesId = parseInt(this.$route.params.salesId)
      if (isNaN(salesId) || salesId < 0) {
        salesId = 0
      }
      this.salesId = salesId
      // this.$api.order.getOrderDetail(orderId).then((res) => {
      //   this.show = true
      //   this.order = res
      //   this.getPayConfig()
      // }).catch((e) => {
      //   this.showErrorMsg('无效订单')
      // })
      this.getQuotalist()
      this.hasJSBridge()
      this.getChildrenInfo()
    },
    methods: {
      hasJSBridge() {
        var _this = this
        if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
          _this.setJSBridge()
        } else {
          if (document.addEventListener) {
            window.document.addEventListener('WeixinJSBridgeReady', _this.setJSBridge, false)
          } else if (document.attachEvent) {
            window.document.attachEvent('WeixinJSBridgeReady', _this.setJSBridge)
            window.document.attachEvent('onWeixinJSBridgeReady', _this.setJSBridge)
          }
        }
      },
      setJSBridge() {
        this.JSBridgeReady = true
      },
      getChildrenInfo() {
        this.$api.user.getChildrenInfo().then(data => {
          this.show = true
          this.info = data
        })
      },
      getPayConfig(rechargeId) {
        this.$api.user.recharge.getPayConfig(rechargeId)
          .then((res) => {
            this.payConfig = res
            this.configLoad = true
            this.pay()
          }).catch((error) => {
            this.showErrorMsg(this.ErrorMap[error.msg] || '获取配置失败')
          })
      },
      createOrder(quotaId) {
        var params = {
          quotaId
        }
        if (this.salesId) params.salesId = this.salesId
        this.$api.user.recharge.createRechargeOrder(params).then(res => {
          this.rechargeId = res.rechargeId
          this.getPayConfig(res.rechargeId)
        })
      },
      pay() {
        // var config = {"code":0,"msg":"Success","data":"{\"appId\":\"wxfd70a1592861c509\",\"timeStamp\":\"1488363866\",\"nonceStr\":\"58b6a15a271be\",\"package\":\"prepay_id=\",\"signType\":\"MD5\",\"paySign\":\"E808F9D9F58B60245D6C436B5951E642\"}"}
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': this.payConfig.appId,
            'timeStamp': String(this.payConfig.timeStamp),
            'nonceStr': this.payConfig.nonceStr,
            'package': this.payConfig.package,
            'signType': this.payConfig.signType,
            'paySign': this.payConfig.paySign
          }, (res) => {
            switch (res.err_msg) {
              case 'get_brand_wcpay_request:cancel':
                this.payFail()
                break
              case 'get_brand_wcpay_request:fail':
                this.showErrorMsg('支付失败！（' + res.err_desc + '）')
                // this.$xLog(res.err_desc)
                break
              case 'get_brand_wcpay_request:ok':
                this.$api.user.recharge.refreshOrderStatus(this.rechargeId).then(res => {
                  this.$router.push('/parent/user/recharge_re')
                }).catch(() => {
                  this.$router.push('/parent/user/recharge_re')
                })
                // this.paySuccess()
                break
              default:
                this.payFail()
                // alert(JSON.stringify(res));
                break
            }
          }
        )
      },
      payFail() {
        this.$vux.alert.show({
          content: '支付失败，请重新支付！',
          buttonText: '知道了'
        })
      },
      getQuotalist() {
        this.$api.user.recharge.getQuotalistBySalesId(this.salesId).then(data => {
          this.quotalist = data
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    display: flex;
    align-items: center;
    background: #40E0D0;
    font-size: 14px;
    color: #fff;
    height: 5.8rem;
    img{
      width: 2.6rem;
      height: 2.6rem;
      margin: 0 0.7rem 0 1rem;
    }
    span{
      font-size: 16px;
    }
  }
  /* .desc{
    display: flex;
    justify-content: space-around;
    margin: 1rem 0.7rem 0.7rem 0.7rem;
    font-size: 0.875rem;
    color: #C5C5C5;
    span:nth-of-type(1){
      flex-grow: 3;
      text-align: center;
    }
    span:nth-of-type(2){
      flex-grow: 8;
      text-align: center;
      padding: 0 1rem;
    }
  } */
  .re_item:active{
    opacity: 0.3;
  }
  .re_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.75rem 0.7rem;
    text-align: center;
    background: url('/static/img/recharge/bg_right.png') no-repeat;
    background-size: cover;
    .total{
      width: 60%;
      padding: 1.15rem 1rem;
      background: url('/static/img/recharge/bg_left.png') no-repeat;
      background-size: cover;
      min-height: 3.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      div:nth-of-type(1){
        width: 100%;
      }
      .total_number{
        font-size: 1.2rem;
        color: #F5A623;
      }
      .gift{
        font-size: 0.89rem;
        color: #4A90E2;
      }
      .pay_btn{
        font-size: 0.81rem;
        color: #fff;
        padding: 0.35rem 0.57rem;
      }
    }
    .discount{
      width: 40%;
      padding: 1rem 0;
      span{
        color: #D0021B;
        font-size: 0.95rem;
      }
    }
  }  
  .arrow::after{
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    -ms-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 20px;
  }
</style>