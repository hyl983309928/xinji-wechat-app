<template>
  <div class="study-page">
    <OldReaderItem v-for="reader in list" :detail="reader">
    </OldReaderItem>
    <p class="emptySug" v-if="list.length === 0">暂无相应的文章</p>
  </div>
</template>

<script>
import { Tabbar, Cell, Group, Badge, Actionsheet } from 'vux'
import OldReaderItem from 'components/OldReaderItem'

import api from 'lanmaLib/common/api'
import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    OldReaderItem
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
    showFilter (labelId) {
      var childs = this.labelTree[labelId].childs
      this.menuId = labelId
      this.subMenuId = 0
      var menus = {}
      for (var id in childs) {
        if (childs.hasOwnProperty(id)) {
          menus[id] = childs[id].title
        }
      }
      this.menus = menus
      this.showMenu = true
    },
    clickMenu (labelId) {
      if (this.menuId === 1) {
        var childs = this.labelTree[1].childs[labelId].childs
        this.subMenuId = labelId
        var menus = {}
        for (var id in childs) {
          if (childs.hasOwnProperty(id)) {
            menus[id] = childs[id].title
          }
        }
        this.subMenus = menus
        this.showSubMenu = true
      } else {
        this.filterCourse(this.menuId, labelId)
      }
      this.showMenu = false
    },
    clickSubMenu (labelId) {
      this.showSubMenu = false
      this.filterCourse(this.subMenuId, labelId)
    },
    filterCourse (parentId, id) {
      this.filter[parentId] = id
      this.getList()
    },
    // getFavorite () {
    //   this.$api.reader.getFavorite().then((data) => {
    //     var list = data.list
    //   })
    // },
    getList () {
      var params = this.filter
      api.reader.filter(params).then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var reader = list[i]
          reader.link = '/parent/course/reader_detail/' + reader.id
          reader.theme_title = this.$label.getThemeLabel(reader.theme_label)
          reader.age_title = this.$label.getLabel(reader.age_label).title
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
