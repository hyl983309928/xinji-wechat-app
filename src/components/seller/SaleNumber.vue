<template>
  <flexbox>
    <flexbox-item>
      <div class="flex-demo" @click.stop="clickLink(total, 'total')">
        <span :class="[status == '3' ? '' : 'green', 'sale-number']">{{ total }}</span><br>
        <span>总售出</span>
      </div>
    </flexbox-item>
    <flexbox-item>
      <div class="flex-demo" @click.stop="clickLink(personal, 'personal')">
        <span :class="[status == '3' ? '' : 'green', 'sale-number']">{{ personal }}</span><br>
        <span>个人业绩</span>
      </div>
    </flexbox-item>
    <flexbox-item>
      <div class="flex-demo">
        <span :class="[(remain == 0) || (status == '3') ? '' : 'green', 'sale-number']">{{ remain }}</span><br>
        <span>剩余可售</span>
      </div>
    </flexbox-item>
    <flexbox-item :span="1" v-if="showArrow">
      <div class="flex-demo">
        <span>></span>
      </div>
    </flexbox-item>
  </flexbox>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    Flexbox,
    FlexboxItem
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
    },
    showArrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    clickLink (number, type) {
      if (Number(number) > 0) {
        this.$emit('clicked', type)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .flex-demo {
    text-align: center;
    font-size: 13px;
  }
  .sale-number{
    font-size: 24px;
    font-weight: 500;
  }
  .green{
    color: #60c9cf;
  }
</style>
