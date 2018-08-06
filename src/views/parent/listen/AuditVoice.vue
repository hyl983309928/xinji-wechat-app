<template>
  <div class="study-page">
    <div v-for="item in itemList">
      <div class="time">
        {{ item.time }}
      </div>
      <div class="cl-module">
        <Voice>
        </Voice>
        <div class="tips">
          <span>待审核</span>
          <div class="listens">
            <img src="../../../../static/img/headset.png" alt="">
            <span>{{listen}}</span>
          </div>
          <div class="thumb">
            <img src="../../../../static/img/thumb_.png" alt="">
            <span>{{thumbs}}</span>
          </div>
        </div>
        <div class="delete" @click="delete()">
          <span slot="icon" class="iconfont icon-close"></span>
        </div>
      </div>
    </div>
    <div v-for="line in lineList">
      <div class="time">
        {{ line.time }}
      </div>
      <div class="cl-module">
        <Voice>
        </Voice>
        <div class="tips">
          <span id="line">已上线</span>
          <div class="listens">
            <img src="../../../../static/img/headset.png" alt="">
            <span>{{listen}}</span>
          </div>
          <div class="thumb">
            <img src="../../../../static/img/thumb_.png" alt="">
            <span>{{thumbs}}</span>
          </div>
        </div>
        <div class="delete" @click="cancel()">
          <span slot="icon" class="iconfont icon-close"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Tabbar,
  TabbarItem
} from 'vux'
import Voice from '../../../components/Voice'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    TabbarItem,
    Voice
  },
  data () {
    return {
      intro: '一句话简介一句话简介',
      listen: '0',
      thumbs: '0',
      itemList: [
        {
          time: '2017.2.22'
        }
      ],
      lineList: [
        {
          time: '2017.2.21'
        }
      ]
    }
  },
  methods: {
    delete (index) {
      this.itemList.splice(index, 1)
    },
    cancel (index) {
      this.lineList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
.time{
  margin: 15px;
  color: #6c7b8a;
}
.tips{
  margin-left: 15px;
  span:nth-child(1){
    float: left;
    margin-left: 15px;
    width: 30%;
    color: #c96060;
  }
  div{
    float: left;
    width: 30%;
    span{
      position: relative;
      top: -8px;
    }
  }
  #line{
    color: #60c9cf;
  }
}
.intro{
  margin-top: 15px;
}
.listens,.thumb{
  width: 45px;
  height: auto;
  img{
    height: 24px;
    width: 24px;
  }
}
.delete{
  background: #c96060;
  margin-top: -10px;
  width: 50px;
  height: 50px;
  line-height: 35px;
  box-shadow: -1px -1px 4px 0 rgba(0,0,0,0.2);
  float: right;
  padding-left: 5px;
  border-radius:50%;
  margin-right: -25px;
  position: relative;
  bottom: -20px;
  color: #ffffff;
  span{
    margin-left: 5px;
  }
}
</style>
