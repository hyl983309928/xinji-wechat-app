<template>
  <div class="study-page">
    <LearnItem v-for="learn in list" :detail="learn">
    </LearnItem>
    <p class="emptySug" v-if="list.length === 0">暂无相应的共学课程</p>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  Actionsheet
} from 'vux'
import LearnItem from 'components/LearnItem'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    LearnItem
  },
  data () {
    return {
      labelTree: {},
      filter: {},
      list: [],
      signInfo: {},
      menus: {},
      subMenus: {},
      menuId: 0,
      subMenuId: 0,
      showMenu: false,
      showSubMenu: false
    }
  },
  created () {
    var filterStr = this.$route.params.filter
    this.filter = JSON.parse(filterStr)

    labelModule.getLabelList().then((list) => {
      console.log(list)
      this.labelTree = labelModule.getLabelTree(list)
      console.log(this.labelTree)
      this.getList()
    })
  },
  methods: {
    getList () {
      var filterStr = JSON.stringify(this.filter)
      var params = {label: filterStr}
      api.learn.filter(params).then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var learn = list[i]
          learn.link = '/parent/course/learn_detail/' + learn.id
          learn.theme_title = this.$label.getThemeLabel(learn.theme)
          learn.age_title = this.$label.getLabel(learn.age).title
          console.log(learn.theme_title)
          // learn = this.$course.formatCourse(learn)
        }
        console.log(JSON.stringify(list))
        // this.getFavorite()
        this.list = list
      })
    }
  }
}
</script>

<style scoped lang="scss">

.nav{
  height: 50px;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #cdcdcd;
  span{
    display: inline-block;
    float: left;
    height: 50px;
    line-height: 50px;
    width: 24.5%;
    border-right: 1px solid #cdcdcd;
    font-size: 16px;
    text-align: center;
    color:#353535;
  }
  span:last-child{
    border-right:none
  }
}
img{
  height: auto;
  width: 100%;
}
.details{
  margin-top: -55px;
  margin-left: 10px;
  color: #ffffff;
}
.emptySug {
  line-height: 40px;
  text-align: center;
}
</style>
