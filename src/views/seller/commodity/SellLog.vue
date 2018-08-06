<template>
  <div class="study-page" v-if="show">
    <div class="goods-info">
      <p class="title">{{ title }}</p>
      <p class="number">商品编号：{{ number }}</p>
    </div>
    <div class="text-wrap">
      <span class="text-left">{{ isTotal ? totalText:personalText }}：</span>
      <span class="text-right" @click="changeStatus">{{ isTotal ? personalText:totalText }}></span>
    </div>
    <SellLogItem v-for="record in recordList" :record="record" :disabled="isTotal">
    </SellLogItem>
    <p class="empty-sug" v-if="recordList.length === 0">该选项下没有数据</p>
  </div>
</template>

<script>
import SellLogItem from 'components/SellLogItem'
// import _ from 'lodash'
export default {
  components: {
    SellLogItem
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
  computed: {
    personalText() {
      return `个人业绩（${this.personalList.length}）`
    },
    totalText() {
      return `总售出（${this.totalList.length}）`
    },
    recordList() {
      return this.isTotal ? this.totalList : this.personalList
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    var type = this.$route.params.type
    if (isNaN(id) || id < 0) {
      this.id = 0
    }
    this.id = id
    if (String(type) === 'total') {
      this.isTotal = true
    }
    this.getCommodity()
    this.getList()
  },
  methods: {
    getList () {
      var params = {
        goodsId: this.id
      }
      this.$api.seller.getTotalRecord(params).then((data) => {
        this.totalList = data.list
        this.show = true
      })
      this.$api.seller.getRecordList(params).then((data) => {
        this.personalList = data.list
        this.show = true
      })
    },
    getCommodity() {
      this.$api.seller.getCommodity(this.id).then(commodity => {
        this.title = commodity.goodsInfo.name
        this.number = commodity.goodsInfo.number
      })
    },
    changeStatus () {
      this.isTotal = !this.isTotal
      this.$router.replace(`/seller/log/${this.id}/` + (this.isTotal ? 'total' : 'personal'))
      this.getList()
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
.goods-info{
  padding: 10px 15px;
  background-color: #56dcb4;
  color: #fff;
  .title{
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
