// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import { sync } from 'vuex-router-sync'
import XMixin from './XMixin'

import 'whatwg-fetch'
// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'

// Raven
//     // .config('https://d70148fa195a4675a15b67d51a2010ea@sentry.io/201957')
//     .config('https://9b124e7702d9458a909ed91cb266ed8f@www.xinjijiaoyu.com/sentry/2')
//     .addPlugin(RavenVue, Vue)
//     .install()

// String.prototype.parseLineChar = function () {
//   return this.replace(/\n/g, "<br />")
// }

Vue.use(VueRouter)

import Vuex from 'vuex'
Vue.use(Vuex)

import routes from './router'
console.log(routes)

const router = new VueRouter({
  routes
})

import helper from 'lanmaLib/helper'
import api from 'lanmaLib/common/api'
import config from 'lanmaLib/config'
import label from 'lanmaLib/modules/label'
import user from 'lanmaLib/modules/user'
import course from 'lanmaLib/modules/course'
import material from 'lanmaLib/modules/material'
import share from 'lanmaLib/modules/share'
import axios from 'axios'
import common from './common'

Vue.prototype.$helper = helper
Vue.prototype.$api = api
Vue.prototype.$config = config
Vue.prototype.$label = label
Vue.prototype.$user = user
Vue.prototype.$course = course
Vue.prototype.$material = material
Vue.prototype.$share = share
Vue.prototype.$common = common
Vue.prototype.$axios = axios
import store from './store'
sync(store, router)

Vue.prototype.$t = function (text) {
  return text
}

import { cookie, DevicePlugin, ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, WechatPlugin, AjaxPlugin, DatetimePlugin } from 'vux'
import XDialog from './plugin/XDialog'

window.authUser = function () {
  var jump = encodeURIComponent(window.location.href)
  // var appId = 'wxfd70a1592861c509' // xinji
  // var appId = 'wx0c4b1c02a850d20b' // test
  http.get('/wxcgi/wx/getJsapiConfigInfo?url=' + encodeURIComponent(window.location.href.split('#')[0])).then(res => {
    var appId = res.appId
    var authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${jump}&response_type=code&scope=snsapi_userinfo&state=detail#wechat_redirect`
    window.location.href = authUrl
  })
}

window.xLog = function (log) {
  var data = { log }
  window.fetch('/api/debug/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

window.onerror = function (e) {
  window.xLog(e)
}

const wx = WechatPlugin.$wechat
const http = AjaxPlugin.$http

var code = common.getParamter('code')
if (code) {
  api.wxlogin(code).then((res) => {
    console.log(res)
    window.location.href = window.location.pathname + window.location.hash
    otherWork()
  })
} else {
  otherWork()
}

function otherWork () {
  // label.getLabelList()
  // loadUserInfo()
  Vue.use(DevicePlugin)
  Vue.use(ToastPlugin)
  Vue.use(AlertPlugin)
  Vue.use(ConfirmPlugin)
  Vue.use(LoadingPlugin)
  Vue.use(WechatPlugin)
  Vue.use(AjaxPlugin)
  Vue.use(DatetimePlugin)
  Vue.use(XDialog)

  wx.ready(() => {
    console.log('wechat ready')
    // var userId = ''
    // user.getUserInfo()
    // .then((userInfo) => {
    //   userId = userInfo.id
    //   var url = window.location.href
    //   if (url.indexOf('?') === -1) {
    //     url += '?'
    //   }
    //   // var uid = common.getUid()
    //   url += 'source=' + userId
    //   if (url.match('/course_tour/course_material')) {
    //     var date = new Date()
    //     url = url.replace('/course_tour/course_material', '/course_tour/course_material_share')
    //     url += '&headimgurl=' + encodeURIComponent(userInfo.headimgurl)
    //     url += '&name=' + encodeURIComponent(userInfo.name)
    //     url += '&time=' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
    //   }
    // wx.onMenuShareAppMessage({
    //   title: '懒妈学院', // 分享标题
    //   desc: '懒妈学院',
    //   link: url,
    //   imgUrl: window.location.origin + '/static/img/logo.png'
    // })
    // wx.onMenuShareTimeline({
    //   title: '懒妈学院', // 分享标题
    //   desc: '懒妈学院',
    //   link: url,
    //   imgUrl: window.location.origin + '/static/img/logo.png'
    // })
    // })
  })

  const permissions = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'uploadImage', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow']
  const url = document.location.href
  http.get('/wxcgi/wx/getJsapiConfigInfo?url=' + encodeURIComponent(url.split('#')[0])).then(res => {
    cookie.set('appId', res.appId)
    res.jsApiList = permissions
    res.nonceStr = res.noncestr
    wx.config(res)
  })

  FastClick.attach(document.body)

  Vue.mixin(XMixin)
  // loadUserInfo()

  /* eslint-disable no-new */
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}
