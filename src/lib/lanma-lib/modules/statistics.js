import api from '../common/api'

function activityAddStat(statId, capsuleId, shareUserId) {
  var params = {}
  params.capsuleId = capsuleId || ''
  params.statId = statId || ''
  params.shareUserId = shareUserId || ''
  return api.capsule.addActivityStat(params)
    .then((data) => {
    })
}
export default {
  activityAddStat
}
