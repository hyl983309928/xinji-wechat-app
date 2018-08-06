<template>
  <div>
    <div class="cl-module" v-if="showForm">
      <div class="cl-m-header">
        请填写老师信息进行申请
      </div>
      <div class="cl-m-body">
        <group>
          <x-input title="老师姓名" placeholder="请输入老师名称" v-model="name"></x-input>
          <x-input title="手机号码" placeholder="请输入手机号码" v-model="phone"></x-input>
        </group>
      </div>
    </div>
    <button class="page-submit-btn" v-if="showForm" @click="apply">申请</button>
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
      user_id: 0,
      name: '',
      phone: '',
      showForm: false
    }
  },
  created () {
    var that = this
    this.$api.agency.mine().then((agency) => {
      if (!agency) {
        this.showForm = true
        return
      }
      // var agencyChecked = this.$common.getAgencyChecked()
      var agencyStatus = agency.status
      if (agencyStatus === 1) {
        this.$common.setCookie('agency_id', agency.user_id)
        this.$common.setCookie('agency_status', agency.status)
        this.$common.setCookie('role_id', 3)

        this.$vux.alert.show({
          title: '恭喜',
          content: '你的申请已经通过',
          buttonText: '确定',
          onShow () {
          },
          onHide () {
            that.$router.go(-1)
          }
        })
        return
      } else if (agencyStatus === 2) {
        this.$vux.alert.show({
          title: '你提交申请未通过审批',
          content: '请点击左上角“关闭”按钮！',
          buttonText: '确定',
          onShow () {
          },
          onHide () {
          }
        })
      }
      this.showForm = true
      if (agencyStatus === 0) {
        this.$vux.alert.show({
          title: '你已经提交申请，请等待审批',
          content: '请点击左上角“关闭”按钮！',
          buttonText: '确定',
          onShow () {
          },
          onHide () {
          }
        })
      }

      this.user_id = agency.id
      this.name = agency.name
      this.phone = agency.phone
      console.log('name:' + this.name)
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
    apply () {
      if (this.phone === '') {
        this.showError('请输入联系方式')
        return
      }
      if (this.name === '') {
        this.showError('请输入老师名称')
        return
      }
      // var res = this.phone.match(/1[3578]\d{9}/)
      // console.log(res)
      if (!this.phone.match(/1[3578]\d{9}/)) {
        this.showError('请输入正确的手机号')
        return
      }
      var data = {
        name: this.name,
        phone: this.phone
      }
      this.$api.agency.apply(data)
          .then((res) => {
            // this.showSuccess('提交成功，请等待审批')
            this.$vux.alert.show({
              title: '你已经提交申请，请等待审批',
              content: '请点击左上角“关闭”按钮！',
              buttonText: '确定',
              onShow () {
              },
              onHide () {
              }
            })
          }).catch((error) => {
            if (error.code === 6020) {
              this.showError('请不要重复申请')
            } else {
              this.showError(error.message)
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
</style>
