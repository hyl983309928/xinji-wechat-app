<template>
  <div class="study-page">
    <div v-for="voice in voiceList">
      <div class="time">
        {{ voice.time }}
      </div>
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
              <span><img src="../../../../static/img/thumb.png"></span>
              <span>{{thumbs}}</span>
            </div>
            <div class="cancel" @click="cancel()">
              <span slot="icon" class="iconfont icon-minus"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="time" v-for="voice in voiceList">
        {{ voice.time }}
      </div>
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
              <span><img src="../../../../static/img/thumb.png"></span>
              <span>{{thumbs}}</span>
            </div>
            <div class="cancel"  @click="cancel()">
              <span slot="icon" class="iconfont icon-minus"></span>
            </div>
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
      listening: '123245',
      thumbs: '114125',
      voiceList: [
        {
          time: '2017.2.22'
        }
      ]
    }
  },
  methods: {
    cancel (index) {
      this.voiceList.splice(index, 1)
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
    color: #60c9cf;
    position: relative;
    top: -8px;
  }
  margin-left: 15px;
  div:nth-child(1){
    float: left;
    width: 50%;
  }
  div:nth-child(2){
    float: left;
  }
}
.cancel{
  margin-top: -10px;
  width: 50px;
  height: 50px;
  line-height: 35px;
  box-shadow: -1px -1px 4px 0 rgba(0,0,0,0.2);
  float: right;
  padding-left: 5px;
  border-radius:50%;
  margin-right: -40px;
  position: relative;
  top: 20px;
  right: 15px;
  color: #c96060;
  span{
    margin-left: 5px;
  }
}
</style>
