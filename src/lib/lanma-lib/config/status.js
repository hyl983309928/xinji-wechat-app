const course = [
  '未确认',
  '已确认',
  '无效',
  '删除',
  '',
  '未报名',
  '报名中',
  '报名结束',
  '上课',
  '总结',
  '结束'
]

const order = {
  0: '未确认',
  1: '已确认',
  2: '已取消',
  3: '无效',
  4: '退款',
  5: '已签到'
}

const defaultStatus = {
  0: '未审核',
  1: '已审核',
  2: '无效',
  3: '删除'
}

export default {
  defaultStatus,
  course,
  order
}
