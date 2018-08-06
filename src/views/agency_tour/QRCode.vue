<template>
<div class="qrcode">
  <div class="cl-module">
    <div class="cl-m-header">
      签到二维码
    </div>
    <div class="cl-m-body">
      <div class="outline">
        <!--<img v-if="qrcode !== ''" :src="'data:image/png;base64, ' + qrcode">-->
            <img v-show="loadingComplete && qrcode !== ''" :src="qrcode" @load="loadingComplete = true"><br>
            <span v-show="loadingComplete" class="promt">请老师将此二维码出示给上课的家长完成签到</span>
            <div class="wrap">
              <img src="/static/img/loading.gif" alt="" v-if="!loadingComplete" id="loading-img">
              <span v-if="!loadingComplete" class="loading-text">正在加载中</span>
            </div>
            
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton,
  XInput,
  Selector,
  XTextarea,
  Flexbox,
  FlexboxItem
} from 'vux'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton,
    XInput,
    Selector,
    XTextarea,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      qrcode: '',
      id: 0,
      loadingComplete: false
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    // var url = 'http://wx.xinjijiaoyu.com/#/parent/course/sign/' + id
    this.$api.courseTour.getQrcode(id)
        .then((qrcode) => {
          this.qrcode = qrcode
        })
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.progress {
  height: 6px;
  margin: 15px;
}
.temop {
  background-color: #60c9cf;
  height: 6px;
  border-radius: 3px;
}
.course {
  .temop {
    width: 50%;
  }
  hr {
    margin-bottom: 50px;
  }
  ul {
    list-style: none;
  }
  .cover {
    width: 225px;
  	height: 120px;
  	background-color: #efeff4;
    font-size: 24px;
    font-weight: 300;
    color:#fff;
    line-height: 120px;
  }
  .label {
    margin-bottom: 30px;
    font-size: 17px;
    li{
    line-height: 34px;
    }
  }
  .object {
    float: left;
    color: #00a6ac;
  }
  img {
    height: 120px;
    width: 225px;
  }
  .cl-module {
    padding-bottom: 30px;
    .cl-m-body {
      margin: 50px;
      .outline {
        text-align: center;
        input {
          text-align: center;
          border: none;
          height: 30px;
          width: 100%;
          margin-top: 10px;
          font-size:18px;
          margin-bottom: 15px;
        }
      }
    }
  }
}

.outline {
  height: 302px;
  text-align: center;
  img {
    width: 270px;
  }
}

.detail{
  color:#323b46;
}

#loading-img {
  width: 24px;
}

.loading-text {
  vertical-align: top;
}

.wrap {
  position: relative;
  top: 35%;
}

.promt {
  font-size: 13px;
}
</style>
