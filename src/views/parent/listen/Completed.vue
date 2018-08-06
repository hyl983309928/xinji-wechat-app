<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="cl-m-header">
        语音介绍
      </div>
      <div class="cl-m-body">
        <div class="intro">
          {{intro}}
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        标签选择
      </div>
      <div class="cl-m-body">
        <div class="result">
          <span>
            {{age}}
          </span>
          <span>
            {{survey}}
          </span>
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        语音录制
      </div>
      <div class="cl-m-body">
        <div class="start">
          <span><img src="../../../../static/img/record.png"></span>
          <span><img src="../../../../static/img/repeal.png"></span>
        </div>
      </div>
    </div>
    <x-button class="button">发起</x-button>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton,
  XInput
} from 'vux'
// const version = require('../package.json').version
export default {
  name: 'filter',
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton,
    XInput
  },
  data () {
    return {
      age: '7-9岁',
      survey: '观察',
      intro: '一句话简介'
    }
  }
}
</script>

<style scoped lang="scss">
.cl-m-body{
  color: #323b46;
}
.intro{
  border:solid 1px #efeff4;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
.result{
  margin-left: 15px;
  margin-right: 15px;
  span:nth-child(2){
    float: right;
  }
}
.start{
  span{
    margin-right: 30px;
    margin-left: 30px;
  }
  img{
    height: 42px;
  }
}
div.weui_cell_ft{
  display: none;
}
.button{
  background: #00a6ac;
  color: #ffffff;
}
</style>
