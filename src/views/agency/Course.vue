<template>
<div class="study-page">
  <div class="nav">
    <tab :line-width="0" class="tab" active-color="#353535">
      <tab-item class="tabitem" :selected="currentTab === 1" @click.native="toggle(1)">待上课</tab-item>
      <tab-item class="tabitem" :selected="currentTab === 2" @click.native="toggle(2)">上课中<span v-if="isEedDot" class="redDot"></span></tab-item>
      <tab-item class="tabitem" :selected="currentTab === 3" @click.native="toggle(3)">课后</tab-item>
      <tab-item class="tabitem" :selected="currentTab === 4" @click.native="toggle(4)">结束</tab-item>
      <!--<tab-item class="tabitem" :selected="currentTab === 5" @click.native="toggle(5)">未确认</tab-item>-->
    </tab>
  </div>
  <div class="manage-list">
    <ManageItem :course="course" :tab="currentTab" v-for="course in list" :confirmCallback="confirm">
    </ManageItem>
    <p class="emptySug" v-if="list.length === 0 && !loading">暂无相应的课程</p>
  </div>
</div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton,
  XInput,
  Selector,
  Tab,
  TabItem
} from 'vux'
import ManageItem from '../../components/ManageItem'
import { mapGetters } from 'vuex'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton,
    XInput,
    Selector,
    ManageItem,
    Tab,
    TabItem
  },
  data () {
    return {
      list: [],
      currentTab: 1,
      loading: false,
      thirdPartyList: {},
      isEedDot: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      loginState: 'loginState'
    })
  },
  created () {
    this.countIsEedDot()
    this.$axios.all([this.getThirdPartyList()])
      .then(() => {
        this.getList()
      })
  },
  methods: {
    countIsEedDot () {
      var param = {}
      var search = {}
      var agencyId = this.$common.getAgencyId()
      search.agency_id = agencyId
      param.status = 8
      this.$api.course.getList(param).then((data) => {
        if (data.list.length !== 0) {
          this.isEedDot = true
        }
      })
    },
    toggle (tab) {
      this.currentTab = tab
      this.list = []
      this.loading = true
      this.getList()
    },
    getList () {
      var param = {}
      var search = {}

      switch (this.currentTab) {
        case 1:
          search.status = 7
          break
        case 2:
          search.status = 8
          break
        case 3:
          search.status = 9
          break
        case 4:
          search.status = 10
          break
        case 5:
          search.status = 0
          break
        default:
          break
      }
      var agencyId = this.$common.getAgencyId()
      console.log(agencyId)
      search.agency_id = agencyId
      // search.user_id = 0
      // param.search = JSON.stringify(search)
      param.status = search.status

      this.$api.course.getList(param).then((data) => {
        var list = data.list
        for (var i = 0; i < list.length; i++) {
          var course = list[i]
          course.link = '/parent/course/detail/' + course.id
          course.thirdPartyName = this.thirdPartyList[course.userId] ? this.thirdPartyList[course.userId].name : ''
          course = this.$course.formatCourse(course)
        }
        this.list = list.sort((a, b) => {
          var res = Date.parse(a.lesson_time) - Date.parse(b.lesson_time)
          if (search.status >= 9) res = -res
          return res
        })
        this.loading = false
      }).catch((error) => {
        if (error.code === 6005) {
          console.log('redirect /agency/apply')
          this.$router.push('/agency/apply')
        }
        this.loading = false
      })
    },
    getThirdPartyList () {
      var params = {
        offset: 0,
        length: 0
      }
      return this.$api.thirdParty.getThirdPartyList(params)
        .then((data) => {
          var temp = {}
          for (var i = 0; i < data.list.length; i++) {
            temp[data.list[i].user_id] = data.list[i]
          }
          this.thirdPartyList = temp
        })
    },
    confirm () {
      this.toggle(1)
    }
  }
}
</script>

<style scoped lang="scss">
.manage-list{
  margin-bottom: 60px;
  margin-top:60px;
}
.expand-transition {
    transition: all 0.3s ease;
    overflow: hidden;
}
.expand-enter,
.expand-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
}
.nav {
    margin-top: 0;
    margin-left: 0;
    width: 100%;
    position: fixed;
    top:0;
    .tab {
        height: 50px;
    }
}
hr {
    margin: 25px 15px 0;
    opacity: 0.3;
}
.sign {
    margin: 15px 0 5px 15px;
    .sure {
        color: #60c9cf;
        font-size: 24px;
    }
    span {
        margin-right: 30px;
        color: #6c7b8a;
    }
}
.public {
    float: right;
    height: 57px;
    line-height: 57px;
    text-align: center;
    margin-right: 15px;
    width: 60px;
    color: #60c9cf;
    box-shadow: 0 -1px 2px 0 #60c9cf;
    border-radius: 50px;
    span {
        margin-left: 10px;
    }
}
.vux-tab-selected {
    background-color: #eaeaea;
}
.emptySug {
  line-height: 40px;
  text-align: center;
}
.redDot{
  display: inline-block;
  width:8px;
  height:8px;
  border-radius: 50% 50%;
  background: red;
  position: absolute;
  top:10px;
}
</style>
