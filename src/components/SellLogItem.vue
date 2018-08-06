<template>
  <div :class="[record.status == '2' ? 'bggreen' : '', 'cl-module']">
    <div class="cl-m-body">
      <div class="content" @click="gotoDetail">
        <p class="title">
          {{ record.created_at }}
          <span :class="[record.status == '2' ? 'green' : '', 'status']">{{ statusLabel(record) }}</span>
        </p>

        <flexbox>
          <flexbox-item>
            <div class="keyword-wrap">
              <KeyWordItem :marginType="'left'" :margiSpace="'30px'" :textList="textList" :dataList="dataList"></KeyWordItem>
            </div>
          </flexbox-item>
          <flexbox-item :span="1">
            <div>
              <span  v-if="record.status=='2' && !disabled">></span>
            </div>
          </flexbox-item>
        </flexbox>
      </div>

      <template v-if="record.status=='1' && !disabled">
        <hr>
        <router-link :to="'/seller/sign_up/' + record.orderId">
          <div class="bottom">
            <span class="green">签收</span>
          </div>
        </router-link>
      </template>

    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import KeyWordItem from 'components/seller/KeyWordItem'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    KeyWordItem
  },
  data () {
    return {
      statusMap: ['', '未签收', '已签收', '已取消', '超时'],
      statusMapTwo: ['', '待支付', '支付成功', '已取消', '支付超时'],
      textList: ['家长姓名', '家长手机', '销售人员', '商品价格', '订单编号']
    }
  },
  props: {
    disabled: false,
    record: {}
  },
  computed: {
    dataList() {
      return [this.record.parentName, this.record.telephone, this.record.salesName, this.record.price, this.record.orderId]
    }
  },
  methods: {
    gotoDetail () {
      if (this.disabled) return
      this.$router.push('/seller/record_detail/' + this.record.orderId)
    },
    statusLabel (record) {
      if (record.payType === 1) {
        return this.statusMap[record.status]
      } else {
        return this.statusMapTwo[record.status]
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .cl-m-body {
    background-color: #fff;
    padding: 15px 15px 15px 9px;
    margin-left: 6px;
  }
  .content {
    font-weight: 300;
  }
  .title {
    font-size: 13px;
    margin-left: 15px;
    color: #323b46;
  }
  .keyword-wrap{
    margin: 5px 15px;
  }
  .status{
    color: #6c7b8a;
    float: right;
  }
  .bggreen {
    background-color: #00a6ac;
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
  .right{
    margin-left: 30px;
  }
</style>
