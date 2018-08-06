'use strict'

// import api from '../common/api'
// import config from '../config'
import helper from '../helper'
import labelModule from './label'
// import api from '../common/api'
// import _ from 'lodash'

function formatCourse (course) {
  // var material = course.material
  // material.cover = helper.getImageUrl(material.cover)
  course.statusTitle = helper.getCourseStatus(course.status)
  course.lesson_time = course.lesson_time.substr(0, 16).replace('T', ' ')
  // course.sign_up_time = course.sign_up_time.substr(0, 16)
  course.ageLabel = labelModule.getLabel(course.labelAge).title
  course.targetLabel = labelModule.getLabel(course.labelTarget).title
  course.themeLabel = labelModule.getLabel(course.labelTheme).title
  course.sceneLabel = labelModule.getLabel(course.labelScene).title

  return course
}

export default {
  // getCurrentUserInfo,
  formatCourse
}
