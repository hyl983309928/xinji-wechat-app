<template>
  <div class="kf-page">
    <div class="qrcode">
      <p>有任何疑问，欢迎联系我们</p>
      <p>长按识别二维码，加客服微信沟通</p>
      <div class="img_box">
        <img src="/static/img/recharge/kf_qrcode.jpg" alt="">
      </div>
      <p class="kf_wx">客服微信：小陈老师</p>
    </div>
    <div class="contact">
      <p>您也可以直接电话联系我们：</p>
      <a href="tel:13927498124" class="flex">
        <img src="/static/img/recharge/kf.png" alt="">
        139-2749-8124
      </a>
    </div>
    <div class="fill"></div>
  </div>
</template>

<script>
import { XButton } from 'vux'

export default {
  components: { XButton },
  data () {
    return {}
  },
  computed: {},
  created () {},
  methods: {}
}
</script>

<style scoped lang="scss">
  .kf-page{
    background-color: #56dcb4;
    padding: 40px 20px;
  }
  .qrcode{
    background-color: #fff;
    text-align: center;
    padding: 20px 0;
    border-radius: 10px;
    .img_box{
      margin: 10px 0 -10px 0;
      img{
        width: 10rem;
      }
    }
    .kf_wx{
      color: #1aa3a6;
    }
  }
  .contact{
    background-color: #fff;
    text-align: center;
    margin-top: 40px;
    padding: 20px 0;
    border-radius: 10px;
    .flex{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15rem;
      margin: 0 auto;
      margin-top: 20px;
      border: 2px solid #92d050;
      border-radius: 20px;
      font-size: 24px;
      color: #92d050;
      img{
        margin-right: 10px;
        width: 22px;
      }
    }
  }
  .fill{
    height: 110px;
    background-color: #56dcb4;
  }
</style>
