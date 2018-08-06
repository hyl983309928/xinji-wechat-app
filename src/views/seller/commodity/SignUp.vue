<template>
  <div>

    <div class="success-wrap shadow">
      <icon type="success" is-msg class="success-icon"></icon>
      <p class="success">提交成功</p>
      <p class="scan">请家长微信扫一扫进行签收</p>
      <p class="img-box">
        <img :src="signInCode" alt="">
      </p>
    </div>

    <div class="info-wrap shadow">
      <KeyWordItem :marginType="'between'" :textList="textList" :dataList="dataList"></KeyWordItem>
    </div>

    <FooterButton v-if="showPoster" :text="'发送赠课海报'" @click.native="sendPoster" :bgColor="'#56dcb4'" :textColor="'#fff'"></FooterButton>
  </div>
</template>

<script>
import KeyWordItem from 'components/seller/KeyWordItem'
import FooterButton from 'components/FooterButton'
import { Icon } from 'vux'
export default {
  components: {
    KeyWordItem,
    FooterButton,
    Icon
  },
  data () {
    return {
      timer: '',
      signInCode: '',
      order: '',
      showPoster: false,
      textList: ['家长姓名', '家长手机', '商品名称', '商品价格'],
      dataList: ['吴先生', '13124068575', '观察力系列课程', '3000']
    }
  },
  created () {
    var id = this.$route.params.id
    this.getSignInCode(id)
    this.getOrderInfo(id)
  },
  beforeRouteLeave(to, form, next) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    next()
  },
  methods: {
    getOrderInfo (id) {
      this.$api.seller.getOrderInfo(id).then((order) => {
        this.order = order
        this.dataList = [order.parentName, order.telephone, order.goodsName, order.price]
        this.getCommodityInfo(order.goodsId)
      })
    },
    getCommodityInfo (id) {
      this.$api.seller.getCommodity(id).then((commodity) => {
        if (commodity.channelInfo.priceDesc) {
          this.showPoster = true
        }
      }).catch(error => {
        this.showError(error)
      })
    },
    getSignInCode (id) {
      this.$api.seller.getSignInCode(id).then((data) => {
        this.signInCode = data.qrcode
        this.startQuery(data.qrcodeId)
      })
    },
    startQuery(id) {
      var _this = this
      this.timer = setTimeout(function() {
        _this.$api.seller.checkSignInScan(id).then(data => {
          if (data) {
            _this.$vux.confirm.show({
              title: '用户已签收！',
              content: '请指导用户在微信查看获得的课程，确认上课时间和地址。',
              confirmText: '我知道了',
              cancelText: '',
              onCancel () {},
              onConfirm () {
                _this.$router.go(-1)
              }
            })
          } else {
            _this.startQuery(id)
          }
        }).catch(() => {
          this.showErrorMsg('查询绑定结果失败')
        })
      }, 1000)
    },
    sendPoster() {
      this.$router.push(`/seller/poster/${this.order.goodsId}/${this.order.orderId}`)
    }
  }
}
</script>

<style scoped lang="scss">
.success-icon{
  color: #60c9cf;
  background-color: #fff;
  border-radius: 50%;
  margin-top: -20px;
  position: relative;
  top: -25px;
}
.success-wrap{
  text-align: center;
  margin: 98px 60px 30px 60px;
  .success{
    font-size: 20px;
  }
  .scan{
    margin: 15px 0 30px 0;
    font-size: 14px;
    color: #6c7b8a;
  }
  .img-box{
    img{
      width: 150px;
      margin-bottom: 30px;
    }
  }
}
.info-wrap{
  margin: 15px;
  padding: 15px 20px;
}
.shadow{
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 15px #ccc;
}
</style>
