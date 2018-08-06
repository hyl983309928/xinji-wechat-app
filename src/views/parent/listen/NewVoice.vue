<template>
  <div class="study-page">
    <x-button class="button">次数已用完</x-button>
    <div>
      <div class="cl-module">
        <div class="cl-m-body">
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
    <div class="weui_dialog_confirm">
      <div class="weui_mask"></div>
      <div class="weui_dialog">
        <div class="weui_dialog_hd"><strong class="weui_dialog_title">是否支付10学币</strong></div>
        <div class="weui_dialog_bd">获得3次机会，点赞完成打赏</div>
        <div class="weui_dialog_ft">
          <a href="#" class="weui_btn_dialog default">取消</a>
          <a href="#" class="weui_btn_dialog primary">支付</a>
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
      listening: '123214',
      thumbs: '114125',
      activeColor: '#c8d2dc'
    }
  }
}
</script>

<style scoped lang="scss">
.cl-m-body{
  color: #323b46;
}
.time{
  margin: 15px;
  color: #6c7b8a;
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
  margin: 15px;
}
.reta{
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
  color:#ffffff;
}
.weui_dialog_confirm .weui_dialog .weui_dialog_bd{
  text-align: center;
}
</style>
