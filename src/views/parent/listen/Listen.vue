<template>
<div>
  <div class="listen-page">
    <router-view></router-view>
  </div>
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
    }
  }
}
</script>
<style>
</style>
