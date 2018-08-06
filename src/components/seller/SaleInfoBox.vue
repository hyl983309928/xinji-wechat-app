<template>
    <ModuleWrap :headerColor="headerColor" :opacity="opacity">
      <div class="head" slot="header">
        <span>销售进度</span>
        <span>{{ statusMap[status] }}</span>
      </div>
      <div slot="body">
        <SaleNumber :status="status" :remain="remain" :total="total" :personal="personal"></SaleNumber>
      </div>
    </ModuleWrap>
</template>

<script>
import ModuleWrap from 'components/ModuleWrap'
import SaleNumber from 'components/seller/SaleNumber'
export default {
  components: {
    ModuleWrap,
    SaleNumber
  },
  props: {
    status: {
      type: [String, Number],
      default: ''
    },
    total: {
      type: [String, Number],
      default: ''
    },
    personal: {
      type: [String, Number],
      default: ''
    },
    remain: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      statusMap: ['', '在售', '售罄', '过期']
    }
  },
  computed: {
    headerColor() {
      return Number(this.status) === 1 ? '#60c9cf' : '#6c7b8a'
    },
    opacity() {
      return Number(this.status) === 3 ? '0.4' : '1'
    }
  },
  created () {}
}
</script>

<style scoped lang="scss">
.head{
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
}
</style>
