<template>
  <div class="study-page">
    <div class="cl-module">
      <div class="cl-m-body">
        <div>
          <img :src="user.wechat_user.avatar">
        </div>
        <div>
          <p>
            {{user.wechat_user.nickname}}
          </p>
          <p>
            {{user.id}}
          </p>
        </div>
      </div>
      <div class="arrows">
        <span slot="icon" class="iconfont icon-right"></span>
      </div>
    </div>
    <div class="cl-module">
      <!-- <cell title="手机" :value="user.phone" is-link></cell> -->
      <cell title="认证" :value="user.agency.checkTitle" :link="{path:'/agency/check'}" is-link></cell>
    </div>
  </div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  TabbarItem
} from 'vux'
// const version = require('../package.json').version
export default {
  components: {
    Tabbar,
    TabbarItem,
    Cell,
    Group,
    Badge
  },
  data () {
    return {
      user: {
        wechat_user: {},
        agency: {}
      }
    }
  },
  created () {
    this.$user.getCurrentUserInfo().then((userInfo) => {
      console.log(userInfo)
      userInfo.agency.checkTitle = userInfo.agency.checked ? '已认证' : '未认证'
      this.user = userInfo
    })
  }
}
</script>

<style scoped lang="scss">
.cl-m-body{
  padding-top: 5px;
  div{
    float: left;
  }
  div:nth-child(even){
    margin-left: 15px;
    margin-top: 10px;
  }
  img{
    border: 0.5px solid #b4b4b4;
    border-radius: 4.5px;
    width: 64px;
    height: 64px;
  }
  p:nth-child(even){
    color: #9b9b9b;
  }
}
.arrows{
  float: right;
  margin-right: 10px;
  margin-top: 5px;
  opacity: 0.5;
}
.weui_cells::before{
  display: none;
}
</style>
