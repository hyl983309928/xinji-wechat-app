<template>
<div class="study-page">
  <div class="nav">
  </div>
  <img src="/static/img/course_img.gif" class="img">
  <Tag>
  </Tag>
  <img src="/static/img/detail_img.gif" class="img">
  <div class="add" v-link="{path:'/agency/compile'}">
    <div>
      <img src="/static/img/add.png">
    </div>
  </div>
</div>
</template>

<script>
import {
  Tabbar,
  TabbarItem,
  Cell,
  Group,
  Badge,
  Selector
} from 'vux'
import Tag from '../../components/Tag'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    TabbarItem,
    Cell,
    Group,
    Badge,
    Selector,
    Tag
  },
  data () {
    return {
      isA: false,
      isB: false,
      isC: false,
      isD: false,
      age: '',
      theme: '',
      object: '',
      time: ''
    }
  },
  methods: {
    change () {
      this.isA = !this.isA
    },
    checkout () {
      this.isB = !this.isB
    },
    toggle () {
      this.isC = !this.isC
    },
    cut () {
      this.isD = !this.isD
    }
  }
}
</script>

<style scoped lang="scss">
.active-a,
.active-c,
.class-a,
.class-c {
    background: url("/static/img/down.png") no-repeat scroll 85px 22px transparent;
}
.active-b,
.active-d,
.class-b,
.class-d {
    background: url("/static/img/up.png") no-repeat scroll 85px 22px transparent;
}
.nav {
    height: 50px;
    width: 100%;
    background-color: #ffffff;
    select {
        -webkit-appearance: none;
        height: 50px;
        width: 24%;
        border: none;
        font-size: 15px;
        padding-left: 25px;
    }
}
.img {
    height: auto;
    width: 100%;
}
.add {
    width: 60px;
    height: 60px;
    background-color: #00a6ac;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
    border-radius: 50%;
    position: fixed;
    bottom: 100px;
    right: 30px;
    text-align: center;
    div {
        line-height: 70px;
    }
}
</style>
