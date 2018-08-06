<template>
  <div class="coupon-covert">
    <div class="credit-info">
      <label>剩余积分</label>
      <p>{{credit}}</p>
    </div>
    <div class="coupon-list">
      <div class="coupon-detail" v-for="coupon in list" @click="doClick(coupon)">
        <div class="price">
          <label>{{coupon.price}}</label>
        </div>
        <div class="info">
          <h4>{{coupon.title}}</h4>
          <p>{{ coupon.type == 1 ? '在支付确认时自动减免' : '在支付确认时自动打折' }}</p>
        </div>
        <div class="convert-btn">
          兑换
        </div>
      </div>
    </div>
    <x-dialog v-model="showDialog" class="coupon-dialog" :scroll="false">
      <div class="success-coupon">
        <coupon-item :detail="coupon"></coupon-item>
        <button @click="gotoMyCoupon">进入我的卡券查看</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from 'vux'

import CouponItem from 'components/CouponItem'

export default {
  components: {
    CouponItem,
    XDialog
  },
  data () {
    return {
      credit: '',
      list: [],
      showDialog: false,
      coupon: {}
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
      this.credit = userInfo.parent.credit
    })
    this.$api.coupon.getList().then((data) => {
      // console.log(list)
      this.list = data.list
    })
  },
  methods: {
    gotoMyCoupon () {
      this.$router.push('/parent/coupon/my_coupon')
    },
    doClick (coupon) {
      var that = this
      this.$vux.confirm.show({
        title: '是否兑换 ¥' + coupon.title,
        content: '兑换将话费' + coupon.price + '积分',
        confirmText: '兑换',
        cancelText: '取消',
        onCancel () {},
        onConfirm () {
          // confirmFun()
          that.convert(coupon)
        }
      })
    },
    convert (coupon) {
      // console.log(id)
      this.$api.coupon.convert(coupon.id).then((userCoupon) => {
        userCoupon.title = coupon.title
        userCoupon.use_status = 1
        userCoupon.discount = coupon.discount
        this.coupon = userCoupon
        this.showDialog = true
      })
      .catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    }
  }
}
</script>


<style scoped lang="scss">
.coupon-covert{
  background: #fff;
  padding: 20px 15px 0px 15px;
}

.credit-info{
  margin-bottom:20px;
  padding: 0px 15px;
  label{
    color: #c8d2dc;
    font-size: 13px;
  }
  p{
    color:#00a6ac;
    font-size: 24px;
    margin-top:8px;
    line-height: 32px;
  }
}
.coupon-list{
  border-top:1px solid #efeff4;
  padding-top:20px;
}
.coupon-detail{
  padding:0px 15px 20px 0px;
  display: -webkit-flex;
  display: flex;
  .price{
    width:28%;
    label{
      display: inline-block;
      width:60px;
      height:34px;
      background: url('/static/img/coupon_shape.png') no-repeat;
      text-align: center;
      margin:5px 0px;
      color:#00a6ac;
      line-height: 30px;
    }
  }
  .info{
    width:49%;
    border-right:1px solid #efeff4;
    h4{
      color:#323b46;
      font-size: 17px;
      line-height: 24px;
      font-weight: normal;
    }
    p{
      color:#c8d2dc;
      font-size:13px;
      line-height: 18px;
    }
  }
  .convert-btn{
    width:22%;
    line-height: 40px;
    text-align: center;
    color:#00a6ac;
    font-size: 17px;
  }
}

.success-coupon{
  height:194px;

  button{
    width: 80%;
    height: 40px;
    margin-top:30px;
    border:none;
	  border-radius: 6px;
	  background-color: #00a6ac;
	  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
    color:#fff;
    font-size: 17px;
  }
}

</style>
