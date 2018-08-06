<template>
  <ul class="course-list">
    <transition-group name="staggered-fade">
      <li class="show-icon lanmacolor" @click="showList=!showList" key="top">展开查看全部课程 ﹀</li>
      <li class="list" v-if="showList" v-for="(item, index) in courseList" :key="'middle'+index" @click="goto(item.link)">
        <span class="lanmacolor">课程 {{ index+1 }}</span>
        <span class="course">{{ item.text }} </span>
        <span class="fr">></span>
      </li>
      <!--<li v-if="showList" class="show-icon lanmacolor" @click="showList=false" key="bottom">︿</span></li>-->
    </transition-group>
  </ul>
</template>

<script>
export default {
  components: {},
  props: {
    courseList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      showList: false
    }
  },
  created () {},
  methods: {
    goto(link) {
      this.$router.push(link)
    }
  }
}
</script>

<style scoped lang="scss">
.course-list{
  font-size: 13px;
  background-color: #fff;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  .show-icon{
    text-align: center;
  }
  .lanmacolor{
    color:#00a6ac;
  }
  .course{
    margin-left: 30px;
  }
  li{
    margin: 0 20px;
    padding: 11px 0;
  }
  .list{
    margin: 0 15px;
    padding: 11px 0;
    border-top: 1px solid #efeff4;
  }
  .fr{
    color: #efeff4;
    float: right;
  }
}
</style>
