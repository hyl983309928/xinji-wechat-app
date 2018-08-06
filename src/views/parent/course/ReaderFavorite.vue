<template>
  <div class="study-page">
    <ReaderItem v-for="reader in list" :detail="reader">
    </ReaderItem>
    <p class="emptySug" v-if="list.length === 0">暂无相应的文章</p>
  </div>
</template>

<script>
import { Tabbar, Cell, Group, Badge, Actionsheet } from 'vux'
import ReaderItem from 'components/ReaderItem'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    ReaderItem
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
    labelModule.getLabelList().then((list) => {
      console.log(list)
      this.labelTree = labelModule.getLabelTree(list)
      console.log(this.labelTree)
      this.getList()
    })
  },
  methods: {
    getList () {
      api.reader.favoriteList().then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var reader = list[i]
          reader.link = '/parent/course/reader_detail/' + reader.id
          reader.theme_title = this.$label.getThemeLabel(reader.theme_label)
          reader.age_title = this.$label.getLabel(reader.age_label).title
          reader.favorite = 1
          console.log(reader.theme_title)
          // reader = this.$course.formatCourse(reader)
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
