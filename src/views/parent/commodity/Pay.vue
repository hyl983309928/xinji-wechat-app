<template>
  <div class="main-content" v-if="show">
    <div class="cl-module">
      <div class="cl-m-header">
        订单信息
      </div>
      <div class="cl-m-body">
        <div class="order-field">
          <span>订单编号</span>&nbsp;
          <span>{{ orderId }}</span>
        </div>
        <div class="order-field">
          <span>商品名称</span>&nbsp;
          <span>{{ order.goodsName }}</span>
        </div>
        <div class="order-field">
          <span>商品类型</span>&nbsp;
          <span>{{ courseTypeMap[order.goodsInfo.goodsType] }}</span>
        </div>
        <div class="order-field" v-if="order.goodsInfo.goodsType==2">
          <span>课程数量</span>&nbsp;
          <span>{{order.goodsInfo.original.courseList.length}} 节</span>
        </div>
        <div class="order-field" v-if="order.goodsInfo.goodsType==2">
          <span>开课时间</span>&nbsp;
          <span>{{order.goodsInfo.original.lesson_time}}</span>
        </div>
        <div class="order-field">
          <span>订单金额</span>&nbsp;
          <span>{{ order.price }} 元</span>
        </div>
        <div class="order-field" v-if="order.goodsInfo.goodsType==1 || order.goodsInfo.goodsType==3">
          <span>上课时间</span>&nbsp;
          <span>{{order.goodsInfo.goodsType==3 ? TimeModel.editStTime(order.goodsInfo.original.lesson_time,order.goodsInfo.original.lesson_time_end):TimeModel.editTime(order.goodsInfo.original.lesson_time, order.goodsInfo.original.duration)}}</span>
        </div>
        <div class="order-field" v-if="order.goodsInfo.goodsType==1 || order.goodsInfo.goodsType==3">
          <span>上课地点</span>&nbsp;
          <span>{{order.goodsInfo.goodsType==3?order.goodsInfo.original.lesson_location:backCourseSite(order.goodsInfo.original.lesson_location,order.goodsInfo.original.channelName) }}</span>
        </div>
        <!-- <div class="order-field">
          <span>手机号码</span>&nbsp;
          <span>{{order.telephone}}</span>
        </div> -->
        <div class="order-field">
          请在 <span class="lanma-color">15分钟</span> 内完成支付，超时订单将会失效。
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        选择支付方式
      </div>
      <flexbox orient="vertical" class="type-select">
        <flexbox-item>
          <label class="demo--label" :style="{ color: noEnough ? '#ccc' : '' }">
            <input class="demo--radio" type="radio" name="paytype" value="balance" v-model="paytype" :disabled="noEnough">
            <span class="demo--radioInput"></span>
            <img class="pay-icon" src="/static/img/lanmapay.png" alt="">
            余额支付（剩余¥ {{ remainder }}
            <span v-if="noEnough">，余额不足</span>）
          </label>
        </flexbox-item>
        <flexbox-item>
          <label class="demo--label">
            <input class="demo--radio" type="radio" name="paytype" value="wx" v-model="paytype">
            <span class="demo--radioInput"></span>
            <img class="pay-icon" src="/static/img/wxpay.png" alt=""> 
            微信支付
          </label>
        </flexbox-item>
      </flexbox>
    </div>
    <button class="page-submit-btn" @click="pay" v-if="configLoad && JSBridgeReady">确认支付 &nbsp;¥ {{ order.price }}</button>
  </div>
</template>

<script>
import CourseItem from 'components/CourseItem'
import TimeModel from 'lanmaLib/time'
import { Alert, XInput, Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    CourseItem,
    XInput,
    Flexbox,
    FlexboxItem,
    Alert
  },
  data () {
    return {
      show: false,
      orderId: '',
      course: {},
      paytype: 'wx',
      remainder: 0,
      noEnough: false,
      order: {},
      payConfig: {},
      phone: '',
      configLoad: false,
      JSBridgeReady: false,
      courseTypeMap: ['', '体验坊', '课程组合', '游学营'],
      ErrorMap: {'ER_ORDER_HAS_EXPIRE': '支付超时', 'ER_CREATE_WX_ORDER_FAILED': '创建订单失败', 'ER_HAS_PURSER_COURSE': '不可重复购买'},
      TimeModel
    }
  },
  computed: {},
  created () {
    var orderId = this.$route.params.orderId
    this.orderId = orderId
    this.$api.order.getOrderDetail(orderId).then((res) => {
      this.show = true
      this.order = res
      this.order.price = Number(this.order.price).toFixed(2)
      this.$api.user.recharge.getRemainder().then(res => {
        this.remainder = Number(res.balance) / 100
        this.noEnough = Number(this.remainder) < Number(this.order.price)
        if (!this.noEnough) this.paytype = 'balance'
      })
      this.getPayConfig()
    }).catch((e) => {
      this.showErrorMsg('无效订单')
    })
    this.hasJSBridge()
  },
  methods: {
    hasJSBridge () {
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
    setJSBridge () {
      this.JSBridgeReady = true
    },
    getPayConfig () {
      this.$api.order.getPayConfig(this.orderId)
        .then((res) => {
          if (res.orderId) {
            this.payConfig = res
            this.configLoad = true
          }
        }).catch((error) => {
          this.showErrorMsg(this.ErrorMap[error.msg] || '获取配置失败')
        })
    },
    pay () {
      if (this.paytype === 'wx') {
        this.wxPay()
      } else if (this.paytype === 'balance') {
        this.balancePay()
      }
    },
    balancePay () {
      this.$api.order.balancePayment(this.orderId).then(res => {
        this.$router.push('/parent/course/pay_result/balance')
      }).catch(() => {
        this.payFail()
      })
    },
    wxPay () {
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
              this.$api.order.refreshOrderStatus(this.orderId)
              this.$router.push('/parent/course/pay_result/pay')
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
    paySuccess () {
      this.$api.order.paySuccess(this.order.id).then(() => {
        this.showSuccess('支付成功！')
        var type = this.order.type
        var _this = this
        setTimeout(() => {
          if (type === 1) {
            _this.$router.push('/parent/course/sign_up_success')
          } else {
            _this.$router.push('/parent/course/my_learn/1')
          }
        }, 1000)
      }).catch((e) => {
        this.showErrorMsg('支付失败')
      })
    },
    payFail() {
      this.$vux.alert.show({
        content: '支付失败，请重新支付！',
        buttonText: '知道了'
      })
    },
    backCourseSite (channelName, location) {
      var temp
      if (!channelName) {
        return location
      }
      try {
        temp = '心迹家庭成长社·' + channelName + '校区（' + location + '）'
      } catch (e) {
        temp = location
        console.log(e)
      }
      return temp
    }
  }
}
</script>

<style scoped lang="scss">
.study-page{
  margin-bottom: 60px;
}
.explain{
  color:#323b46;
}
.textarea{
  height: auto;
}
.sign{
  margin-left: 60%;
}
.apply{
  height: 50px;
  line-height: 50px;
}
.weui_icon.weui_icon_warn::before{
  display: none;
}
.order-field{
  margin:10px 15px;
  font-size: 13px;
  span:first-of-type{
    color: #6c7b8a;
  }
  span:last-of-type{
    color: #323b46;
  }
  span.lanma-color{
    color: #00a6ac;
  }
}
.cl-m-body {
  padding: 5px 15px;
}
/*.order-field span{
  color:#60C9CF;
}*/
.order-field p{
}

.type-select {
  font-size: 13px;
  padding: 0 30px;
  margin-bottom: 15px;
  span {
    margin: 0 10px 0 0;
  }
  .demo--label {
    margin: 15px 20px 0 0;
    display: inline-block
  }
  .demo--radio {
    display: none
  }
  .demo--radioInput {
    background-color: #fff;
    border: 1px solid #c8d2dc;
    border-radius: 100%;
    display: inline-block;
    height: 18px;
    margin-right: 10px;
    margin-top: -1px;
    margin-bottom: 3px;
    vertical-align: middle;
    width: 18px;
    line-height: 1
  }
  .demo--radio:checked+.demo--radioInput:after {
    background-color: #00a6ac;
    border-radius: 100%;
    content: "";
    display: inline-block;
    height: 12px;
    margin: 3px;
    width: 12px
  }
  .demo--checkboxInput {
    background-color: #fff;
    border: 1px solid #c8d2dc;
    border-radius: 100%;
    display: inline-block;
    height: 18px;
    margin-right: 10px;
    margin-top: -1px;
    margin-bottom: 3px;
    vertical-align: middle;
    width: 18px;
    line-height: 1
  }
  .demo--radio:checked+.demo--checkboxInput:after {
    content: '\EA06';
    color: #00a6ac;
    display: inline-block;
    font-size: 20px;
    margin: -1px 0px 0px -1px;
  }
}
.pay-icon {
  vertical-align: middle;
  width: 25px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.page-submit-btn {
  letter-spacing: 0px;
}
</style>
