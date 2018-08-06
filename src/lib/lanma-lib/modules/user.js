'use strict'

import api from '../common/api'
import _ from 'lodash'

function getCurrentUserInfo () {
  return api.getCurrentUserInfo().then((userInfo) => {
    saveUserInfoToStorage(userInfo)
    return userInfo
  })
}

function dayLoginLog () {
  return api.user.dayLoginLog()
}

function getUserInfoFromStorage () {
  var content = window.sessionStorage.getItem('userInfo')
  console.log('userInfo:' + content)
  if (content) {
    return JSON.parse(content)
  }
  return null
}

function saveUserInfoToStorage (userInfo) {
  if (userInfo) {
    window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
}

function getUserInfo () {
  return new Promise(function (resolve, reject) {
    var userInfo = getUserInfoFromStorage()
    if (userInfo) {
      resolve(userInfo)
    } else {
      getCurrentUserInfo().then((userInfo) => {
        if (userInfo) {
          saveUserInfoToStorage(userInfo)
          resolve(userInfo)
        } else {
          resolve(null)
        }
      })
      .catch((e) => {
        resolve(null)
      })
    }
  })
}

function hasChildren(_this) {
  api.user.hasChildren().then(res => {
    if (res === false) {
      _this.$plugin.xdialog.show()
    }
  })
}

function checkLogin () {
  var token = window.sessionStorage.getItem('token')
  // console.log('checkLogin:' + token)
  return !_.isEmpty(token)
}

function logout () {
  api.setToken('')
  saveUserInfoToStorage('')
}

export default {
  getCurrentUserInfo,
  logout,
  getUserInfo,
  checkLogin,
  getUserInfoFromStorage,
  dayLoginLog,
  hasChildren
}
