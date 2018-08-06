
// x1:120 ,x2: 300 ,x3: 650
function countSmallUrl (url, sizeName) {
  return url.replace(/(.jpg|.png|.jpeg|.gif)$/, sizeName + '$&')
}
export default {
  countSmallUrl
}
