import config from './config'

function getImageUrl (url) {
  if (url && url.indexOf('http') === -1) {
    // url = 'http://img.xinjijiaoyu.com' + url
  }
  return url
}
function getCourseStatus (status) {
  return config.status.course[status]
}
export default {
  getImageUrl,
  getCourseStatus
}
