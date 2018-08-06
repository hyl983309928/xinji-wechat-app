<template>
  <div class="page">
    <div class="top">
      <div class="content">
        <p class="title">{{ commodity.name }}</p>
        <p class="time" v-if="commodity.original">上课时间：{{commodity.original.lesson_time}}</p>
        <p class="price">
          <!--<span>{{ commodity.type }}</span>-->
          <span class="price-number">限时特惠：<span class="priceNum">¥{{ commodity.channelPrice }}</span></span>
          <span class="origin-price" v-if="commodity.channelPrice != commodity.originalPrice">（<span>原价：¥{{ commodity.originalPrice }}</span>）</span>
        </p>
      </div>
    </div>
    <div class="QRcode">
      <div class="QRcodeBox">
        <div>
          <p class="labelOne">扫码查看商品详情</p>
          <p class="labelTwo">请家长扫描二维码，完成支付</p>
        </div>
        <div class="img">
          <img :src="qrcode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      goodsId: '',
      commodityList: [],
      commodity: {},
      qrcode: ''
    }
  },
  computed: {
  },
  created () {
    var goodsId = parseInt(this.$route.params.goodsId)
    console.log(goodsId)
    if (isNaN(goodsId) || goodsId < 0) {
      goodsId = 0
    }
    this.goodsId = goodsId
    this.getGoods()
  },
  mounted () {
  },
  methods: {
    getGoods () {
      this.$api.seller.getCommodity(this.goodsId).then((data) => {
        this.commodity = data.goodsInfo
        this.commodity.channelPrice = data.channelInfo.channelPrice
        this.createQrcode()
      })
    },
    createQrcode () {
      this.$api.getCurrentUserInfo().then(res => {
        var origin = window.location
        var url = origin.protocol + '//' + origin.hostname + origin.pathname + '?#/parent/commodity/detail_seller' + '/' + this.goodsId + '/' + res.id
        this.qrcode = './wxcgi/wx/createCustomQRCode?url=' + encodeURIComponent(url) + '&&size=5'
        console.log(url)
      })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.page{
  background: rgb(26,163,166);
  padding: 20px;
  padding-top:0;
  min-height: 100vh;
  box-sizing: border-box;
}
.top{
  background: rgb(255,233,220);
  padding: 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.2);
  color: #4c4c4c;
  .title{
    font-size: 1rem;
  }
  .time{
    font-size: .9rem;
  }
  .price{
    font-size: .9rem;
    .priceNum{
      color: rgb(26,163,166);
      font-weight: bold;
    }
    .origin-price{
      color: #999;
      span{
        text-decoration: line-through;
        font-style: italic;
      }
    }
  }
}
.QRcode{
  padding: 15px;
  padding-top: 0px;
  box-sizing: border-box;
}
.QRcodeBox{
  margin-top: 40px;
  background: #FFF;
  padding: 20px 10px 40px 10px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.2);
  .labelOne{
    font-size: .9rem;
    color: #4c4c4c;
  }
  .labelTwo{
    font-size: 1rem;
    color: #4c4c4c;
  }
  .img{
    width:50%;
    margin-left: 25%;
    margin-top: 30px;
    img{
      width:100%;
    }
  }
}
</style>