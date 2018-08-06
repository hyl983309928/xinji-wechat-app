<template>
  <div :class="'coupon-item' + (detail.status > 1 ? 'disabled' : '')">
    <div class="coupon-info">
      <h4>
        {{detail.title}}
      </h4>
      <p>{{ detail.type == 1 ? '在支付确认时自动减免' : '在支付确认时自动打折' }}</p>
      <p>有效期至：{{detail.over_time}}</p>
    </div>
    <div class="discount" v-if="detail.use_status < 2">
      {{ detail.discount }}<br />折
    </div>
    <div class="discount" v-if="detail.use_status === 2">
      已<br />用
    </div>
    <div class="discount" v-if="detail.use_status === 3">
      失<br />效
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    detail: {}
  },
  computed: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.coupon-item{
  display: flex;
  height:124px;
  // height:80px;
  background-size: 100% 100%;
  background-image: url(/static/img/coupon_1.png);
}
.coupon-item.disabled{
  background-image: url(/static/img/coupon_2.png);
}
.coupon-info{
  width:75%;
  padding-top:20px;
  text-align: left;
  h4{
    margin-left: 11.6%;
    padding-bottom: 15px;
    color:#323b46;
    font-size: 17px;
    line-height: 24px;
    font-weight: normal;
  }
  p{
    margin-left: 11.6%;
    margin-bottom: 5px;
    color:#c8d2dc;
    font-size:13px;
    line-height: 18px;
  }
}
.discount{
  width:25%;
  text-align: center;
  font-size: 24px;
  color:#fff;
  line-height: 32px;
  margin-top:26px;
}
</style>
