<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="face">
        <div class="label">
          <span>观察</span>
          <span>7-9岁</span>
        </div>
        <div class="show">
          <div class="learn">
            <span>{{num}}学币</span>
          </div>
          <p class="line">
            <span>{{sound}}</span>
            <span><img src="../../../../static/img/line.jpg"></span>
          </p>
          <p class="listen">
            <span>{{linsten}}</span>
            <span><img src="../../../../static/img/listen_.jpg"></span>
          </p>
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="face">
        <div class="label">
          <span>心理倾向</span>
          <span>7-9岁</span>
        </div>
        <div class="show">
          <div class="learn">
            <span>{{num}}学币</span>
          </div>
          <p class="line">
            <span>{{sound}}</span>
            <span><img src="../../../../static/img/line.jpg"></span>
          </p>
          <p class="listen">
            <span>{{linsten}}</span>
            <span><img src="../../../../static/img/listen_.jpg"></span>
          </p>
        </div>
      </div>
    </div>
    <div class="cl-module">
      <div class="face">
        <div class="show">
          <div class="token">
            <span>{{num}}学币</span>
          </div>
          <p class="headset">
            <img src="../../../../static/img/match.png">
          </p>
          <p class="listen">
            <span>{{linsten}}</span>
            <span>耳机</span>
          </p>
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
      num: '10',
      sound: '231',
      linsten: '12345545'
    }
  }
}
</script>

<style scoped lang="scss">
%learn{
  width: 60px;
  height: 30px;
  box-shadow: -2px 2px 6px 0 rgba(0,0,0,0.2);
  background: #60c9cf;
  text-align: center;
  position: relative;
  span{
    color: #ffffff;
    font-size: 13px;
  }
}
.learn{
  @extend %learn;
  top: -25px;
  right: -60px;
}
.token{
  @extend %learn;
  top: 15px;
  right: -73px;
}
.face{
  height: 200px;
  color: #ffffff;
  width: auto;
  background: #000000;
  .label{
    span{
      margin-left: 15px;
      position: relative;
      top: 155px;
    }
    span:nth-child(1){
      font-size: 24px;
    }
  }
  .show{
    float:right;
    margin-right: 15px;
    p,.headset{
      position: relative;
      span:nth-child(1){
        margin-right: 10px;
      }
    }
    .line{
      top: 65px;
      right: -40px;
      img{
        height: 15px;
        width: 18px;
      }
    }
    .listen{
      top: 70px;
      img{
        height: 15px;
        width: 18px;
      }
    }
    .headset{
      right: -55px;
      top: 65px;
      img{
        height: 60px;
        height: 60px;
      }
    }
  }
}
.weui_dialog_confirm .weui_dialog .weui_dialog_bd{
  text-align: center;
}
</style>
