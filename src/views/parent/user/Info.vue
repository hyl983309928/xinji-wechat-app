<template>
  <div class="sid-page" v-if="show">

    <div class="title"></div>
    <group label-margin-right="2em" label-align="left">
      <vue-core-image-upload
        crop-ratio="1:1"
        class="btn btn-primary"
        crop="local"
        extensions="png,jpeg,jpg"
        :url="uploadUrl"
        text=""
        compress="50"
        @imageuploaded="editSuccess">
        <cell title="头像" :is-link="true">
          <div>
            <img :src="headimgurl" alt="" class="headimg">
          </div>
        </cell>
      </vue-core-image-upload>
      <cell title="宝贝名字" :is-link="true" link="/parent/user/info_edit/babyname">
        {{ name }}
      </cell>
      <cell title="心迹学号">
        {{ sid }}
      </cell>
      <datetime title="宝贝生日" @on-change="save" placeholder="请选择" v-model="info.childrenList[0].birthday" format="YYYY-MM-DD" year-row="{value}年" month-row="{value}月" day-row="{value}日" default-selected-value="2013-6-15" confirm-text="完成" cancel-text="取消"></datetime>
      <popup-radio title="宝贝性别" placeholder="请选择" v-model="info.childrenList[0].sex" :options="sexList" @on-hide="save"></popup-radio>
    </group>

    <group label-margin-right="2em" label-align="left">
      <cell title="您的昵称" :is-link="true" link="/parent/user/info_edit/name">
        {{ info.name }}
      </cell>
      <cell title="手机" :is-link="true" link="/parent/user/info_edit/phone">
        {{ info.telephone }}
      </cell>
      <popup-radio title="与孩子的关系" placeholder="请选择" v-model="info.identity" :options="identityList" @on-hide="save"></popup-radio>
    </group>

    <div class="error">
      {{ errorTextMap[errorStatus] }}
    </div>

    <div class="tips">
      <p>
        <x-icon type="ios-locked-outline" class="icon"></x-icon> 温馨提示：
      </p>
      <ul class="tip-info">
        <li>为确保系统能正确记录、推荐适合您和孩子的课程、资料，请确认您输入的内容真实无误。</li>
        <li>您输入的信息，将只用于帐号识别和身份/课程匹配，不会用于其他用途，请放心输入。</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'
import VueCoreImageUpload from 'vue-core-image-upload'

export default {
  components: { PopupRadio, XButton, GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch, VueCoreImageUpload },
  data () {
    return {
      show: false,
      info: {},
      user: {},
      cropSrc: '',
      cropArgs: {
        toCropImgH: '?',
        toCropImgW: '?',
        toCropImgX: '?',
        toCropImgY: '?'
      },
      sexList: [{key: 0, value: '男孩'}, {key: 1, value: '女孩'}],
      identityList: ['妈妈', '爸爸', '外婆', '外公', '奶奶', '爷爷'],
      errorStatus: 0,
      errorTextMap: ['', '请输入宝宝的名字', '请选择宝宝的生日', '请选择宝宝的性别', '请输入手机号码', '请输入正确的手机号码']
    }
  },
  watch: {
    // 需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  computed: {
    name() {
      try {
        return this.info.childrenList[0].name
      } catch (error) {
        return '宝宝名字'
      }
    },
    headimgurl() {
      try {
        if (this.info.childrenList[0].headimgUrl) {
          return this.info.childrenList[0].headimgUrl
        }
        if (this.info.childrenList[0].sex === null) {
          return '/static/img/boy.png'
        } else {
          return this.info.childrenList[0].sex ? '/static/img/girl.png' : '/static/img/boy.png'
        }
      } catch (error) {
        return '/static/img/boy.png'
      }
    },
    sid() {
      try {
        return String(this.info.childrenList[0].studentId).replace(/\d{10}/, '$&-').replace(/\d{6}/, '$&-')
      } catch (error) {
        return ''
      }
    },
    uploadUrl() {
      return window.location.protocol + '//' + window.location.hostname + '/api/user/upload'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.isCreate = this.$route.params.action === 'create'
      if (!this.isCreate) {
        this.$user.hasChildren(this)
      }
      this.getChildrenInfo()
    },
    getChildrenInfo() {
      this.$api.user.getChildrenInfo().then(data => {
        this.show = true
        this.info = data
      })
    },
    save() {
      this.$api.user.updateChildrenInfo(this.info).then(res => {})
    },
    // unbind() {
    //   this.$api.user.unbindChildren(this.info.childrenList[0].studentId).then(res => {
    //     console.log(res)
    //   })
    // },
    // uploadImg() {
    //   this.$wechat.chooseImage({
    //     count: 1, // 默认9
    //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //     success: (res) => {
    //       var localIds = res.localIds
    //       var localId = localIds[0]
    //       this.$wechat.uploadImage({
    //         localId: localId,
    //         success: (res) => {
    //           var serverId = res.serverId
    //           this.$api.photo.uploadImg(serverId).then((data) => {
    //             this.info.childrenList[0].headimgUrl = data.url
    //             this.save()
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    editSuccess(res) {
      var temp = 'http://wxtest2.xinjijiaoyu.com'
      if (window.location.host === 'wx.xinjijiaoyu.com') {
        temp = 'https://wx.xinjijiaoyu.com'
      }
      this.info.childrenList[0].headimgUrl = temp + res.data.url.substring(1)
      this.save()
    }
  }
}
</script>

<style scoped lang="scss">
  .title{
    text-align: center;
    margin-top: 5px;
    margin-bottom: -15px;
    font-size: 12px;
  }
  .headimg{
    width: 70px;
    height: 70px;
  }
  .error{
    margin-top: 15px;
    margin-bottom: -10px;
    height: 25px;
    text-align: center;
    color: #f00;
  }
  .button{
    margin: 0 auto;
    border-radius: 20px;
    width: 200px;
    margin-top: 30px;
    background: #4bd3e7;
  }
  .tips{
    padding: 40px 20px;
    font-size: 14px;
    color: #a5a5a5;
    p{
      display: flex;
      justify-content: flex-start;
      .icon{
        margin-right: 5px;
      }
    }
    .tip-info{
      padding: 0 20px;
      li{
        list-style-type: circle;
      }
    }
  }
</style>
