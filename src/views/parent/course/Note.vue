<template>
    <div v-if="show">
      <template v-for="item in summary">
        <div class="img_box" v-if="item.contentType=='pic'">
          <img :src="item.content" alt="">
        </div>
        <div class="text" v-html="item.content"  v-if="item.contentType=='text'"></div>
      </template>
      <div v-if="summary.length == 0" style="text-align:center;margin-top:80px;color:#7f7f7f;">这堂课没有课堂笔记</div>
    </div>
  </template>
  
  <script>
  export default {
    components: {},
    data () {
      return {
        show: false,
        summary: []
      }
    },
    created () {
      var id = parseInt(this.$route.params.id)
      if (isNaN(id) || id < 0) {
        id = 0
      }
      this.id = id
      this.$api.course.reportClick(id).then((course) => {
        this.summary = course.material.content.filter((item, index) => {
          return item.type === 'summary'
        })
        this.show = true
      })
    },
    methods: {}
  }
  </script>
  
  <style scoped lang="scss">
    .img_box,
    .text{
      border: 1px solid #ccc;
      margin: 15px;
      padding: 15px;
    }
    .img_box img{
      width: 100%;
    }
  </style>
  