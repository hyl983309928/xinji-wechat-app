import {cookie} from 'vux'

function getIntFromCookie (key) {
  var num = cookie.get(key)
  if (!num) {
    return 0
  }
  num = parseInt(num)
  if (isNaN(num)) {
    num = 0
  }

  return num
}

function getUid () {
  return getIntFromCookie('uid')
}

function getRoleId () {
  return getIntFromCookie('role_id')
}

function getAgencyId () {
  return getIntFromCookie('agency_id')
}

function getAgencyChecked () {
  return getIntFromCookie('agency_checked')
}

function getAgencyStatus () {
  return getIntFromCookie('agency_status')
}

function setCookie (key, val) {
  cookie.set(key, val, {
    domain: 'xinjijiaoyu.com',
    path: '/',
    expires: 0
  })
}

function getParamter (key) {
  var arr = window.location.href.split('?')
  var param = arr.length > 1 ? arr[1] : ''
  var regExp = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var match = param.match(regExp)
  return match ? unescape(match[2]) : ''
}

function getShareParamter (key) {
  var arr = window.location.href.split('?')
  var param = ''
  if (arr.length > 2) {
    param = arr[2]
  } else if (arr.length > 1) {
    param = arr[1]
  }
  var regExp = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var match = param.match(regExp)
  return match ? decodeURIComponent(match[2]) : ''
}

export default {
  getUid,
  getRoleId,
  getAgencyId,
  getAgencyChecked,
  getAgencyStatus,
  setCookie,
  getParamter,
  getShareParamter
}
