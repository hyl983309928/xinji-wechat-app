<template>
  <div class="bggreen cl-module">
    <div class="cl-m-body">
      <div class="content">
        <p class="title">
          {{ record.created_at }}
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
      textList: ['家长姓名', '家长手机', '充值金额', '订单编号']
    }
  },
  props: {
    disabled: false,
    record: {}
  },
  computed: {
    dataList() {
      return [this.record.name, this.record.telephone, '¥ ' + this.record.priceDesc, 'No：' + this.record.rechargeId]
    }
  },
  methods: {}
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
