<template>
  <div class="flex_log">
    <div class="left">
      <p class="type">
        <span>{{ data.type }}</span>
        <span class="green">{{ data.status }}</span>
      </p>
      <p v-if="data.payType">支付方式：{{ data.payType }}</p>
      <p>No：{{ data.code }}</p>
      <p>{{ data.time }}</p>
    </div>
    <div class="right">
      <p v-if="data.pay">实付：¥ <span class="green">{{ data.pay }}</span></p>
      <p v-if="data.gift">赠送：¥ <span class="green">{{ data.gift }}</span></p>
      <p v-if="data.total">到账：¥ <span class="green">{{ data.total }}</span></p>
      <p v-if="data.reduce" class="reduce">- {{ data.reduce }}</p>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from 'vux'
import TopCover from 'components/TopCover'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    TopCover
  },
  data () {
    return {}
  },
  props: {
    data: ''
  },
  computed: {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .flex_log{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
  }
  .green{
    color: #339966;
  }
  .type{
    font-size: 16px;
  }
  .reduce{
    font-size: 26px;
  }
</style>
