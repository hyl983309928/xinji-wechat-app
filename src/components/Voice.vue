<template>
  <div class="cl-m-header">
    观察（7-9岁）
  </div>
  <div class="cl-m-body">
    <p class="head">
      <span><img src="../../static/img/person.png"></span>
      <span><img src="../../static/img/time.png"></span>
    </p>
    <div class="intro">
      {{intro}}
    </div>
    <hr>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton
} from 'vux-components'
// const version = require('../package.json').version
export default {
  name: 'filter',
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton
  },
  data () {
    return {
      time: '2017.12.22',
      intro: '一句简介一句简介',
      listening: '123214',
      thumbs: '114125'
    }
  }
}
</script>

<style scoped lang="scss">
.cl-m-body{
  color: #323b46;
}
.head{
  span:nth-child(odd){
    img{
      height: 40px;
      width: 40px;
      margin-right: 15px;
      margin-left: 15px;
    }
  }
  span:nth-child(even){
    img{
      height: 42px;
      width: auto;
    }
  }
}
.intro{
  margin: 15px;
}
hr{
  opacity: 0.3;
  margin: 15px 15px 0px 15px;
}
</style>
