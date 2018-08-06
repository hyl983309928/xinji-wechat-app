<template>
  <div class="wrap">
    <img :src="img" alt="" v-for="img in imgList" @click="previewImg(img, imgList)">
  </div>
</template>

<script>
export default {
  props: {
    imgList: ''
  },
  computed: {},
  methods: {
    previewImg(currentUrl, urlList) {
      currentUrl = window.location.origin + window.location.pathname + currentUrl.replace('./', '')
      urlList = urlList.map(item => {
        return window.location.origin + window.location.pathname + item.replace('./', '')
      })
      this.$wechat.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: urlList // 需要预览的图片http链接列表
      })
    }
  }
}
</script>

<style scoped lang="scss">
img{
  width: 30%;
  margin-right: 3%;
}
.wrap{
  margin-right: -3%;
}
</style>
