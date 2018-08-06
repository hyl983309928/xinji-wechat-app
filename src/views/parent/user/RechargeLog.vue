<template>
  <div class="log-page" v-if="show">
    <div class="flex_wrap">
      <span class="start_t" @click="showPlugin('start_t')">{{ start_t || defaultTime }}</span>
      <span class="end_t" @click="showPlugin('end_t')">{{ end_t || defaultTime }}</span>
      <span class="btn" @click="toogle('auto')">确定</span>
    </div>

    <tab :line-width="2" custom-bar-width="60px" :active-color="'#00b050'" :bar-active-color="'#00b050'">
      <tab-item selected @on-item-click="toogle('week')">近一周</tab-item>
      <tab-item @on-item-click="toogle('month')">近一月</tab-item>
      <tab-item @on-item-click="toogle('more')">近三月</tab-item>
    </tab>

    <div class="filter_list">
      <RechargeLogItem :data="item" v-for="item in list"></RechargeLogItem>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'
import RechargeLogItem from 'components/user/RechargeLogItem'

export default {
  components: { Tab, TabItem, PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch, RechargeLogItem },
  data () {
    return {
      show: true,
      logType: 'recharge',
      start_t: '',
      end_t: '',
      list: [],
      statusMap: ['', '未支付', '成功', '已取消', '超时'],
      payTypeMap: ['', '渠道支付', '微信支付', '余额支付']
    }
  },
  computed: {
    defaultTime () {
      var d = new Date()
      return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
    }
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.logType = this.$route.params.logType
      this.toogle('week')
    },
    toogle(type) {
      var start = this.start_t || this.defaultTime
      var end = this.end_t || this.defaultTime
      switch (type) {
        case 'week':
          this.getList(this.getTime(7), this.defaultTime)
          break
        case 'month':
          this.getList(this.getTime(30), this.defaultTime)
          break
        case 'more':
          this.getList(this.getTime(90), this.defaultTime)
          break
        case 'auto':
          if (Date.parse(start) < Date.parse(end)) {
            this.getList(start, end)
          } else {
            this.getList(end, start)
          }
          break
        default:
          break
      }
    },
    getTime(day) { // 获取几天前的日期
      var d = new Date((Date.now() - 86400000 * day))
      return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
    },
    getList(start, end) {
      if (this.logType === 'recharge') {
        this.$api.user.recharge.getRechargeRecordList(start + ' 00:00:00', end + ' 23:59:59').then(data => {
          this.list = data.list.map(item => {
            return {
              type: '线上充值',
              status: '成功',
              code: item.rechargeId,
              time: item.created_at,
              pay: Number(item.amount) / 100,
              gift: Number(item.giftAmount) / 100,
              total: Number(item.amount + item.giftAmount) / 100
            }
          })
          this.show = true
        })
      } else if (this.logType === 'consume') {
        this.$api.user.recharge.getUserPaidOrderList(start + ' 00:00:00', end + ' 23:59:59').then(data => {
          this.list = data.list.map(item => {
            return {
              type: '购买课程',
              status: '成功',
              payType: this.payTypeMap[item.payType],
              code: item.orderId,
              time: item.created_at,
              reduce: Number(item.price).toFixed(2)
            }
          })
          this.show = true
        })
      }
    },
    showPlugin (type) {
      var _this = this
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM-DD',
        yearRow: '{value}年',
        monthRow: '{value}月',
        dayRow: '{value}日',
        onConfirm (val) {
          _this[type] = val
        },
        onShow () {
          console.log('plugin show')
        },
        onHide () {
          console.log('plugin hide')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .flex_wrap{
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    background-color: #fff;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    span{
      background-color: #f2f2f2;
      flex-grow: 2;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 10px;
    }
    .btn{
      background-color: #6ee1be;
      color: #fff;
      flex-grow: 1;
    }
  }
  .flex_ul{
    display: flex;
    justify-content: space-around;
  }
  .filter_list{
    margin-top: 10px;
    border-top: 1px solid #ccc;
  }
</style>
