<template>
<div class="page">
  <div class="userImgList">
    <div class="cl-module">
      <div class="cl-m-header">
        我上传的图片
        <span class="imgNum">
          {{userImgList.length}}张
        </span>
      </div>
      <div class="cl-m-body">
        <div class="imgListBox" v-if="userImgList.length!=0">
          <template v-if="userImgList.length <6">
            <span v-for="item in reverseArray(userImgList)">
              <img :src="countSmallUrl(item, 'x1')" @click="previewImage(item, reverseArray(userImgList))" />
            </span>
          </template>
          <template v-else>
            <span v-for="item,index in 6">
              <img :src="countSmallUrl(reverseArray(userImgList)[index], 'x1')" @click="previewImage(reverseArray(userImgList)[index], getSixPhoto(reverseArray(userImgList)))" />
            </span>
          </template>
        </div>
        <div class="nullText" v-if="userImgList.length==0">你没有上传照片。</div>
        <div class="showAll" v-if="userImgList.length >= 6" @click="goto('/parent/course_tour/all_photo/userImgList/'+id)">
          <span>查看全部 ></span>
        </div>
      </div>
    </div>
  </div>
  <div class="otherUserImgList">
    <div class="cl-module">
      <div class="cl-m-header">
        其他人上传的图片
        <span class="imgNum">
          {{otherUserImgList.length}}张
        </span>
      </div>
      <div class="cl-m-body">
        <div class="imgListBox" v-if="otherUserImgList.length!=0">
          <template v-if="otherUserImgList.length <6">
            <span v-for="item in reverseArray(otherUserImgList)">
              <img :src="countSmallUrl(item, 'x1')" @click="previewImage(item, reverseArray(otherUserImgList))" />
            </span>
          </template>
          <template v-else>
            <span v-for="item,index in 6">
              <img :src="countSmallUrl(reverseArray(otherUserImgList)[index], 'x1')" @click="previewImage(reverseArray(otherUserImgList)[index], getSixPhoto(reverseArray(otherUserImgList)))" />
            </span>
          </template>
        </div>
        <div class="nullText" v-if="otherUserImgList.length==0">其他人没有上传照片。</div>
        <div class="showAll" v-if="otherUserImgList.length >= 6" @click="goto('/parent/course_tour/all_photo/otherUserImgList/'+id)">
          <span>查看全部 ></span>
        </div>
      </div>
    </div>
  </div>
  <div class="teacherImgList">
    <div class="cl-module">
      <div class="cl-m-header">
        老师上传的图片
        <span class="imgNum">
          {{teacherImgList.length}}张
        </span>
      </div>
      <div class="cl-m-body">
        <div class="imgListBox" v-if="teacherImgList.length!=0">
          <template v-if="teacherImgList.length <6">
            <span v-for="item in reverseArray(teacherImgList)">
              <img :src="countSmallUrl(item, 'x1')" @click="previewImage(item, reverseArray(teacherImgList))" />
            </span>
          </template>
          <template v-else>
            <span v-for="item,index in 6">
              <img :src="countSmallUrl(reverseArray(teacherImgList)[index], 'x1')" @click="previewImage(reverseArray(teacherImgList)[index], getSixPhoto(reverseArray(teacherImgList)))" />
            </span>
          </template>
        </div>
        <div class="nullText" v-if="teacherImgList.length==0">老师没有上传照片。</div>
        <div class="showAll" v-if="teacherImgList.length >= 6" @click="goto('/parent/course_tour/all_photo/teacherImgList/'+id)">
          <span>查看全部 ></span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      id: 0,
      userImgList: [],
      otherUserImgList: [],
      teacherImgList: []
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
    this.getCourseImg()
  },
  mounted () {
  },
  methods: {
    getCourseImg () {
      this.$api.courseTour.getCourseImg(this.id)
        .then((data) => {
          this.userImgList = data.userImgList ? data.userImgList : []
          this.otherUserImgList = data.otherUserImgList ? data.otherUserImgList : []
          this.teacherImgList = data.teacherImgList ? data.teacherImgList : []
        })
    },
    countSmallUrl (url, sizeName) {
      return url.replace(/(.jpg|.png|.jpeg|.gif)$/, sizeName + '$&')
    },
    goto (url) {
      this.$router.push(url)
    },
    reverseArray (arr) {
      var temp = arr.concat()
      temp.reverse()
      return temp
    },
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
    getSixPhoto (urlList) {
      return urlList.slice(0, 6)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.page{
  font-size: 16px;
}
.cl-m-body {
  .cl-m-title {
    p {
      margin: (15rem/16) (15rem/16) (-1rem/16) (15rem/16);
      color: #00a6ac;
    }
  }
  .cl-m-text {
    p {
      margin: 0 (15rem/16) (30rem/16) (15rem/16);
      color: #7f7f7f;
    }
  }
}
.imgListBox{
  width:100%;
  margin-bottom: (20rem/16);
  span{
    display: inline-block;
    margin: 0 (10rem/16) (10rem/16) 0;
    width:(90rem/16);
    height:(90rem/16);
    img{
      width:100%;
      height:100%;
    }
  }
}
.showAll{
  text-align: center;
  span{
    color: #00a6ac;
  }
}
.imgNum{
  display: inline-block;
  position: absolute;
  right:10px;
}
.cl-m-header{
  position: relative;
  padding-left: 20px;
  font-size: 17px;
}
.nullText{
  color: #999;
}
</style>