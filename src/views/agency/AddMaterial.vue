<template>
<div class="study-page">
  <div class="course">
    <div class="progress">
      <div class="temop">
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-body">
        <div class="outline">
          <div class="cover" @click="uploadImg">
            <img v-if="material.cover" :src="material.cover">
            <span v-else>请上传封面</span>
          </div>
          <div class="title">
            <input placeholder="请输入标题" v-model="material.title" type="text">
            <hr>
          </div>
          <div class="label">
            <div class="object">
              <ul>
                <li>孩子年龄</li>
                <li>课程主题</li>
                <li>参与对象</li>
                <li>场景</li>
              </ul>
            </div>
            <div class="detail">
              <ul>
                <li @click="selectLabel(2)">{{ material.ageLabel ? material.ageLabel : '请选择' }}</li>
                <li @click="selectLabel(1)">{{ material.themeLabel ? material.themeLabel : '请选择' }}</li>
                <li @click="selectLabel(3)">{{ material.targetLabel ? material.targetLabel : '请选择' }}</li>
                <li @click="selectLabel(4)">{{ material.sceneLabel ? material.sceneLabel : '请选择' }}</li>
              </ul>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <button type="button" class="page-submit-btn" @click="submit">下一步</button>
    <actionsheet v-model="showMenu" :menus="menus" @on-click-menu="clickMenu"></actionsheet>
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
  Actionsheet
} from 'vux'
import Tag from '../../components/Tag'

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
    Tag,
    Actionsheet
  },
  data () {
    return {
      labelTree: {},
      material: {
        cover: '',
        title: '',
        ageLabel: '',
        themeLabel: '',
        targetLabel: '',
        sceneLabel: ''
      },
      labelInfo: {},
      menus: {},
      subMenus: {},
      menuId: 0,
      subMenuId: 0,
      showMenu: false,
      showSubMenu: false
    }
  },
  created () {
    this.$label.getLabelList().then((list) => {
      console.log(list)
      this.labelTree = this.$label.getLabelTree(list)
      console.log(this.labelTree)
    })
  },
  methods: {
    submit () {
      var data = {
        material: this.material
      }
      if (this.material.cover === '') {
        this.showError('请上传图片')
        return
      }
      if (this.material.title === '') {
        this.showError('请填写标题')
        return
      }
      this.$api.material.addFromAgency(data).then((material) => {
        this.$router.push('/agency/edit_material/' + material.id)
      }).catch((e) => {
        this.$vux.toast.show({
          text: e.message,
          type: 'warn'
        })
      })
    },
    uploadImg () {
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds

          var localId = localIds[0]
          window.xLog('localId:' + localId)
          this.material.cover = localId
          this.$wechat.uploadImage({
            localId: localId,
            success: (res) => {
              var serverId = res.serverId
              window.xLog('serverId:' + serverId)
              this.$api.photo.downloadMedia(serverId).then((data) => {
                this.material.cover = this.$helper.getImageUrl(data.url)
              })
            }
          })
        }
      })
    },
    selectLabel (labelId) {
      var childs = this.labelTree[labelId - 1].childs
      console.log(labelId)
      this.menuId = labelId
      this.subMenuId = 0
      var menus = {}
      childs.forEach((item) => {
        var id = item.id
        menus[id] = item.title
      })

      this.menus = menus
      this.showMenu = true
    },
    clickMenu (labelId) {
      labelId = parseInt(labelId)
      var label = this.$label.getLabelFromTree(this.labelTree, labelId)
      console.log(label.childs)
      if (label.childs && label.childs.length > 0) {
        var childs = label.childs
        this.subMenuId = labelId
        var menus = {}
        childs.forEach((item) => {
          var id = item.id
          menus[id] = item.title
          // console.log(item.title)
        })
        this.menus = menus
        console.log('menus')
        console.log(menus)
        setTimeout(() => {
          this.showMenu = true
        })
      } else {
        this.labelInfo[this.menuId] = labelId
        this.setLabel(this.menuId, labelId)
        this.showMenu = false
      }
    },
    clickSubMenu (labelId) {
      this.showSubMenu = false
      this.labelInfo[this.subMenuId] = labelId
      this.setLabel(this.subMenuId, labelId)
    },
    setLabel (target, labelId) {
      var labelConfig = this.$config.label
      console.log(labelId)
      var label = this.$label.getLabel(labelId)
      console.log(label)
      switch (target) {
        case labelConfig.AGE_LABEL_ID:
          this.material.age = label.id
          this.material.ageLabel = label.title
          break
        case labelConfig.TARGET_LABEL_ID:
          this.material.targetLabel = label.title
          this.material.target = label.id
          break
        case labelConfig.SCENE_LABEL_ID:
          this.material.sceneLabel = label.title
          this.material.scene = label.id
          break
        default:
          this.material.themeLabel = label.title
          this.material.theme = label.id
          break
      }
    }
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
    width: 100%;
  	height: 120px;
  	background-color: #efeff4;
    font-size: 24px;
    font-weight: 300;
    color:#fff;
    line-height: 120px;
    text-align: center;
    img {
      height: 120px;
    }
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

.detail{
  color:#323b46;
}
</style>
