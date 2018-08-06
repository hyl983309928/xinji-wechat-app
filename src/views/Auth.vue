<template>
</template>

<script>

export default {
  created () {
    var isLogin = this.$user.checkLogin()
    window.xLog(api.getToken())
    if (!isLogin) {
      var token = cookie.get('token')
      window.xLog(token)
      console.log(token)
      if (token) {
        api.setToken(token)
        loadUserInfo()
      } else {
        window.authUser()
      }
    } else {
      loadUserInfo()
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
