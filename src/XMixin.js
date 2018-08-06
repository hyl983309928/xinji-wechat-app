export default {
  methods: {
    showSuccess (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'success'
      })
    },
    showErrorMsg (msg) {
      this.$vux.toast.show({
        text: msg,
        type: 'warn'
      })
    },
    showConfirm (title, confirmFun) {
      this.$vux.confirm.show({
        // 组件除show外的属性
        content: title,
        confirmText: '确认',
        cancelText: '取消',
        onCancel () {},
        onConfirm () {
          confirmFun()
        }
      })
    }
  }
}
