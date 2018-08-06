<template>
  <div class="poster-page" v-if="show">
    <div class="header">
      <img src="/static/img/poster/invitation.png" alt="">
      <p>孩子需陪伴，陪伴有技巧</p>
      <p>如何让你的陪伴更有效？</p>
    </div>

    <div class="middle">
      <div class="img-box">
        <img src="/static/img/poster/lanmaxueyuan.png" alt="">
        <img src="/static/img/poster/sectitle.png" alt="">
      </div>
      <img src="/static/img/poster/balloon.png" alt="" class="balloon">
      <img src="/static/img/poster/crown.png" alt="" class="crown">
      <p class="title">{{ commodity.goodsInfo.name }}</p>
      <p class="timer">时间：{{ time }}</p>
      <p class="price">价格：{{ commodity.channelInfo.channelPrice }}</p>
      <img src="/static/img/poster/family.png" alt="" class="family">
      <p class="desc">本课程由 心迹家庭成长社 家长教育研究实验室，携手清华大学社科院、北师大、华中师大联合设计研发。</p>
    </div>

    <div class="bottom-desc">
      <p>世界那么大，何不带孩子去试试？</p>
      <p>此刻，陪孩子体验世界的宽度。</p>
      <p>将来，他终会找到自己人生的深度。</p>
    </div>

    <div class="bottom">
      <div class="img-box">
        <img :src="signInCode" alt="">
      </div>
      <div class="text">
        <span>{{ commodity.channelInfo.priceDesc }}</span><br>
        <span>扫码免费领取</span>
      </div>
    </div>
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
      show: false,
      commodity: '',
      signInCode: ''
    }
  },
  computed: {
    time() {
      var originTime = this.commodity.goodsInfo.original.lesson_time
      var a = originTime.split(/[^0-9]/)
      var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
      var date = originTime.split(' ')[0]
      var timeStart = originTime.split(' ')[1].slice(0, 5)
      var minuteEnd = new Date(Date.parse(time) + 7200000).getMinutes()
      if (minuteEnd === 0) {
        minuteEnd = '00'
      }
      var hourEnd = new Date(Date.parse(time) + 7200000).getHours()
      var dayMap = ['（周日）', '（周一）', '（周二）', '（周三）', '（周四）', '（周五）', '（周六）']
      var dayNumber = new Date(time).getDay()
      return date + dayMap[dayNumber] + timeStart + '-' + hourEnd + ':' + minuteEnd
    }
  },
  created () {
    var id = this.$route.params.goodsId
    var orderId = this.$route.params.orderId
    this.getCommodityInfo(id)
    this.getSignInCode(orderId)
  },
  beforeRouteLeave(to, form, next) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    next()
  },
  methods: {
    getCommodityInfo (id) {
      this.$api.seller.getCommodity(id).then((commodity) => {
        this.commodity = commodity
        this.show = true
      }).catch(error => {
        this.showError(error)
      })
    },
    getSignInCode (id) {
      this.$api.seller.getSignInCode(id).then((data) => {
        this.signInCode = data.qrcode
      })
    }
  }
}
</script>

<style scoped lang="scss">
.poster-page{
  background: url('/static/img/poster/bg1.png') no-repeat;
  background-size: cover;
}
.header{
  padding: 1rem 0;
  text-align: center;
  color: #fff;
  img{
    width: 7.2rem;
  }
}
.middle{
  background: url('/static/img/poster/bg2.png') no-repeat;
  background-size: cover;
  position: relative;
  margin: 0 1.5rem;
  padding: 1.2rem 2rem;
  border-radius: 1.5rem;
  color: #0d9184;
  font-size: 0.875rem;
  .img-box{
    text-align: center;
    img:nth-of-type(1){
      width: 9.687rem;
      margin-bottom: 0.625;
    }
    img:nth-of-type(2){
      width: 13.75rem;
      margin-bottom: 0.3rem;
    }
  }
  .balloon{
    width: 3.43rem;
    position: absolute;
    left: -1rem;
    top: -1.625rem;
  }
  .crown{
    width: 3.43rem;
    position: absolute;
    right: -1rem;
    top: -1.625rem;
  }
  .family{
    width: 6.875rem;
    position: absolute;
    bottom: 1.2rem;
    right: -1rem;
  }
  .title{
    font-size: 1rem;
    text-align: center;
    margin-bottom: 0.625rem;
  }
  .desc{
    font-weight: 300;
    margin-top: 0.625rem;
    margin-right: 4.375rem;
  }
  .timer{
    font-weight: 600;
  }
  .price{
    font-weight: 600;
  }
}

.bottom-desc{
  margin: 1.25rem auto;
  width: 60%;
  color: #fff;
  font-size: 0.875rem;

}
.bottom{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1.25rem;
  .text{
    margin-left: 0.625rem;
    text-align: center;
    span:nth-of-type(1){
      color: #fff;
    }
    span:nth-of-type(2){
      font-weight: 600;
      font-size: 1.25rem;
      color: #ffde00;
    }
  }
  .img-box img{
    width: 80px;
  }
}
</style>
