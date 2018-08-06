<template>
  <div class="study-page">
    <tab :line-width="0" class="tab" active-color="#353535">
      <tab-item :selected="currentTab === 1" @click.native="showBuy">
        已购买
      </tab-item>
      <tab-item :selected="currentTab === 2" @click.native="showFavorite">
        已收藏
      </tab-item>
    </tab>
    <LearnItem v-for="learn in list" :detail="learn">
    </LearnItem>
    <p class="emptySug" v-if="list.length === 0">暂无相应的课程</p>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  Actionsheet,
  Tab,
  TabItem
} from 'vux'
import LearnItem from 'components/LearnItem'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Tab,
    TabItem,
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    LearnItem
  },
  data () {
    return {
      currentTab: 1,
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
    var tab = parseInt(this.$route.params.tab)
    if (isNaN(tab) || tab < 1) {
      tab = 1
    }
    this.currentTab = tab
    labelModule.getLabelList().then((list) => {
      console.log(list)
      this.labelTree = labelModule.getLabelTree(list)
      console.log(this.labelTree)
      this.showBuy()
    })
  },
  methods: {
    showBuy () {
      this.currentTab = 1
      this.getBuyList()
    },
    showFavorite () {
      this.currentTab = 2
      this.getList()
    },
    getBuyList () {
      api.learn.userLearnCourse().then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var learn = list[i]
          learn.theme_title = this.$label.getThemeLabel(learn.theme)
          learn.age_title = this.$label.getLabel(learn.age).title
          learn.favorite = 1
          console.log(learn.theme_title)
          // learn = this.$course.formatCourse(learn)
        }
        console.log(JSON.stringify(list))
        // this.getFavorite()
        this.list = list
      })
    },
    getList () {
      api.learn.favoriteList().then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var learn = list[i]
          learn.link = '/parent/course/learn_detail/' + learn.id
          learn.theme_title = this.$label.getThemeLabel(learn.theme)
          learn.age_title = this.$label.getLabel(learn.age).title
          learn.favorite = 1
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
div.vux-tab .vux-tab-selected{
  background: #eaeaea;
}
</style>
