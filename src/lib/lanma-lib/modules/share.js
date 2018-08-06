'use strict'

// import api from '../common/api'
// import config from '../config'
// import helper from '../helper'
// import _ from 'lodash'
import user from 'lanmaLib/modules/user'
import { WechatPlugin } from 'vux'

function setShareInfo(title, desc, imgUrl) {
  var userId = ''
  user.getUserInfo()
  .then((userInfo) => {
    userId = userInfo.id
    var url = window.location.href
    if (url.match('statId=')) {
      url += '&source=' + userId
    } else {
      url += '?source=' + userId
    }
    if (url.match(/\/course_material || \/homework || \/exerciseEnd || \/guideShare/)) {
      var date = new Date()
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      url = url.replace('/course_tour/course_material', '/course_tour/course_material_share')
      url = url.replace('/course/course_material', '/course/course_material_share')
      url = url.replace('/course/homework', '/course/homework_share')
      url = url.replace('/course_tour/homework', '/course_tour/homework_share')
      url = url.replace('/course/report/homework', '/course/homework_share')
      url = url.replace('/capsule/exerciseEnd', '/capsule/exerciseBack')
      url = url.replace('/newCapsule/guideShare', '/newCapsule/guideShare_share')
      url += '&headimgurl=' + encodeURIComponent(userInfo.headimgurl)
      url += '&name=' + encodeURIComponent(userInfo.name)
      url += '&time=' + encodeURIComponent(time)
    }
    var shareInterval = setInterval(function() {
      WechatPlugin.$wechat.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function (res) {
          WechatPlugin.$wechat.closeWindow()
        }
      })
      WechatPlugin.$wechat.onMenuShareTimeline({
        title: title, // 分享标题
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function (res) {
          WechatPlugin.$wechat.closeWindow()
        }
      })
    }, 1000)
    setTimeout(function() {
      clearInterval(shareInterval)
    }, 5000)
  })
}

export default {
  setShareInfo
}
