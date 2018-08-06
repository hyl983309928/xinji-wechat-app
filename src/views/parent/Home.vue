<template>
  <div class="study-page">
    <div class="index-banner">
      <img src="/static/img/index_banner.jpg">
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        本月成长
      </div>
      <div class="cl-m-body">
        <div class="rater">
          <span><img src="/static/img/rater.png"></span>
          <span><img src="/static/img/rater.png"></span>
          <span><img src="/static/img/rater.png"></span>
          <span><img src="/static/img/rater_dull.png"></span>
          <span><img src="/static/img/rater_dull.png"></span>
        </div>
        <div class="grow">
          <div class="bar">
            <div class="project_bar">
            </div>
          </div>
          <p class="ranking">
            <span>100</span>
            /800
          </p>
          <p class="exceed">
            您已超过<span>48%</span>的妈妈
          </p>
        </div>
      </div>
    </div>
    <div class="cl-module com btn-list">
      <div>
        <p>
          <img src="/static/img/listen.png">
        </p>
        共听
      </div>
      <router-link :to="'/parent/course/filter'" class="study-btn">
        <div>
          <p>
            <img src="/static/img/study.png">
          </p>
          共学
        </div>
      </router-link>
      <div>
        <p>
          <img src="/static/img/refuel.png">
        </p>
        加油
      </div>
    </div>
    <div>
      <tabbar>
        <tabbar-item selected>
          <span slot="icon" class="iconfont icon-home"></span>
          <span slot="label">主页</span>
        </tabbar-item>
        <tabbar-item link="/parent/ucenter" >
          <span slot="icon" class="iconfont icon-ucenter" link="/parent/ucenter"></span>
          <span slot="label" link="/parent/ucenter">个人</span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
</template>

<script>
import {
  Tabbar,
  TabbarItem,
  Cell,
  Group,
  Badge
} from 'vux'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    TabbarItem,
    Cell,
    Group,
    Badge
  },
  data () {
    return {
      //   version: version
      // path: '/',
      // url: '/static/img/person_.png'

    }
  }
}
</script>

<style scoped lang="scss">
.btn-list{
  color:#6c7b8a;
}
.study-btn{
  color:#6c7b8a;
}
.index-banner{
  img{
    width: 100%;
    height: auto;
  }
}
.rater{
  text-align: center;
  margin-left: 25px;
  margin-right: 25px;
   span{
    width: 20%;
    float: left;
  }
}
.com{
  padding: 25px 0;
   div{
    float: left;
    width: 33%;
    text-align: center;
  }
}
.grow{
  margin-left: 25px;
  margin-right: 25px;
  .ranking{
    margin-left: 10px;
  }
  span{
    color:#00a6ac;
  }
  .bar{
    width: 100%;
    height: 12px;
    background: #ffffff;
    border:solid 3px #323b46;
    border-radius:12px;
    margin-top:80px;
    margin-bottom: 5px;
    .project_bar{
      width: 48%;
      background:#60c9cf;
      height: 12px;
      border-radius:6px;
    }
  }
  .exceed{
    float: right;
    margin: 0px 10px 10px 0;
  }
}
</style>
