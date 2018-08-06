<template>
  <div>
    <div class="type-select" v-for="(item, optindex) in options" v-if="item">
        <label class="demo--label">
          <input class="demo--radio" type="checkbox" @change="updateValue(localAnswerList)" :name="'demo-checkbox'+checkboxname" :value="num2CharMap[optindex]" v-model="localAnswerList" :disabled="isDisabled">
          <span class="demo--checkbox demo--checkboxInput weui-icon-checked vux-checklist-icon-checked" :class="{ hide: isDisabled && answerList.indexOf(num2CharMap[optindex])==-1}"></span>
          <span>{{ num2CharMap[optindex] }}</span>{{ item }}
        </label>
      </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'answerList',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
      default: []
    },
    answerList: '',
    checkboxname: '',
    isDisabled: false
  },
  data () {
    return {
      num2CharMap: ['A', 'B', 'C', 'D'],
      localAnswerList: this.answerList
    }
  },
  created () {},
  methods: {
    updateValue(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped lang="scss">
  .type-select {
    font-size: 17px;
    padding: 0 15px;
    span {
      margin: 0 10px 0 0;
    }
    .demo--label {
      margin: 15px 20px 0 0;
      display: flex;
      justify-content: flex-start;
    }
    .demo--radio {
      display: none
    }
    .demo--radioInput {
      background-color: #fff;
      border: 1px solid #c8d2dc;
      border-radius: 100%;
      display: inline-block;
      height: 18px;
      margin-right: 10px;
      margin-top: 3.5px;
      margin-bottom: 0px;
      vertical-align: middle;
      width: 18px;
      line-height: 1;
      flex-shrink: 0;
    }
    .demo--radio:checked+.demo--radioInput:after {
      background-color: #00a6ac;
      border-radius: 100%;
      content: "";
      display: inline-block;
      height: 12px;
      margin: 3px;
      width: 12px
    }
    .demo--checkboxInput {
      background-color: #fff;
      border: 1px solid #c8d2dc;
      border-radius: 100%;
      display: inline-block;
      height: 18px;
      margin-right: 10px;
      margin-top: 3.5px;
      margin-bottom: 0px;
      vertical-align: middle;
      width: 18px;
      line-height: 1;
      flex-shrink: 0;
    }
    .demo--radio:checked+.demo--checkboxInput:after {
      content: '\EA06';
      color: #00a6ac;
      display: inline-block;
      font-size: 20px;
      margin: -1px 0px 0px -1px;
    }
  }
  .hide{
    visibility: hidden;
  }
</style>
