<template>
  <div>
    <p v-for="(item, index) in textList" v-if="marginType=='left'">
      <span class="left">{{ item }}</span>
      <span class="right" :style="{'margin-left':marginSpace}">{{ item.match('价格')?'¥':'' }}{{ dataList[index] }}</span>
    </p>
    <p v-for="(item, index) in textList" class="flex-wrap" v-if="marginType=='between'">
      <span class="left">{{ item }}</span>
      <span class="right">{{ item.match('价格')?'¥':'' }}{{ dataList[index] }}</span>
    </p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    marginType: {
      type: String,
      default: 'left' // left、between
    },
    marginSpace: { // 类型为 left 时 有效
      type: String,
      default: '10px'
    },
    textList: {
      type: Array,
      default: []
    },
    dataList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {}
  },
  created () {}
}
</script>

<style scoped lang="scss">
  .flex-wrap {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
  }
  .left{
    font-size: 13px;
    font-weight: 300;
    color: #6c7b8a;
  }
  .right{
    font-size: 13px;
    font-weight: 300;
    color: #323b46;
  }
</style>
