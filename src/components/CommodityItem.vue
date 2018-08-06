<template>
  <div class="cl-module">
    <div :class="[commodity.status == '4' ? 'expired' : '', 'cl-m-body']">
      <div class="content" @click="gotoDetail">
        <p class="title">{{ commodity.title }}</p>
        <p class="status-tag">
          <img :src="`/static/img/${statusMap[commodity.status]}.png`" alt="">
        </p>
        <p class="price">
          <span>{{ commodity.type }}</span>
          <span class="price-number">售价：<span :class="[commodity.status == '4' ? '' : 'green']">¥{{ commodity.channelPrice }}</span></span>
          <span class="origin-price" v-if="commodity.channelPrice != commodity.originalPrice">（原价：¥{{ commodity.originalPrice }}）</span>
        </p>
       <!-- <p class="number">商品编号：{{ commodity.number }}</p>-->
        <SaleNumber :status="commodity.status" :total="commodity.total" :personal="commodity.personal" :remain="commodity.remain" :showArrow="true" @clicked="dealClick"></SaleNumber>
      </div>

      <hr v-if="commodity.status=='2'">

      <router-link :to="'/seller/course_QRcode/' + commodity.id">
        <div class="bottom butItem borderRight" v-if="commodity.status=='2'">
          <span class="green">商品二维码</span>
        </div>
      </router-link>
      <router-link :to="'/seller/add_buyer/' + commodity.id">
        <div class="bottom butItem" v-if="commodity.status=='2'">
          <span class="green">赠送课程</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import SaleNumber from 'components/seller/SaleNumber'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    SaleNumber
  },
  data () {
    return {
      statusMap: ['', '', 'onsale', 'soldout', 'expired'] // status：商品状态，1未开放，2在售，3售罄，4过期，5停止
    }
  },
  props: {
    commodity: {}
  },
  computed: {
  },
  methods: {
    gotoDetail () {
      this.$router.push('/seller/course_detail/' + ((this.commodity.type === '体验坊' || this.commodity.type === '游学营') ? 'single' : 'group') + '/' + this.commodity.id + '/' + this.commodity.courseId)
    },
    dealClick (type) {
      this.$router.push(`/seller/log/${this.commodity.id}/${type}`)
    }
  }
}
</script>

<style scoped lang="scss">
  .title {
    font-size: 17px;
    font-weight: 300;
    margin-bottom: 5px;
  }
  .price {
    margin-top: 15px;
    font-size: 13px;
    font-weight: 300;
    .price-number {
      margin-left: 10px;
    }
    .origin-price {
      text-decoration: line-through;
      color: #ccc;
    }
  }
  .number {
    margin-bottom: 15px;
    font-size: 13px;
    font-weight: 300;
  }
  .flex-demo {
    text-align: center;
    font-size: 13px;
  }
  .cl-m-body {
    position: relative;
  }
  .expired{
    color: #ccc;
  }
  .status-info {
    position: absolute;
    top: 22%;
    right: 35%;
  }
  .status-tag {
    position: absolute;
    top: 10px;
    right: 0;
    img{
      width: 4rem;
    }
  }
  .sale-number{
    font-size: 24px;
    font-weight: 500;
  }
  .green{
    color: #60c9cf;
  }
  hr{
    margin: 10px 0;
    opacity: 0.3;
  }
  .bottom{
    text-align: center;
    span {
      font-weight: bold;
      font-size: 17px;
    }
  }
  .butItem{
    display: inline-block;
    width:48%;
    box-sizing: border-box;
  }
  .borderRight{
    border-right: 1px solid #ccc;
  }
</style>
