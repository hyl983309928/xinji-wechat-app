<template>
  <div class="study-page" v-if="show">
    <!-- <div class="goods-info">
      <p class="title">{{ title }}</p>
      <p class="number">商品编号：{{ number }}</p>
    </div> -->
    <!-- <div class="text-wrap">
      <span class="text-left">{{ isTotal ? totalText:personalText }}：</span>
      <span class="text-right" @click="changeStatus">{{ isTotal ? personalText:totalText }}></span>
    </div> -->
    <RechargeLogItem v-for="record in recordList" :record="record" :disabled="isTotal">
    </RechargeLogItem>
    <p class="empty-sug" v-if="recordList.length === 0">该选项下没有数据</p>
  </div>
</template>

<script>
import RechargeLogItem from 'components/RechargeLogItem'
// import _ from 'lodash'
export default {
  components: {
    RechargeLogItem
  },
  data () {
    return {
      title: '',
      number: '',
      show: false,
      totalList: [],
      personalList: [],
      isTotal: false
    }
  },
  computed: {},
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.seller.getRechargeRecordList().then((data) => {
        this.recordList = data.list.map(item => {
          item.amount = item.amount / 100
          item.giftAmount = item.giftAmount / 100
          item.priceDesc = item.amount + `（充${item.amount}送${item.giftAmount}）`
          return item
        })
        this.show = true
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
</style>
