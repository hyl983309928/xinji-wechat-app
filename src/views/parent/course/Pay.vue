<template>
  <div class="main-content">
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
          <span>{{ course.title }}</span>
        </div>
        <div class="order-field">
          <span>商品类型</span>&nbsp;
          <span>{{ courseTypeMap[order.orderType] }}</span>
        </div>
        <div class="order-field">
          <span>订单金额</span>&nbsp;
          <span>{{ course.price }} 元</span>
        </div>
        <div class="order-field">
          <span>上课时间</span>&nbsp;
          <span>{{course.materialType==2? TimeModel.editStTime(course.lesson_time,course.lesson_time_end):TimeModel.editTime(course.lesson_time, course.duration)}}</span>
        </div>
        <div class="order-field">
          <span>手机号码</span>&nbsp;
          <span>{{order.telephone}}</span>
        </div>
        <div class="order-field">
          请在 <span class="lanma-color">15分钟</span> 之内支付，否则订单失效
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        选择支付方式
      </div>
      <flexbox orient="vertical" class="type-select">
        <!--<flexbox-item>
          <label class="demo--label">
            <input class="demo--radio" type="radio" name="paytype" value="lanma" v-model="paytype">
            <span class="demo--radioInput"></span> 余额支付（剩余：2017懒币）
          </label>
        </flexbox-item>-->
        <flexbox-item>
          <label class="demo--label">
            <input class="demo--radio" type="radio" name="paytype" value="wx" v-model="paytype">
            <span class="demo--radioInput"></span>
            <img class="wxpay-icon" src="/static/img/wxpay.png" alt=""> 
            微信支付
          </label>
        </flexbox-item>
      </flexbox>
    </div>
    <button class="page-submit-btn" @click="pay" v-if="configLoad">支付 {{ course.price }} 元</button>
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
      orderId: '',
      courseId: '',
      course: {},
      paytype: 'wx',
      order: {},
      payConfig: {},
      phone: '',
      configLoad: false,
      courseTypeMap: {'DK': '体验坊', 'ZH': '课程组合', 'YX': '游学营'},
      ErrorMap: {'ER_ORDER_HAS_EXPIRE': '支付超时', 'ER_CREATE_WX_ORDER_FAILED': '创建订单失败', 'ER_HAS_PURSER_COURSE': '不可重复购买'},
      TimeModel
    }
  },
  created () {
    var orderId = this.$route.params.orderId
    this.orderId = orderId
    this.$api.order.getOrderDetail(orderId)
      .then((res) => {
        if (res.orderDesc) {
          this.courseId = res.orderDesc.courseId
          this.order = res
          this.getCourseDetail()
          this.getPayConfig()
        } else {
          // var _this = this
          this.showErrorMsg('无效订单')
          // setTimeout(function() {
          //   _this.$wechat.closeWindow()
          // }, 2000)
        }
      })
  },
  methods: {
    getCourseDetail () {
      this.$api.course.getDetail(this.courseId)
        .then((course) => {
          this.course = course
        })
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
.wxpay-icon {
  vertical-align: middle;
  width: 25px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.page-submit-btn {
  letter-spacing: 0px;
}
</style>
