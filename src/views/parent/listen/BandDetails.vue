<template>
  <div class="study-page">
    <x-button class="button">还能听三条共听</x-button>
    <div>
      <div class="cl-module">
        <Voice>
        </Voice>
        <div class="reta">
          <div>
            <span><img src="../../../../static/img/headset.png"></span>
            <span>{{listening}}</span>
          </div>
          <div>
            <span><img src="../../../../static/img/thumb_.png"></span>
            <span  :style="{ color:activeColor }">{{thumbs}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton
} from 'vux'
import Voice from '../../../components/Voice'
// const version = require('../package.json').version
export default {
  name: 'filter',
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton,
    Voice
  },
  data () {
    return {
      time: '2017.12.22',
      listening: '3232',
      thumbs: '1266',
      activeColor: '#c8d2dc'
    }
  }
}
</script>

<style scoped lang="scss">
.time{
  margin: 15px;
  color: #6c7b8a;
}
.reta{
  div{
    margin-left: 15px;
  }
  img{
    width: 24px;
    height: 24px;
    margin-right: 15px;
  }
  span:nth-child(even){
    position: relative;
    top: -8px;
  }
  margin-left: 15px;
  div:nth-child(1){
    float: left;
    width: 50%;
    span:nth-child(even){
      color: #00a6ac;
    }
  }
  div:nth-child(2){
    float: left;
  }
}
.button{
  background: #60c9cf;
  color: #ffffff;
}
</style>
