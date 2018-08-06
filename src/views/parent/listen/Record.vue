<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="cl-m-header">
        语音介绍
      </div>
      <div class="cl-m-body">
        <x-input placeholder="请输入一段话简单介绍分享内容">
        </x-input>
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        标签选择
      </div>
      <div class="cl-m-body">
        <div class="choose">
          <select v-model="age">
            <option selected>选择年龄</option>
            <option>3~6岁</option>
            <option>7~9岁</option>
            <option>10~12岁</option>
          </select>
          <select v-model="theme">
            <option selected>请选择</option>
            <option>学会学习</option>
            <option>学会做事</option>
            <option>学会相处</option>
          </select>
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
          <span><img src="../../../../static/img/start.png"></span>
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
    }
  }
}
</script>

<style scoped lang="scss">
.choose{
  text-align: center;
  select{
    -webkit-appearance: none;
    height: 50px;
    width: 40%;
    border: none;
    font-size: 14px;
    padding-left: 45px;
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
