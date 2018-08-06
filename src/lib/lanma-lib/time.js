function editTime (lessonTime, du) {
  try {
    var originTime = lessonTime || '2017-10-10'
    var a = originTime.split(/[^0-9]/)
    var time = new Date(a[0], a[1] - 1, a[2], a[3], a[4])
    var date = originTime.split(' ')[0]
    var timeStart = originTime.split(' ')[1].slice(0, 5)
    var duration = parseInt(du) * 60 * 1000
    var minuteEnd = new Date(Date.parse(time) + duration).getMinutes()
    if (minuteEnd === 0) {
      minuteEnd = '00'
    }
    var hourEnd = new Date(Date.parse(time) + duration).getHours()
    var dayMap = ['（周日）', '（周一）', '（周二）', '（周三）', '（周四）', '（周五）', '（周六）']
    var dayNumber = new Date(time).getDay()
    return date + dayMap[dayNumber] + timeStart + '-' + hourEnd + ':' + minuteEnd
  } catch (error) {
    return ''
  }
}
function editStTime (sTime, eTime) {
  return sTime.substring(0, 16) + ' 至 ' + eTime.substring(0, 16)
}
export default {
  editTime,
  editStTime
}
