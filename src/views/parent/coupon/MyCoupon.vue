<template>
  <div class="coupon-list">
    <coupon-item v-for="item in list" :detail="item" class="my-coupon-item"></coupon-item>
  </div>
</template>

<script>
import CouponItem from 'components/CouponItem'

export default {
  components: {
    CouponItem
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
    })
    this.$api.coupon.userCoupon().then((data) => {
      this.list = data.list
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.coupon-list{
  margin:0 15px;
}
.my-coupon-item{
  margin-top: 15px;
}

</style>
