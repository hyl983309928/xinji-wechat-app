<template>
  <div>
    <div class="topTitle" v-if="imgList_all">{{type=='userImgList'?`我上传的照片${imgList_all.length}张`:type=='otherUserImgList'?`其他家庭上传的图片${imgList_all.length}张`:`老师上传的图片${imgList_all.length}张`}}</div>
    <div class="imgListBox">
      <span v-for="item in imgList_show">
        <img :src="countSmallUrl(item, 'x1')" @click="previewImage(item, imgList_show)" />
      </span>
    </div>
    <div class="foot">
      <p @click="more" v-if="!endFlag">查看更多</p>
      <p v-else>已到底部</p>
    </div>
  </div>
</template>

<script>
import ImgModel from 'lanmaLib/imgSize'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      type: '',
      id: 0,
      imgList_all: [],
      imgList_show: [],
      showLength: 15,
      page: 1,
      endFlag: false
    }
  },
  computed: {
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.type = this.$route.params.type
    this.getCourseImg()
    console.log(this.countSmallUrl('./uploads/2017/04/27/6a6453ae69f7e6419e1623.jpg', 'x1'))
  },
  mounted () {
  },
  methods: {
    getCourseImg () {
      this.$api.course.getCourseImg(this.id)
        .then((data) => {
          this.imgList_all = this.reverseArray(data[this.type])
          this.showList()
        })
    },
    showList () {
      var offset = (this.page - 1) * this.showLength
      var tempList
      if (!this.imgList_all) {
        this.imgList_all = []
      }
      tempList = this.imgList_all.slice(offset, offset + this.showLength)
      this.imgList_show = this.imgList_show.concat(tempList)
      console.log(this.imgList_show)
      if ((offset + this.showLength) >= this.imgList_all.length) {
        this.endFlag = true
      }
    },
    more () {
      this.page += 1
      this.showList()
    },
    countSmallUrl: ImgModel.countSmallUrl,
    previewImage (url, urlList) {
      url = window.location.origin + window.location.pathname + url.replace('./', '')
      urlList = urlList.map(item => {
        return window.location.origin + window.location.pathname + item.replace('./', '')
      })
      this.$wechat.previewImage({
        current: url,
        urls: urlList
      })
    },
    reverseArray (arr) {
      var temp = arr.concat()
      temp.reverse()
      return temp
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.imgListBox{
  box-sizing: border-box;
  width:100%;
  display: flex;
  display: -webkit-flex;
  flex-wrap:warp;
  -webkit-flex-wrap: wrap;
  align-content:flex-start;
  -webkit-align-content:flex-start;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  margin-bottom: (5rem/16);
  span{
    flex-grow: 0;
    display: inline-block;
    width:33%;
    text-align: center;
    height:(105rem/16);
    margin-bottom:(10rem/16);
    img{
      width:90%;
      height:100%;
    }
  }
}
.topTitle{
  color: #4c4c4c;
  padding: (10rem/16);
}
.imgListBox{
  padding: (10rem/16);
  background: #fff;
}
.foot{
  text-align: center;
  padding: 10px;
}
</style>