<template>
  <div class="material-list">
    <material-item v-for="material in list" :material="material">
    </material-item>
    <p class="emptySug" v-if="list.length === 0">暂无相应的课程</p>
    <button class="add-material-btn iconfont icon-plus" @click="goToAdd"></button>
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
import MaterialItem from 'components/MaterialItem'

import labelModule from 'lanmaLib/modules/label'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    Actionsheet,
    MaterialItem
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
    this.getList()
    labelModule.getLabelList().then((list) => {
      console.log(list)
      this.labelTree = labelModule.getLabelTree(list)
      console.log(this.labelTree)
    })
  },
  methods: {
    goToAdd () {
      this.$router.push('/agency/add_material')
    },
    getList () {
      this.$api.material.getAgencyMaterial().then((data) => {
        console.log(data)
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var material = list[i]
          material.link = '/agency/edit_material/' + material.id
          material = this.$material.formatMaterial(material)
        }
        console.log(list)
        this.list = list
      })
    }
  }
}
</script>

<style scoped lang="scss">
.material-list{
  margin-bottom:60px;
}
.add-material-btn{
  position: fixed;
  bottom: 65px;
  right: 10px;
  width: 60px;
  height: 60px;
  background-color: #00a6ac;
  border-radius: 30px;
  border:none;
  color:#fff;
  font-size:32px;
  z-index: 400;
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
