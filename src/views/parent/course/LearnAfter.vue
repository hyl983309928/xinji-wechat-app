<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="cl-m-body">
        <router-link :to="'/parent/course/learn_detail/' + id">
          <div class="data">
            <div class="common">
              <img src="/static/img/class-data.png">
            </div>
            <div>
              上课资料
            </div>
          </div>
        </router-link>
        <hr>
        <router-link :to="'/parent/course/learn_homework/' + id">
          <div class="home_work">
            <div class="common">
              <img src="/static/img/after-work.png">
            </div>
            <div>
              课后作业
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <router-link :to="'/parent/course/learn_report/' + id">
      <button class="page-submit-btn">报告</button>
    </router-link>
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
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton
  },
  data () {
    return {
      id: 0
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
  },
  methods: {
    gotoReport () {
    }
  }
}
</script>

<style scoped lang="scss">
.cl-m-body{
  text-align: center;
  div{
    height: 120px;
    &:nth-child(even){
      line-height:120px;
      color:#6c7b8a;
    }
  }
}
.common{
  float: left;
  width: 50%;
}
img{
  height: 120px;
  width:120px;
}
hr{
  margin: 30px auto;
  opacity: 0.3;
}
button{
  height: 50px;
}
</style>
