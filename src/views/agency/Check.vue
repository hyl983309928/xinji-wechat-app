<template>
  <div>
    <div class="cl-module" v-if="showForm">
      <div class="cl-m-header">
        身份认证资料
      </div>
      <div class="cl-m-body">
        <group>
          <x-input title="真实姓名" placeholder="请输入真实姓名" v-model="idcard_name"></x-input>
          <x-input title="身份证号码" placeholder="请输入身份证号码" v-model="idcard_num"></x-input>
          <x-input title="微信号" placeholder="请输入微信号" v-model="wechat_username"></x-input>
        </group>
      </div>
      <div class="idcard_photo">
        <div class="cover" @click="uploadImg(1)">
          <img v-if="idcard_img_1" :src="idcard_img_1">
          <span v-else>手持身份证正面</span>
        </div>
        <div class="cover" @click="uploadImg(1)">
          <img v-if="idcard_img_2" :src="idcard_img_2">
          <span v-else>手持身份证反面</span>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <button class="page-submit-btn" v-if="showForm" @click="check">身份认证</button>
  </div>
</template>

<script>
import { XInput, Group } from 'vux'

export default {
  components: {
    XInput,
    Group
  },
  data () {
    return {
      id: 0,
      idcard_name: '',
      idcard_num: '',
      wechat_username: '',
      idcard_img_1: '',
      idcard_img_2: '',
      showForm: false
    }
  },
  created () {
    var that = this
    var agencyId = this.$common.getAgencyId()
    var agencyChecked = this.$common.getAgencyChecked()
    // var agencyStatus = this.$common.getAgencyStatus()
    if (agencyId && agencyChecked) {
      this.$vux.alert.show({
        title: '恭喜',
        content: '你的身份认证已经通过',
        buttonText: '确定',
        onShow () {
        },
        onHide () {
          that.$router.go(-1)
        }
      })
      return
    }
    this.showForm = true
    this.$api.agency.mine().then((agency) => {
      if (agency) {
        this.id = agency.id
        this.idcard_name = agency.idcard_name
        this.idcard_num = agency.idcard_num
        this.wechat_username = agency.wechat_username
        this.idcard_img_1 = agency.idcard_img_1
        this.idcard_img_2 = agency.idcard_img_2
      }
    })
  },
  methods: {
    showApplyResult (msg) {
      this.$vux.alter.show({
        title: msg,
        type: 'success'
      })
    },
    showSuccess (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'success'
      })
    },
    showError (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'warn'
      })
    },
    check () {
      // if (this.phone === '') {
      //   this.showError('请输入联系方式')
      //   return
      // }
      // if (this.name === '') {
      //   this.showError('请输入机构名称')
      //   return
      // }
      // var res = this.phone.match(/1[3578]\d{9}/)
      // console.log(res)
      var data = {
        idcard_name: this.idcard_name,
        idcard_num: this.idcard_num,
        idcard_img_1: this.idcard_img_1,
        idcard_img_2: this.idcard_img_2,
        wechat_username: this.wechat_username,
        phone: this.phone
      }
      this.$api.agency.check(data)
          .then((res) => {
            this.showSuccess('提交成功，请等待审批')
          }).catch((error) => {
            this.showError(error.message)
          })
    },
    uploadImg (num) {
      var varName = 'idcard_img_' + num
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds

          var localId = localIds[0]
          window.xLog('localId:' + localId)
          this[varName] = localId
          this.$wechat.uploadImage({
            localId: localId,
            success: (res) => {
              var serverId = res.serverId
              window.xLog('serverId:' + serverId)
              this.$api.photo.downloadMedia(serverId).then((data) => {
                this[varName] = this.$helper.getImageUrl(data.url)
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.study-page{
  margin-bottom: 60px;
}
.explain{
  color:#323b46;
}
.textarea{
  height: auto;
}
.sign{
  margin-left: 60%;
}
.apply{
  height: 50px;
  line-height: 50px;
}
.weui_icon.weui_icon_warn::before{
  display: none;
}
.cover {
  width: 40%;
  margin: 5%;
  float:left;
  background-color: #efeff4;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  color:#fff;
  line-height: 120px;
}
.cover img {
  width:100%;
}
</style>
