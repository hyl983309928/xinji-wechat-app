<template>
  <div class="study-page" v-if="show">
    <tab :line-width="0" class="tab" active-color="#353535">
      <tab-item :selected="currentTab === 0" @click.native="toggle(0)">
        <div class="tab_wrap">
          <img src="/static/img/seller/commodity_on.png" alt="" v-if="currentTab === 0">
          <img src="/static/img/seller/commodity.png" alt="" v-else>
          <span>商品</span>
        </div>
      </tab-item>
      <tab-item :selected="currentTab === 2" @click.native="toggle(2)">
        <div class="tab_wrap">
          <img src="/static/img/seller/recharge_on.png" alt="" v-if="currentTab === 2">
          <img src="/static/img/seller/recharge.png" alt="" v-else>
          <span>充值</span>
        </div>
      </tab-item>
      <tab-item :selected="currentTab === 1" @click.native="toggle(1)">
        <div class="tab_wrap">
          <img src="/static/img/seller/record_on.png" alt="" v-if="currentTab === 1">
          <img src="/static/img/seller/record.png" alt="" v-else>
          <span>记录</span>
        </div>
      </tab-item>
    </tab>
    <div v-if="currentTab == 0">
      <div class="text-wrap">
        <span class="text-left">{{ isTotal ? totalText:onsaleText }}：</span>
        <span class="text-right" @click="changeStatus">{{ isTotal ? onsaleText:totalText }}></span>
      </div>
      <CommodityItem v-for="commodity in commodityList" :commodity="commodity">
      </CommodityItem>
    </div>
    <template v-if="currentTab == 1">
      <router-link to="/seller/record/recharge_log">
        <div class="go_re">查看充值记录 ></div>
      </router-link>
      <div class="fill"></div>
      <SellRecordItem v-for="record in recordList" :record="record"></SellRecordItem>
    </template>
    <div v-if="currentTab == 2" class="recharge">
      <p class="re_normal">扫码充值</p>
      <p class="re_title">请家长扫描二维码充值</p>
      <img :src="qrcode" alt=""> 
    </div>
    <p class="empty-sug" v-if="commodityList.length === 0 && currentTab == 0">该选项下没有数据</p>
    <p class="empty-sug" v-if="recordList.length === 0 && currentTab == 1">该选项下没有数据</p>
  </div>
</template>

<script>
import {Tab, TabItem} from 'vux'

import CommodityItem from 'components/CommodityItem'
import SellRecordItem from 'components/SellRecordItem'
// import _ from 'lodash'
export default {
  components: {
    Tab,
    TabItem,
    CommodityItem,
    SellRecordItem
  },
  data () {
    return {
      show: false,
      qrcode: '',
      onsaleText: '当前在售商品',
      totalText: '往期全部商品',
      isTotal: false,
      currentTab: 0,
      commodityList: [],
      recordList: []
    }
  },
  created () {
    var tab = this.$route.params.tab
    if (tab === 'commodity') {
      this.currentTab = 0
    } else if (tab === 'record') {
      this.currentTab = 1
    } else {
      this.currentTab = 2
    }
    this.getData(this.currentTab)
  },
  methods: {
    toggle (tab) {
      var map = ['commodity', 'record', 'recharge']
      this.currentTab = tab
      this.$router.replace('/seller/' + map[tab])
      this.getData(tab)
    },
    getData (tab) {
      if (tab === 0) {
        var params = {
          'status': this.isTotal ? 0 : 2
        }
        this.$api.seller.getCommodityList(params).then((data) => {
          this.commodityList = data.list.map(item => {
            return {
              id: item.goods.id,
              courseId: item.goods.courseId,
              title: item.goods.name,
              status: item.goods.status, // status：商品状态，1未开放，2在售，3售罄，4过期，5停止
              type: item.goods.goodsType === 1 ? '体验坊' : item.goods.goodsType === 2 ? '课程组合' : '游学营',
              originalPrice: item.goods.originalPrice,
              price: item.goods.price,
              number: item.goods.number,
              total: item.salesInfo.channelCount,
              personal: item.salesInfo.salesCount,
              remain: item.goods.stock,
              channelPrice: item.channelInfo.channelPrice
            }
          })
          this.show = true
        })
      } else if (tab === 1) {
        this.$api.seller.getRecordList().then((data) => {
          this.recordList = data.list.map(item => {
            return {
              id: item.orderId,
              time: item.created_at,
              name: item.parentName,
              phone: item.telephone,
              title: item.goodsName,
              price: item.price,
              orderId: item.orderId,
              payType: item.payType,
              status: item.status // status：订单状态，1未签收，2已签收，3已取消，4超时
            }
          })
          this.show = true
        })
      } else {
        this.createQrcode()
        this.show = true
      }
    },
    changeStatus () {
      this.isTotal = !this.isTotal
      this.getData(0)
    },
    createQrcode (id) {
      this.$api.getCurrentUserInfo().then(res => {
        var origin = window.location
        var url = origin.protocol + '//' + origin.hostname + origin.pathname + '?#/parent/user/recharge/' + res.id
        this.qrcode = './wxcgi/wx/createCustomQRCode?url=' + encodeURIComponent(url) + '&&size=5'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.study-page {
  padding-bottom: 44px;
}
.vux-tab{
  margin-top: 0;
  margin-left: 0;
  width: 100%;
  height: 3.1rem;
  position: fixed;
  bottom: 0;
  z-index: 99;
}

.cl-module{
  :nth-child(even){
    margin-left: 5px;
  }
}
.text-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
  .text-left{
    font-size: 18px;
    color: #000;
  }
  .text-right{
    text-decoration: underline;
    font-size: 14px;
    color: #60c9cf;
  }
}
div.vux-tab .vux-tab-selected{
  background: #eaeaea;
}
.empty-sug{
  text-align: center;
  line-height: 40px;
  color: #666;
}
.recharge{
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  text-align: center;
  .re_title{
    font-size: 16px;
  }
}
.go_re{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  font-weight: bold;
  text-align: center;
  background-color: #33cccc;
  color: #fff;
}
.fill{
  padding: 20px;
}
.re_title{
  font-size: 20px;
  margin: 10px;
}
.tab_wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
  img{
    height: 1.3rem;
  }
  span{
    font-size: 0.725rem;
    line-height: 1.5rem;
  }
}
</style>
