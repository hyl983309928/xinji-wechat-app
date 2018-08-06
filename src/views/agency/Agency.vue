<template>
<div>
  <div class="agency-page">
    <router-view></router-view>
  </div>
  <!--<tabbar solt="bottom" v-if="pathList.indexOf(this.$route.path) !== -1">
    <tabbar-item :selected="$route.path === '/agency/course'" link="/agency/course">
      <span slot="icon" class="iconfont icon-course"></span>
      <span slot="label">课程</span>
    </tabbar-item>
    <tabbar-item :selected="$route.path === '/agency/material'" link="/agency/material">
      <span slot="icon" class="iconfont icon-material"></span>
      <span slot="label">资料</span>
    </tabbar-item>
    <tabbar-item :selected="$route.path === '/agency/person'" link="/agency/person">
      <span slot="icon" class="iconfont icon-ucenter"></span>
      <span slot="label">个人</span>
    </tabbar-item>
  </tabbar>-->
</div>
</template>

<script>
import {
  Tabbar,
  TabbarItem
} from 'vux'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      //   version: version
      navShow: false,
      pathList: ['/agency/course', '/agency/material', '/agency/person']
    }
  },
  created () {
    var uid = this.$common.getUid()
    if (uid) {
      this.$user.getCurrentUserInfo().then((userInfo) => {
        var agency = userInfo.agency
        var roleId = userInfo.role_id
        var agencyStatus = agency ? agency.status : 0
        if (roleId !== 3 || agencyStatus === 0) {
          // this.$router.push('/agency/apply')
        }
      })
    }
  },
  methods: {
  }
}
</script>
<style>

</style>
