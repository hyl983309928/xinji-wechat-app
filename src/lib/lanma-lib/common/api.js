// import _ from 'lodash'
// import 'whatwg-fetch'
import { AjaxPlugin } from 'vux'

// const USER_AGENT = ''
const http = AjaxPlugin.$http
http.interceptors.response.use(checkStatus)
http.interceptors.response.use(checkCode)

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    if (response.status === 401 && window && window.authUser) {
      window.authUser()
    }
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function checkCode (data) {
  if (data.code === 0) {
    return data.data
  } else if (data.code === 6004) {
    window.authUser()
  } else {
    var error = new Error(data.msg)
    error.code = data.code
    error.msg = data.msg
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

function getUrl (url, param) {
  if (!param) {
    return url
  }
  url += '?'
  var list = []
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      var val = param[key]
      if (typeof val === 'object') {
        val = JSON.stringify(val)
      }
      val = encodeURIComponent(val)
      list.push(key + '=' + val)
    }
  }
  url += list.join('&')
  return url
}

// function apiRequest (path, method = 'GET', data = null, opts = null) {
//   var token = getToken()

//   const options = {
//     headers: {
//       // 'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'User-Agent': USER_AGENT,
//       'Authorization': 'Bearer ' + token
//     },
//     credentials: 'include'
//     // mode: 'no-cors',
//     // strictSSL: false
//   }

//   if (data) {
//     options.body = JSON.stringify(data)
//   }

//   if (opts) {
//     _.merge(options, opts)
//   }

//   const url = '/api' + path

//   options.method = method
//   console.log(opts)

//   return window.fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(checkCode)
// }

function apiRequest (path, method = 'GET', data = null) {
  const url = '/api' + path
  if (method === 'GET') {
    return http.get(url)
  } else {
    return http.post(url, data)
  }
}

// function mockRequest (path, method = 'GET', data = null, opts = null) {
//   var token = getToken()

//   const options = {
//     headers: {
//       // 'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'User-Agent': USER_AGENT,
//       'Authorization': 'Bearer ' + token
//     },
//     credentials: 'include'
//     // mode: 'no-cors',
//     // strictSSL: false
//   }

//   if (data) {
//     options.body = JSON.stringify(data)
//   }

//   if (opts) {
//     _.merge(options, opts)
//   }

//   const url = '/mock' + path

//   options.method = method
//   console.log(opts)

//   return window.fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(checkCode)
// }

function getToken () {
  var token = ''
  if (window.sessionStorage && (token = window.sessionStorage.getItem('token'))) {
    return token
  } else {
    return ''
  }
}

export default {
  setToken: function (token) {
    window.sessionStorage.setItem('token', token)
  },

  getToken,

  login: function (username, password) {
    const data = {
      username,
      password
    }
    var path = `/auth/login`
    var method = 'POST'

    return apiRequest(path, method, data)
  },
  wxlogin: function (authcode) {
    const data = {
      authcode
    }
    var path = `/user/wxLogin`
    var method = 'POST'

    return apiRequest(path, method, data)
    // var url = getUrl('/user/wxLogin', {'authcode': authcode})
    // return apiRequest(url)
  },
  getCurrentUserInfo: function () {
    var path = `/user/getUserInfo`
    return apiRequest(path)
  },
  admin: {
    order: {
      learnOrder: {
        getList (learnId) {
          var param = {learn_id: learnId}
          var url = getUrl('/admin/orders/learn_orders', param)
          return apiRequest(url)
        }
      }
    },
    coupon: {
      add (data) {
        return apiRequest('/admin/coupons', 'post', data)
      },

      edit (id, data) {
        return apiRequest('/admin/coupons/' + id, 'put', data)
      },

      find (id) {
        return apiRequest('/admin/coupons/' + id)
      },

      getList (param = {}) {
        var url = getUrl('/admin/coupons', param)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/coupons/' + id, 'delete')
      }
    },

    monthReport: {
      add (data) {
        return apiRequest('/admin/month_reports', 'post', data)
      },

      edit (id, data) {
        return apiRequest('/admin/month_reports/' + id, 'put', data)
      },

      find (id) {
        return apiRequest('/admin/month_reports/' + id)
      },

      getList (param = {}) {
        var url = getUrl('/admin/month_reports', param)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/month_reports/' + id, 'delete')
      }
    }
  },

  channel: {
    add (channel) {
      return apiRequest('/channels', 'post', channel)
    },

    edit (id, channel) {
      return apiRequest('/channels/' + id, 'put', channel)
    },

    find (id) {
      return apiRequest('/channels/' + id)
    },

    getList (param = {}) {
      var url = getUrl('/channels', param)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/channels/' + id, 'delete')
    }
  },

  label: {
    admin: {
      getRelation (id) {
        return apiRequest('/label/getLabelRelation', 'POST', {labelId: id})
      },
      updateRelation (id, list) {
        var data = {labelId: id, list: list}
        return apiRequest('/label/saveLabelRelation', 'POST', data)
      }
    },
    add (label) {
      return apiRequest('/label/addLabel', 'post', label)
    },

    edit (id, label) {
      return apiRequest('/label/updateLabel', 'post', label)
    },

    find (id) {
      return apiRequest('/label/getLabel', 'post', {labelId: id})
    },

    getList (params) {
      var url = getUrl('/label/getLabelList', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/label/deleteLabel', 'post', {labelId: id})
    },

    play_count () {
      return apiRequest('/label/play_count')
    },

    reader_count () {
      return apiRequest('/reader/getReaderCountInfo')
    },

    learn_count () {
      return apiRequest('/label/learn_count')
    },

    age_relation () {
      return apiRequest('/label/getSubLabelRelation', 'post', {rootId: 2})
    },
    getRootLabel () {
      return apiRequest('/label/getRootLabel')
    }
  },

  agency: {
    add (agency) {
      return apiRequest('/agencies', 'post', agency)
    },

    edit (id, agency) {
      return apiRequest('/agencies/' + id, 'put', agency)
    },

    find (id) {
      return apiRequest('/agencies/' + id)
    },

    getList () {
      return apiRequest('/agencies')
    },

    delete (id) {
      return apiRequest('/agencies/' + id, 'delete')
    },

    apply (data) {
      return apiRequest('/user/applyForClassTeacher', 'post', data)
    },

    check (data) {
      return apiRequest('/agency/check', 'post', data)
    },

    mine () {
      return apiRequest('/user/getUserClassTeacherInfo')
    }
  },

  material: {
    add (material) {
      return apiRequest('/materials', 'post', material)
    },

    edit (id, material) {
      return apiRequest('/materials/' + id, 'put', material)
    },

    find (id) {
      return apiRequest('/materials/' + id)
    },

    getAgencyMaterial (params) {
      var url = getUrl('/materials/agency_materials', params)
      return apiRequest(url)
    },

    addFromAgency (material) {
      return apiRequest('/materials/add_from_agency', 'post', material)
    },

    getList (params) {
      var url = getUrl('/materials', params)
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/materials/' + id, 'delete')
    },

    deleteTask (id) {
      return apiRequest('/tasks/' + id, 'delete')
    },

    deleteAsk (id) {
      return apiRequest('/asks/' + id, 'delete')
    },

    deleteSummary (id) {
      return apiRequest('/summaries/' + id, 'delete')
    },

    deleteHomework (id) {
      return apiRequest('/homework/' + id, 'delete')
    }
  },

  learn: {
    admin: {
      add (learn) {
        return apiRequest('/admin/learns', 'post', learn)
      },

      edit (id, learn) {
        return apiRequest('/admin/learns/' + id, 'put', learn)
      },

      find (id) {
        return apiRequest('/admin/learns/' + id)
      },

      getAgencylearn (params) {
        var url = getUrl('/admin/learns/agency_learns', params)
        return apiRequest(url)
      },

      addFromAgency (learn) {
        return apiRequest('/admin/learns/add_from_agency', 'post', learn)
      },

      getList (params) {
        var url = getUrl('/admin/learns', params)
        return apiRequest(url)
      },

      delete (id) {
        return apiRequest('/admin/learns/' + id, 'delete')
      },

      deleteTask (id) {
        return apiRequest('/admin/learn_tasks/' + id, 'delete')
      },

      deleteAsk (id) {
        return apiRequest('/admin/learn_asks/' + id, 'delete')
      },

      deleteSummary (id) {
        return apiRequest('/admin/learn_summaries/' + id, 'delete')
      },

      deleteHomework (id) {
        return apiRequest('/admin/learn_homework/' + id, 'delete')
      }
    },
    find (id) {
      return apiRequest('/learns/' + id)
    },
    filter (params) {
      var url = getUrl('/learns/filter', params)
      return apiRequest(url)
    },
    addFavorite (id) {
      return apiRequest('/learns/add_favorite/' + id)
    },
    deleteFavorite (id) {
      return apiRequest('/learns/delete_favorite/' + id)
    },
    favoriteList () {
      return apiRequest('/learn/favorite')
    },
    userLearnCourse () {
      return apiRequest('/learn/user_learn_course')
    },
    click (id) {
      return apiRequest('/learns/click/' + id)
    },
    getUserAnswer (id) {
      return apiRequest('/learn/user_answer/' + id)
    },

    getCourseAnswer (id) {
      return apiRequest('/learn/course_answer/' + id)
    },

    saveUserAnswer (answer) {
      return apiRequest('/learn/add_answer', 'post', answer)
    },

    submitAnswer (data) {
      return apiRequest('/learn/submit_answer', 'post', data)
    },

    getUserHomework (id) {
      return apiRequest('/learn/user_homework/' + id)
    },

    saveUserHomework (answer) {
      return apiRequest('/learn/add_homework', 'post', answer)
    },

    submitHomework (data) {
      return apiRequest('/learn/submit_homework', 'post', data)
    }
  },

  course: {
    add (course) {
      return apiRequest('/courses', 'post', course)
    },

    edit (id, course) {
      return apiRequest('/courses/' + id, 'put', course)
    },

    confirm (id) {
      return apiRequest('/courses/confirm/' + id)
    },

    find (id) {
      return apiRequest('/courses/' + id)
    },

    getList (params) {
      return apiRequest('/course/getClassTeacherCourses', 'post', params)
    },

    getSaledCoursesList () {
      var params = {status: 2}
      return apiRequest('/online/getGoodsList', 'post', params)
    },

    getCommodityDetail (goodsId) {
      var params = {
        goodsId
      }
      return apiRequest('/online/getGoods', 'post', params)
    },
    getGoodsBySalesId (goodsId, salesId) {
      var params = {
        goodsId,
        salesId
      }
      return apiRequest('/sales/getGoodsBySalesId', 'post', params)
    },
    getDetail (id) {
      var params = {
        id
      }
      var url = getUrl('/course/getCourseDetail', params)
      return apiRequest(url)
    },

    getGroupCourseDetail (groupId) {
      var params = {
        groupId
      }
      var url = getUrl('/courseGroup/getCourseGroup', params)
      return apiRequest(url)
    },

    getFreeCourse (courseId, couponCode) {
      var params = {
        couponCode: couponCode,
        courseId: courseId
      }
      return apiRequest('/courseCouponCode/recieveCourse', 'post', params)
    },

    getCouponCodeInfo (couponCode) {
      var params = {
        couponCode: couponCode
      }
      return apiRequest('/courseCouponCode/getCouponCodeInfo', 'post', params)
    },

    getCompleteCourseInfo (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/course/getCompleteCourseInfo', params)
      return apiRequest(url)
    },

    getCourseUser (id) {
      var params = {
        course_id: id,
        sign: 0
      }
      var url = getUrl('/course/getCourseUser', params)
      return apiRequest(url)
    },

    pushTask (id, taskIndex) {
      var params = {
        id,
        taskIndex
      }
      var url = getUrl('/course/pushClassTask', params)
      return apiRequest(url)
    },

    pushTaskSummary (courseId, summaryIndex) {
      var params = {
        courseId,
        summaryIndex
      }
      var url = getUrl('/course/pushTaskSummary', params)
      return apiRequest(url)
    },

    getTaskCompleteStatus (courseId, taskIndex) {
      var params = {
        courseId,
        taskIndex
      }
      var url = getUrl('/course/getTaskCompleteStatus', params)
      return apiRequest(url)
    },

    getAllAnswer (courseId, taskIndex, questionIndex) {
      var params = {
        courseId,
        taskIndex,
        questionIndex
      }
      var url = getUrl('/course/getTaskAnswer', params)
      return apiRequest(url)
    },

    classEnd (id) {
      var params = {
        id
      }
      var url = getUrl('/course/classEnd', params)
      return apiRequest(url)
    },

    classBegin (id) {
      var params = {
        id
      }
      var url = getUrl('/course/classBegin', params)
      return apiRequest(url)
    },

    courseCompleted (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/course/courseCompleted', params)
      return apiRequest(url)
    },

    sendHomeworkMessage (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/course/sendHomeworkMessage', params)
      return apiRequest(url)
    },

    getParentCourseSummary (id) {
      var params = {
        id
      }
      var url = getUrl('/course/getParentCourseSummary', params)
      return apiRequest(url)
    },

    setAgencySummary (courseId, reviewAfter, coursePics) {
      var params = {
        courseId,
        reviewAfter,
        coursePics
      }
      var url = getUrl('/course/setClassAfterInfo', params)
      return apiRequest(url)
    },

    setTaskAnswer (courseId, taskIndex, answer) {
      answer = JSON.stringify(answer)
      var params = {
        courseId,
        taskIndex,
        answer
      }
      var url = getUrl('/course/setTaskAnswer', params)
      return apiRequest(url)
    },

    setHomeworkAnswer (courseId, answer) {
      var params = {
        courseId,
        answer
      }
      var url = getUrl('/course/setHomeworkAnswer', params)
      return apiRequest(url)
    },

    filter (params) {
      var url = getUrl('/courses/filter', params)
      return apiRequest(url)
    },

    signInfo (id) {
      return apiRequest('/courses/sign_info/' + id)
    },

    sign (id, phone) {
      var signData = {
        id,
        phone
      }
      return apiRequest('/courses/sign', 'post', signData)
    },

    userCourse (type) {
      var params = {
        courseStatus: type
      }
      var url = getUrl('/course/getParentCourse', params)
      return apiRequest(url)
    },

    courseUserList (id) {
      return apiRequest('/courses/user_list/' + id)
    },

    signUser (id) {
      return apiRequest('/courses/sign_user/' + id)
    },

    signIn (id) {
      var data = {course_id: id}
      return apiRequest('/courses/sign_in', 'post', data)
    },

    orderConfirm (id) {
      return apiRequest('/courses/order_confirm/' + id)
    },

    getQrcode (courseId) {
      var url = '/course/createSignInQRCode?courseId=' + courseId
      return apiRequest(url)
    },

    delete (id) {
      return apiRequest('/courses/' + id, 'delete')
    },

    getUserAnswer (id) {
      return apiRequest('/courses/user_answer/' + id)
    },

    getCourseAnswer (id) {
      return apiRequest('/courses/course_answer/' + id)
    },

    saveUserAnswer (answer) {
      return apiRequest('/courses/add_answer', 'post', answer)
    },

    submitAnswer (data) {
      return apiRequest('/courses/submit_answer', 'post', data)
    },

    getUserHomework (id) {
      return apiRequest('/courses/user_homework/' + id)
    },

    saveUserHomework (answer) {
      return apiRequest('/courses/add_homework', 'post', answer)
    },

    submitHomework (data) {
      return apiRequest('/courses/submit_homework', 'post', data)
    },

    editSummary (id, data) {
      return apiRequest('/courses/edit_summary/' + id, 'post', data)
    },

    deletePhoto (id) {
      return apiRequest('/courses/delete_photo/' + id)
    },

    reportClick (id) {
      return apiRequest('/course/getParentCourseSummary/?courseId=' + id)
    },

    getShareCourseSummary (userId, courseId) {
      var params = {
        userId,
        courseId
      }
      var url = getUrl('/Course/getShareCourseSummary', params)
      return apiRequest(url)
    },

    dismiss (id) {
      return apiRequest('/courses/dismiss/' + id)
    },
    getCourseImg (id) {
      return apiRequest('/course/getCourseImg/', 'post', {'courseId': id})
    },
    thirdPartysignUp (params) {
      return apiRequest('/course/signUp', 'post', params)
    },
    getCourseUserCount (courseId) {
      return apiRequest('/course/getCourseUserCount', 'post', {courseId})
    },
    getAllCourseSite () {
      return apiRequest('/goods/getAllCourseSite')
    },
    getAllCourseTime () {
      return apiRequest('/goods/getAllCourseTime')
    },
    filterGoodsList (params) {
      return apiRequest('/online/filterGoodsList', 'post', params)
    },
    getGoodsCount () {
      var params = {
        targetList: [5, 14, 15]
      }
      return apiRequest('/online/getGoodsCount', 'post', params)
    },
    getGoodsAdList () {
      var params = {
        offset: 0,
        length: 0
      }
      return apiRequest('/online/getGoodsAdList', 'post', params)
    },
    addShowCount (params) {
      return apiRequest('/online/addShowCount', 'post', params)
    }
  },

  courseTour: {
    getDetail (id) {
      var params = {
        id
      }
      var url = getUrl('/stCourse/getCourseDetail', params)
      return apiRequest(url)
    },

    getCompleteCourseInfo (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/stCourse/getCompleteCourseInfo', params)
      return apiRequest(url)
    },

    pushTask (id, taskIndex) {
      var params = {
        id,
        taskIndex
      }
      var url = getUrl('/stCourse/pushClassTask', params)
      return apiRequest(url)
    },
    pushTaskSummary (courseId, summaryIndex) {
      var params = {
        courseId,
        summaryIndex
      }
      var url = getUrl('/stCourse/pushTaskSummary', params)
      return apiRequest(url)
    },
    getAllAnswer (courseId, taskIndex, questionIndex) {
      var params = {
        courseId,
        taskIndex,
        questionIndex
      }
      var url = getUrl('/stCourse/getTaskAnswer', params)
      return apiRequest(url)
    },

    courseCompleted (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/stCourse/courseCompleted', params)
      return apiRequest(url)
    },

    sendHomeworkMessage (courseId) {
      var params = {
        courseId
      }
      var url = getUrl('/stCourse/sendHomeworkMessage', params)
      return apiRequest(url)
    },

    getParentCourseSummary (id) {
      var params = {
        id
      }
      var url = getUrl('/stCourse/getParentCourseSummary', params)
      return apiRequest(url)
    },

    setAgencySummary (courseId, reviewAfter, coursePics) {
      var params = {
        courseId,
        reviewAfter,
        coursePics
      }
      var url = getUrl('/stCourse/setClassAfterInfo', params)
      return apiRequest(url)
    },

    setTaskAnswer (courseId, taskIndex, answer) {
      answer = JSON.stringify(answer)
      var params = {
        courseId,
        taskIndex,
        answer
      }
      var url = getUrl('/stCourse/setTaskAnswer', params)
      return apiRequest(url)
    },

    setHomeworkAnswer (courseId, answer) {
      var params = {
        courseId,
        answer
      }
      var url = getUrl('/stCourse/setHomeworkAnswer', params)
      return apiRequest(url)
    },

    getQrcode (courseId) {
      var url = '/stCourse/createSignInQRCode?courseId=' + courseId
      return apiRequest(url)
    },

    reportClick (id) {
      return apiRequest('/stCourse/getParentCourseSummary/?courseId=' + id)
    },
    getCourseImg (id) {
      return apiRequest('/stCourse/getCourseImg/', 'post', {'courseId': id})
    },
    getShareCourseSummary (userId, courseId) {
      var params = {
        userId,
        courseId
      }
      var url = getUrl('/stCourse/getShareCourseSummary', params)
      return apiRequest(url)
    },
    classBegin (id) {
      var params = {
        id
      }
      var url = getUrl('/stCourse/classBegin', params)
      return apiRequest(url)
    },
    thirdPartysignUp (params) {
      return apiRequest('/stCourse/signUp', 'post', params)
    }
  },
  reader: {
    getDetail (id) {
      return apiRequest('/reader2/getArticle', 'post', {articleId: id})
    },

    getPreviewDetail (id) {
      return apiRequest('/reader2/getPreviewArticle', 'post', {articleId: id})
    },

    getList (params) {
      return apiRequest('/reader2/getArticleList', 'post', params)
    },
    find (id) {
      return apiRequest('/reader/getArticle', 'post', {articleId: id})
    },

    filter (params) {
      return apiRequest('/reader/filterArticle', 'post', params)
    },

    addFavorite (id) {
      return apiRequest('/reader/addFavorite', 'post', {articleId: id})
    },

    deleteFavorite (id) {
      return apiRequest('/reader/deleteFavorite', 'post', {articleId: id})
    },

    favoriteList () {
      return apiRequest('/reader/getFavoriteArticleList')
    },

    click (id) {
      return apiRequest('/reader/clickArticle', 'post', {articleId: id})
    }
  },

  coupon: {
    getList () {
      return apiRequest('/coupons')
    },
    userCoupon () {
      return apiRequest('/coupons/user_coupon')
    },
    convert (id) {
      return apiRequest('/coupons/convert/' + id)
    }
  },

  credit: {
    getList () {
      return apiRequest('/credit/log')
    }
  },

  user: {
    getUserTimeline() {
      return apiRequest('/user/getUserTimeline')
    },
    isSubscribe() {
      return apiRequest('/user/isSubscribe')
    },
    getParentList (params) {
      var url = getUrl('/parents', params)
      return apiRequest(url)
    },
    hasChildren() {
      return apiRequest('/parent/hasChildren')
    },
    getChildrenInfo(userId) {
      if (userId) {
        var params = {
          userId: userId
        }
        return apiRequest('/parent/getChildrenInfo', 'post', params)
      } else {
        return apiRequest('/parent/getChildrenInfo')
      }
    },
    createChildren() {
      return apiRequest('/parent/createChildren')
    },
    bindChildren(studentId, telephone) {
      var params = {
        studentId,
        telephone
      }
      return apiRequest('/parent/bindChildren', 'post', params)
    },
    updateChildrenInfo(childrenInfo) {
      return apiRequest('/parent/updateChildrenInfo', 'post', childrenInfo)
    },
    checkSID(studentId) {
      var params = {
        studentId
      }
      return apiRequest('/parent/getStudentTelephone', 'post', params)
    },
    unbindChildren (studentId) {
      var params = {
        studentId
      }
      return apiRequest('/parent/unbindChildren', 'post', params)
    },
    dayLoginLog () {
      return apiRequest('/user/login')
    },
    getUserLevel(userId) {
      if (userId) {
        var params = {
          userId: userId
        }
        return apiRequest('/user/getUserLevel', 'post', params)
      } else {
        return apiRequest('/user/getUserLevel')
      }
    },
    recharge: {
      getRechargeRecordList(startTime, endTime) {
        var params = {
          startTime,
          endTime,
          offset: '',
          length: ''
        }
        return apiRequest('/parent/getRechargeRecordList', 'post', params)
      },
      getUserPaidOrderList(startTime, endTime) {
        var params = {
          startTime,
          endTime,
          offset: '',
          length: ''
        }
        return apiRequest('/goodsPayment/getUserPaidOrderList', 'post', params)
      },
      getQuotalist(params) {
        return apiRequest('/recharge/getQuotalist')
      },
      createRechargeOrder(params) {
        return apiRequest('/parent/createRechargeOrder', 'post', params)
      },
      getPayConfig (rechargeId) {
        var params = {
          rechargeId
        }
        return apiRequest('/parent/payRechargeOrder', 'post', params)
      },
      refreshOrderStatus (rechargeId) {
        var params = {
          rechargeId
        }
        return apiRequest('/parent/refreshRechargeOrderStatus', 'post', params)
      },
      getRemainder () {
        return apiRequest('/parent/getPurse')
      },
      getQuotalistBySalesId (salesId) {
        var params = {
          salesId
        }
        return apiRequest('/recharge/getQuotalistBySalesId', 'post', params)
      }
    }
  },

  photo: {
    upload (data) {
      return window.fetch('/api/photo/upload', {
        method: 'POST',
        body: data
      }).then(checkStatus)
      .then(parseJSON)
      .then(checkCode)
    },
    downloadMedia (mediaId) {
      return apiRequest('/photo/download_media?media_id=' + mediaId)
    },
    uploadImg (mediaId) {
      return apiRequest('/user/uploadWXRes?mediaId=' + mediaId)
    }
  },

  voice: {
    uploadVoice (mediaId) {
      return apiRequest('/user/uploadWXJSSDKRes?mediaId=' + mediaId)
    }
  },

  order: {
    hasPurseCourse (courseIds) {
      var params = {
        'goodsIds': JSON.stringify(courseIds)
      }
      return apiRequest('/goodsPayment/hasPurseCourse/', 'post', params)
    },
    createCourseOrder (goodsId, name, phone, salesId) {
      var params = {
        goodsId,
        name,
        phone
      }
      if (!(isNaN(salesId) || salesId <= 0)) {
        params.salesId = salesId
      }
      return apiRequest('/goodsPayment/createOrder/', 'post', params)
    },
    getUserUnpaymentOrderList () {
      return apiRequest('/goodsPayment/getUserUnpaymentOrderList/')
    },
    getOrderDetail (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/goodsPayment/getOrder', 'post', params)
    },
    getPayConfig (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/goodsPayment/payment', 'post', params)
    },
    balancePayment (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/goodsPayment/balancePayment', 'post', params)
    },
    refreshOrderStatus (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/goodsPayment/refreshOrderStatus', 'post', params)
    }
  },

  seller: {
    getCommodityList (params) {
      return apiRequest('/sales/getGoodsList', 'post', params)
    },
    getRecordList (params) {
      return apiRequest('/sales/getOrderList', 'post', params)
    },
    getRechargeRecordList() {
      var params = {
        startTime: '',
        endTime: '',
        offset: '',
        length: ''
      }
      return apiRequest('/sales/getRechargeRecordList', 'post', params)
    },
    getCommodity (goodsId) {
      var params = {
        goodsId
      }
      return apiRequest('/sales/getGoods', 'post', params)
    },
    getTotalRecord (params) {
      return apiRequest('/sales/getAllGoodsOrderList', 'post', params)
    },
    createOrder (goodsId, parentName, parentTelephone) {
      var params = {
        goodsId,
        parentName,
        parentTelephone
      }
      return apiRequest('/sales/createOrder/', 'post', params)
    },
    cancelOrder (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/sales/cancelOrder', 'post', params)
    },
    getOrderInfo (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/sales/getOrder/', 'post', params)
    },
    getSignInCode (orderId) {
      var params = {
        orderId
      }
      return apiRequest('/sales/createSignQRCode/', 'post', params)
    },
    checkSignInScan (qrcodeId) {
      var params = {
        qrcodeId
      }
      return apiRequest('/sales/isSignQRCodeScaned', 'post', params)
    }
  },
  capsule: {
    filterCapsuleList (data) {
      return apiRequest('/capsule/filterCapsuleList', 'post', data)
    },
    getCapsule (id) {
      var params = {
        id
      }
      return apiRequest('/capsule/getCapsule', 'post', params)
    },
    getCertificaList (data) {
      return apiRequest('/capsule/getCertificaList', 'post', data)
    },
    addActivityStat (data) {
      return apiRequest('/activity_1111/addStat', 'post', data)
    },
    addAction (data) {
      return apiRequest('/capsule/addAction', 'post', data)
    },
    getAction (data) {
      return apiRequest('/capsule/getAction', 'post', data)
    },
    delAction (data) {
      return apiRequest('/capsule/delAction', 'post', data)
    },
    getCapsuleListByAction (data) {
      return apiRequest('/capsule/getCapsuleListByAction', 'post', data)
    },
    getCapsuleUsedCount (capsuleId) {
      var params = {
        capsuleId
      }
      return apiRequest('/capsule/getCapsuleUsedCount', 'post', params)
    },
    getExerciseCount (userId) {
      var params = {
        userId
      }
      return apiRequest('/capsule/getExerciseCount', 'post', params)
    },
    getPraiseCount (capsuleId) {
      var params = {
        capsuleId
      }
      return apiRequest('/capsule/getPraiseCount', 'post', params)
    },
    addClickCount (capsuleId, type) {
      var params = {
        capsuleId,
        type
      }
      return apiRequest('/capsule/clickCount', 'post', params)
    },
    getCapsuleExerciseAnsList (capsuleId) {
      var params = {
        capsuleId
      }
      return apiRequest('/capsule/getCapsuleExerciseAnsList', 'post', params)
    }
  },
  newCapsule: {
    filterNewCapsuleList () {
      return apiRequest('/capsule/filterNewCapsuleList')
    },
    getRecentUser (capsuleId) {
      return apiRequest('/capsule/getRecentUser', 'post', {capsuleId})
    },
    getCapsuleExerciseAnsList (params) {
      return apiRequest('/capsule/getCapsuleExerciseAnsList', 'post', params)
    },
    addAnsAction (params) {
      return apiRequest('/capsule/addAnsAction', 'post', params)
    },
    delAnsAction (params) {
      return apiRequest('/capsule/delAnsAction', 'post', params)
    },
    getActiveRate (userId) {
      var params = {}
      if (userId) {
        params.userId = userId
      }
      return apiRequest('/capsule/getActiveRate', 'post', params)
    }
  },
  thirdParty: {
    getThirdPartyList (params) {
      return apiRequest('/thirdParty/getThirdPartyList', 'post', params)
    }
  },
  wechat: {
    getPayConfig (id) {
      return apiRequest('/wechat/pay_config/' + id)
    }
  },

  post: function (command, data) {
    return apiRequest(command, data, 'post')
  },

  get: function (command, data, cb) {
    return apiRequest(command, data, 'get')
  }
}
