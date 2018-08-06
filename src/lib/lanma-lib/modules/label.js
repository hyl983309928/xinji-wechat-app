'use strict'

import api from '../common/api'
// import _ from 'lodash'

const PARENT_THEME_KEY = 'parent_theme'

var labelList = null
var labelHashTable = {}
var rootLabelTree = []

function getLabelTree (labelList) {
  var result = []
  var hashTable = {}
  for (var i = 0; i < labelList.length; i++) {
    var label = labelList[i]
    var id = label.id
    var parentId = label.parent_id
    parentId = parseInt(parentId)

    hashTable[id] = label
    label.childs = []

    if (parentId === 0) {
      result.push(label)
    } else {
      var parent = hashTable[parentId]
      parent.childs.push(label)
    }
  }

  return result
}

function getLabelFromTree (list, id) {
  if (!list || list.length === 0) {
    return null
  }
  var label = null
  console.log('getLabelFromTree')
  console.log(list)
  list.forEach(function (item) {
    if (item.id === id) {
      label = item
    }
    if (!label) {
      console.log('label')
      console.log(item)
      var res = getLabelFromTree(item.childs, id)
      if (res) {
        label = res
      }
    }
  })
  return label
}

/**
 * 获取所有的父标签
 */

function getParentIdList (id) {
  var result = []
  var parent = getParent(id)
  if (!parent) {
    return result
  }
  result.push(parent.id)

  var _res = getParentIdList(parent.id)
  result = _res.concat(result)
  return result
}

function getThemeLabel (id) {
  var themeLabelList = []
  var parentTheme = getParentTheme()

  getParentIdList(id).forEach(function (item) {
    if (item > 4 && item !== parentTheme.id) {
      // console.log(getLabel(item))
      themeLabelList.push(getLabel(item).title)
    }
  })
  themeLabelList.push(getLabel(id).title)

  return themeLabelList.join(' / ')
}

/**
 * 在单页面的进程中，如果已经取过标签列表labelList，则直接返回labelList
 * 可以设置参数reload为true，强制刷新
 */
function getLabelList (reload = false) {
  if (labelList && !reload) {
    return new Promise(function (resolve, reject) {
      resolve(labelList)
    })
  } else {
    return api.label.getList().then((data) => {
      labelList = data.list
      labelHashTable = getHashTable(labelList)
      rootLabelTree = getLabelTree(labelList)
      return labelList
    })
  }
}

function getRootLabelTree () {
  return rootLabelTree
}

function getHashTable (list) {
  var hashTable = {}
  list.forEach(function (item) {
    hashTable[item.id] = item
  })
  return hashTable
}

function getParent (id) {
  var label = labelHashTable[id]
  var parent = null
  if (label) {
    parent = labelHashTable[label.parent_id]
  }
  return parent
}

function getParentTitle (id) {
  var parent = getParent(id)
  if (parent) {
    return parent.title
  } else {
    return ''
  }
}

function getLabel (id) {
  if (labelHashTable[id]) {
    return labelHashTable[id]
  } else {
    return {}
  }
}

function getLabelTitle (id) {
  var label = getLabel(id)
  return label.title ? label.title : ''
}

/**
 * 获取父母主题标签
 */
function getParentTheme () {
  var parentTheme = {}

  try {
    labelList.forEach(function (label) {
      if (label.code === PARENT_THEME_KEY) {
        parentTheme = label
      }
    })
    return parentTheme
  } catch (error) {
    console.log(error)
  }
}

/**
 * 获取 学习目标 的标签树
 */
function getTargetTreee () {
  var retArr = labelList.filter(item => {
    return item.parent_id === 1 && item.title.match('学会')
  })
  return retArr
}

/**
 * 获取 年龄 的标签数组
 */
function getAgeLabel () {
  var retArr = labelList.filter(item => {
    return item.parent_id === 2 && item.title.match('岁')
  })
  return retArr
}

/**
 * 共读 有多个标签 按照 最末级/次级/ 依次排列
 */
function getReaderThemeLabel (list) {
  var box = []
  var labelString = ''
  list.map((item, itemIndex) => {
    item.map((it, itIndex) => {
      try {
        box[itIndex].push(getLabel(it).title)
      } catch (error) {
        box[itIndex] = []
        box[itIndex].push(getLabel(it).title)
      }
    })
  })
  box.reverse()
  box.map(item => {
    item = Array.from(new Set(item))
    labelString += item.join('·')
    labelString += '·'
  })
  return labelString
}

export default {
  // getCurrentUserInfo,
  getLabelTree,
  getLabelList,
  getParent,
  getParentTitle,
  getLabel,
  getRootLabelTree,
  getParentTheme,
  getLabelFromTree,
  getParentIdList,
  getThemeLabel,
  getLabelTitle,
  getTargetTreee,
  getAgeLabel,
  getReaderThemeLabel,
  getHashTable
}
