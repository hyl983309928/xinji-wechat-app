<template>
  <div class="recode-detail">
  
    <ModuleWrap>
      <span slot="header">记录信息</span>
      <div slot="body" class="info" :class="{'has-sign': true}">
        <KeyWordItem :marginType="'between'" :textList="textList" :dataList="dataList"></KeyWordItem>
      </div>
    </ModuleWrap>

    <ModuleWrap :hideHeader="true" @click.native="commodityDetail">
      <div slot="body" class="info">
        <span class="detail">查看商品详情</span>
        <span class="icon-arrow">></span>
      </div>
    </ModuleWrap>

    <ModuleWrap :hideHeader="true" v-if="record.status==1 && record.payType==1">
      <div slot="body" class="qrcode">
        <div class="img-box">
          <img :src="signInCode" alt="">
        </div>
        <span>请家长微信扫一扫进行签收</span>
      </div>
    </ModuleWrap>

    <div class="cl-module cancel" @click="cancel" v-if="record.status<3">
      <div class="cl-m-body">
        <span class="cancel-text">取消订单</span>
      </div>
    </div>

  </div>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import TopCover from 'components/TopCover'
import SaleInfoBox from 'components/seller/SaleInfoBox'
import KeyWordItem from 'components/seller/KeyWordItem'
export default {
  components: {
    TopCover,
    SaleInfoBox,
    ModuleWrap,
    KeyWordItem
  },
  data () {
    return {
      orderId: '',
      signInCode: '',
      timer: '',
      textList: ['家长姓名', '家长手机', '商品名称', '商品价格', '提交时间', '订单编号', '签收状态'],
      statusMap: ['', '未签收', '已签收', '已取消', '超时'],
      statusMapTwo: ['', '待支付', '支付成功', '已取消', '支付超时'],
      record: {}
    }
  },
  computed: {
    dataList() {
      var keyWordList = ['parentName', 'telephone', 'goodsName', 'price', 'created_at', 'orderId', 'status']
      return keyWordList.map(item => {
        if (item === 'status') {
          if (this.record.payType === 1) {
            return this.statusMap[this.record.status]
          } else {
            return this.statusMapTwo[this.record.status]
          }
        }
        return this.record[item]
      })
    }
  },
  created () {
    this.orderId = this.$route.params.id
    this.getOrderInfo(this.orderId)
  },
  beforeRouteLeave(to, form, next) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    next()
  },
  methods: {
    getOrderInfo (id) {
      this.$api.seller.getOrderInfo(id).then((record) => {
        this.record = record
        if (record.status === 1) {
          this.getSignInCode(record.orderId)
        } else if (record.status === 2) {
          this.$nextTick(function () {
            Array.from(document.querySelectorAll('span.right')).slice(-1)[0].style.color = '#60c9cf'
          })
        }
      })
    },
    commodityDetail () {
      this.$api.seller.getCommodity(this.record.goodsId).then(data => {
        var type = (data.goodsInfo.goodsType === 1 || data.goodsInfo.goodsType === 3) ? 'single' : 'group'
        var goodsId = data.goodsInfo.id
        var courseId = data.goodsInfo.courseId
        this.$router.push(`/seller/course_detail/${type}/${goodsId}/${courseId}`)
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
    cancel() {
      var _this = this
      this.$vux.confirm.show({
        title: '',
        content: '<span style="font-size:18px">确认要取消订单？</span>',
        confirmText: '确认取消',
        cancelText: '放弃操作',
        onConfirm () {
          _this.$api.seller.cancelOrder(_this.record.orderId).then(data => {
            // this.$router.push(`/seller/course_detail/${type}/${goodsId}/${courseId}`)
            _this.showSuccess('订单已取消')
            setTimeout(function() {
              _this.$router.go(-1)
            }, 1000)
          }).catch(error => {
            if (error.code === 6024) {
              _this.showErrorMsg('支付超时，订单已自动取消')
            } else if (error.code === 6008) {
              _this.showErrorMsg('商品中所含课程已结束，订单无法取消')
            } else if (error.code === 6063) {
              _this.showErrorMsg('账户余额不足，退款失败。')
            }
          })
        }
      })
      // this.$router.push
    }
  }
}
</script>

<style scoped lang="scss">
  .recode-detail {
    margin-top: 15px;
  }
  .info {
    padding: 0 5px;
  }
  .cl-module {
    margin-top: 0;
    font-size: 14px;
    color: #6c7b8a;
  }
  .detail{
    color: #60c9cf;
  }
  .icon-arrow{
    float: right;
    color: #c8d2dc;
  }
  .qrcode{
    text-align: center;
    margin: 25px 0;
    span{
      color: #6c7b8a;
    }
    img{
      width: 140px;
    }
  }
  .cancel{
    text-align: center;
    /*background-color: #f76260;*/
    background-color: #c00;
    .cancel-text{
      color: #fff;
    }
  }
</style>
