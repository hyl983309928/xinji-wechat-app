'use strict'

// import api from '../common/api'
// import config from '../config'
// import helper from '../helper'
// import _ from 'lodash'
import labelModule from './label'

function formatMaterial(material) {
  // material.cover = helper.getImageUrl(material.cover)
  material.ageLabel = labelModule.getLabel(material.age).title
  material.targetLabel = labelModule.getLabel(material.target).title
  material.themeLabel = labelModule.getLabel(material.theme).title
  material.sceneLabel = labelModule.getLabel(material.scene).title
  material.taskList = material.content.filter(item => {
    if (item.type === 'task') {
      item.showNotes = false
      for (var i of item.questions) {
        i.showPrompt = false
      }
    }
    return item.type === 'task'
  })
  material.actionList = material.content.filter(item => {
    return item.type === 'action'
  })
  if ('question' in material.homework) {
    for (var work of material.homework.question) {
      work.showPrompt = false
    }
  }
  console.log(material)
  return material
}

function formatTaskAnswer(material, answerList, dataList) {
  var taskIndex = 0
  for (var j = 0; j < material.content.length; j++) {
    if (material.content[j].type === 'task') {
      try {
        if (dataList[taskIndex]) {
          answerList.splice(taskIndex, 1, JSON.parse(dataList[taskIndex]))
        } else {
          throw new Error()
        }
      } catch (error) {
        answerList.splice(taskIndex, 1, [])
        for (var l = 0; l < material.content[j].questions.length; l++) {
          if (material.content[j].questions[l].type === 'sound') {
            answerList[taskIndex].push([{ 'status': 'init', 'url': '', 'totalTime': '' }])
          } else {
            answerList[taskIndex].push([])
          }
        }
      }
      taskIndex++
    }
  }
  console.log(answerList)
  return answerList
}

function formatHomeworkAnswer(material, answerList, dataList) {
  for (var j = 0; j < material.homework.question.length; j++) {
    try {
      if (dataList[j]) {
        answerList.splice(j, 1, dataList[j])
      } else {
        throw new Error()
      }
    } catch (error) {
      if (material.homework.question[j].type === 'sound') {
        answerList.splice(j, 1, [{ 'status': 'init', 'url': '', 'totalTime': '' }])
      } else {
        answerList.splice(j, 1, [])
      }
    }
  }
  console.log(answerList)
}

export default {
  // getCurrentUserInfo,
  formatMaterial,
  formatTaskAnswer,
  formatHomeworkAnswer
}
