<template>
  <div class="study-page">
    <!--<div class="cl-module">-->
      <div class="cl-m-body">
        <div class="public">
          <div class="img-wrap"><img src="/static/img/smile.png" alt=""></div>
          <p>作业已提交，本次课程结束。</p>
          <p>感谢您和宝贝的参与。希望通过这次课程，能让您对孩子的成长有新的认识和理解！</p>
          <p>期待与你们的下次再见！</p>
          <x-button class="button-close" type="primary" @click.native="closeWindow">关闭</x-button>
        </div>
      </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'
  // import ImgPreview from 'components/ImgPreview'
  // import common from 'src/common'
  // import { Swipe, SwipeItem } from 'vue-swipe'
  // import _ from 'lodash'
  // import FormData from 'form-data'

  export default {
    components: { XButton },
    data() {
      return {}
    },
    created() {},
    mounted() {
    },
    methods: {
      closeWindow() {
        this.$wechat.closeWindow()
      }
    }
  }

</script>

<style scoped lang="scss">

  .cl-m-body {
    .cl-m-title {
      p {
        margin: 15px;
        color: #60c9cf;
        font-size: 17px;
      }
    }
    .cl-m-text {
      p {
        margin: 0 15px 30px 15px;
        font-size: 13px;
      }
    }
  }
  .img-wrap{
    text-align: center;
    margin: 20px 0 40px 0;
    img{
      width: 60%;
    }
  }
  span {
    color: #60c9cf;
    margin-top: 5px;
    margin-left: 15px;
  }

  .button-close{
    margin-top: 40px;
  }

  .public {
    margin: 5px 15px;
    color: #323b46;
    font-size: 13px;
    p{
      margin: 20px 0;
    }
  }

  .hide {
    visibility: hidden;
  }
</style>