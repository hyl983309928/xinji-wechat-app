import XDialogComponent from '../components/XDialog'

let $vm

const plugin = {
  install(vue, options = {}) {
    const Dialog = vue.extend(XDialogComponent)

    if (!$vm) {
      $vm = new Dialog({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    // const defaults = {}
    // for (let i in $vm.$options.props) {
    //   if (i !== 'value') {
    //     defaults[i] = $vm.$options.props[i].default
    //   }
    // }

    const xdialog = {
      show() {
        $vm.show = true
      },
      hide() {
        $vm.show = false
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$plugin) {
      vue.$plugin = {
        xdialog
      }
    } else {
      vue.$plugin.xdialog = xdialog
    }

    vue.mixin({
      created: function () {
        this.$plugin = vue.$plugin
      }
    })
  }
}

export default plugin

