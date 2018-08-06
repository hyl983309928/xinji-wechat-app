<template>
<div class="add-page">
  <material-item :material="material" :linkDisabel="1">
  </material-item>
  <div class="cl-module">
    <div class="cl-m-header">
      课程目标
    </div>
    <div class="cl-m-body">
      <x-textarea class="xj-textarea" placeholder="课程目标" v-model="material.subject"></x-textarea>
    </div>
  </div>
  <div class="cl-module">
    <div class="cl-m-header">
      课程指引
    </div>
    <div class="cl-m-body">
      <span>
        标题
      </span>
      <x-textarea class="xj-textarea" placeholder="课程指引标题" v-model="material.guide_title"></x-textarea>
      <span>
        内容
      </span>
      <x-textarea class="xj-textarea" placeholder="课程指引内容" v-model="material.guide_content"></x-textarea>
    </div>
  </div>
  <div class="task-list" v-for="(task, tIndex) in material.tasks">
    <div class="cl-module">
      <div class="cl-m-header">
        任务
      </div>
      <div class="cl-m-body">
        <div>
          <span id="title">
            <select class="select" v-model="task.target">
              <option value="0">任务对象</option>
              <option :value="label.id" v-for="label in tagetLabels">{{ label.title }}</option>
            </select>
          </span>
          <span class="title">
            <select class="select" v-model="task.type">
              <option value="0" :selected="!task.type">任务类型</option>
              <option value="1">普通</option>
              <option value="2">用餐</option>
              <option value="3">住宿</option>
            </select>
          </span>
        </div>
        <div class="task-title">
          <span>
            任务名称
          </span>
          <x-textarea class="textarea xj-textarea" placeholder="任务名称" v-model="task.title"></x-textarea>
        </div>
        <div>
          <span>
            任务提示
          </span>
          <x-textarea class="textarea xj-textarea" placeholder="任务提示" v-model="task.content"></x-textarea>
        </div>
        <div>
          <span>
            任务道具
          </span>
          <x-textarea class="textarea xj-textarea" placeholder="任务道具" v-model="task.tool"></x-textarea>
        </div>
        <div>
          <div id="problem" v-for="(ask, aIndex) in task.asks">
            <div>
              <span>
                问题
              </span>
              <span class="delete" @click="deleteAsk(tIndex, aIndex, ask.id)" v-if="task.asks.length !== 1">删除</span>
              <x-textarea class="textarea xj-textarea" placeholder="问题" v-model="ask.ask"></x-textarea>
              <x-textarea class="textarea xj-textarea" placeholder="问题提示" v-model="ask.sug"></x-textarea>
            </div>
          </div>
          <div class="add problem" @click="createAsk(task)">
            <div class="cross">
            </div>
            <div>增加新问题</div>
          </div>
        </div>
        <div id="summary">
          <div v-for="(summary, sIndex) in task.summaries">
            <span>
              小结
            </span>
            <span class="remove" @click="deleteSummary(tIndex, sIndex, summary.id)" v-if="task.summaries.length !== 1">删除</span>
            <x-textarea class="textarea xj-textarea" placeholder="标题" v-model="summary.title"></x-textarea>
            <x-textarea class="textarea xj-textarea" placeholder="正文" v-model="summary.content"></x-textarea>

          </div>
          <div class="add verdict" @click="createSummary(task)">
            <div class="cross">
            </div>
            <div>增加新小结</div>
          </div>
        </div>
        <x-button class="cancel" @click.native="deleteTask(tIndex, task.id)"  v-if="material.tasks.length !== 1">删除任务</x-button>
      </div>
    </div>
  </div>
  <div class="cl-module" @click="createTask">
    <x-button type="primary" class="add_task">
      <div class="pos">
        <div class="crucify">
        </div>
      </div>
      <div id="task">添加新任务</div>
    </x-button>
  </div>
  <div class="cl-module">
    <div class="cl-m-header">
      作业
    </div>
    <div class="cl-m-body">
      <div v-for="(homework, index) in material.homework">
        <span>作业</span>
        <x-textarea class="textarea xj-textarea" placeholder="作业问题" v-model="homework.homework"></x-textarea>
        <x-textarea class="textarea xj-textarea" placeholder="作业提示" v-model="homework.sug"></x-textarea>
        <x-button class="cancel"  @click.native="deleteHomework(index, homework.id)"  v-if="material.homework.length !== 1">删除作业</x-button>
      </div>
      <div class="add work" @click="createHomework">
        <div class="cross">
        </div>
        <div>添加新作业项</div>
      </div>
    </div>
  </div>
  <button type="button" class="page-submit-btn" @click="submit">保存</button>
</div>
</template>

<script>
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XTextarea,
  XButton
} from 'vux'
import MaterialItem from 'components/MaterialItem'

export default {
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XTextarea,
    XButton,
    MaterialItem
  },
  data () {
    return {
      title: '添加课程资料',
      id: 0,
      action: 'add',
      labelList: [],
      labelTree: {},
      labelInfo: {},
      tagetLabels: {},
      material: {
        id: 0,
        name: '',
        description: '',
        display_order: 0,
        labels: [],
        tasks: [],
        homework: []
      },
      modal: {
        visible: false,
        title: '删除确认',
        message: '删除数据后将不能恢复，确定删除吗？'
      },
      removeId: 0,
      removeType: 'task',
      taskIndex: 0,
      askIndex: 0,
      homeworkIndex: 0
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    console.log(id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id

    if (!id) {
      return
    }
    this.title = '编辑课程资料'
    this.action = 'edit'
    console.log(this.action)
    this.$api.material.find(id)
      .then((material) => {
        material = this.$material.formatMaterial(material)
        if (!material.tasks || material.tasks.length === 0) {
          var ask = {id: 0}
          var summary = {id: 0}
          var task = {id: 0, asks: [ask], summaries: [summary], type: 0, target: 0}
          material.tasks = [task]
        }
        if (!material.homework || material.homework.length === 0) {
          var homework = {id: 0}
          material.homework = [homework]
        }
        this.material = material
      })
    this.$label.getLabelList().then((labelList) => {
      this.labelList = labelList
      this.labelTree = this.$label.getLabelTree(labelList)
      this.tagetLabels = this.labelTree[this.$config.label.TARGET_LABEL_ID - 1].childs
    })
  },
  watch: {
  },
  methods: {
    submit () {
      var id = this.material.id

      if (id) {
        var data = {}
        data.material = this.material
        data.labelInfo = this.labelInfo
        this.$api.material.edit(id, data).then((res) => {
          console.log(res)
          this.$router.push('/agency/material')
          this.showSuccess('保存成功')
        })
        .catch((e) => {
          console.log(e)
          this.showError(e.message)
        })
      }
    },
    setLabelInfo () {
      if (this.material.labels.length === 0 || this.labelList.length === 0) {
        return
      }
      var labelInfo = {}
      for (var i = 0; i < this.material.labels.length; i++) {
        var label = this.material.labels[i]
        // console.log(label)
        var parent = this.$label.getParent(label.id)
        // console.log(parent)
        if (parent) {
          labelInfo[parent.id] = label.id
        }
      }
      console.log(labelInfo)
      this.labelInfo = labelInfo
    },
    createTask () {
      var ask = {id: 0}
      var summary = {id: 0}
      var task = {id: 0, asks: [ask], summaries: [summary], type: 0, target: 0}
      this.material.tasks.push(task)
    },
    deleteTask (index, id) {
      this.showConfirm('确认删除吗？')
      this.removeId = id
      this.taskIndex = index
      this.removeType = 'task'
    },
    createAsk (task) {
      var ask = {id: 0}
      task.asks.push(ask)
      // this.material.tasks[tIndex].push(task)
    },
    deleteAsk (tIndex, aIndex, id) {
      this.removeId = id
      this.taskIndex = tIndex
      this.askIndex = aIndex
      this.removeType = 'ask'
      this.showConfirm('确认删除吗？')
    },
    createSummary (task) {
      var summary = {id: 0}
      task.summaries.push(summary)
      // this.material.tasks[tIndex].push(task)
    },
    deleteSummary (tIndex, sIndex, id) {
      this.showConfirm('确认删除吗？')
      this.removeId = id
      this.taskIndex = tIndex
      this.summaryIndex = sIndex
      this.removeType = 'summary'
    },
    createHomework () {
      var homework = {id: 0}
      this.material.homework.push(homework)
      // this.material.tasks[tIndex].push(task)
    },
    deleteHomework (index, id) {
      this.showConfirm('确认删除吗？')
      this.removeId = id
      this.homeworkIndex = index
      this.removeType = 'homework'
    },
    confirm () {
      this.modal.visible = false
      switch (this.removeType) {
        case 'task':
          if (this.removeId === 0) {
            this.material.tasks.splice(this.taskIndex, 1)
          } else {
            this.$api.material.deleteTask(this.removeId).then(() => {
              this.material.tasks.splice(this.taskIndex, 1)
            })
          }
          break
        case 'ask':
          if (this.removeId === 0) {
            this.material.tasks[this.taskIndex].asks.splice(this.askIndex, 1)
          } else {
            this.$api.material.deleteAsk(this.removeId).then(() => {
              this.material.tasks[this.taskIndex].asks.splice(this.askIndex, 1)
            })
          }
          break
        case 'summary':
          if (this.removeId === 0) {
            this.material.tasks[this.taskIndex].summaries.splice(this.summaryIndex, 1)
          } else {
            this.$api.material.deleteSummary(this.removeId).then(() => {
              this.material.tasks[this.taskIndex].summaries.splice(this.summaryIndex, 1)
            })
          }
          break
        case 'homework':
          if (this.removeId === 0) {
            this.material.homework.splice(this.homeworkIndex, 1)
          } else {
            this.$api.material.deleteHomework(this.removeId).then(() => {
              this.material.homework.splice(this.homeworkIndex, 1)
            })
          }
          break
        default:
          break
      }
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
    showConfirm (title) {
      var that = this
      this.$vux.confirm.show({
        // 组件除show外的属性
        title,
        confirmText: '确认',
        cancelText: '取消',
        onCancel () {},
        onConfirm () {
          that.confirm()
        }
      })
    },
    close () {
      this.modal.visible = false
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
    }
  }
}
</script>

<style scoped lang="scss">
img {
    height: auto;
    width: 100%;
}
.add-page{
  margin-bottom: 60px;
}
.cl-module {
    #title,
    .title {
        color: #323b46;
    }
    div {
        span:nth-child(odd) {
            color: #00a6ac;
            margin-left: 30px;
        }
        span:nth-child(even) {
            float: right;
            margin-right: 30px;
        }
    }
}
.task-list select{
  height:24px;
  line-height: 24px;
  color: #323b46;
  font-size: 17px;
	font-weight: 300;
}
.task-title{
  margin-top: 10px;
}
.textarea {
    color: #000000;
    margin: 15px 30px 15px 15px;
}
.add {
    border: solid #efeff4 1px;
    height: 40px;
    line-height: 40px;
    margin: 15px 30px;
    color: #00a6ac;
    div:nth-child(even) {
        position: relative;
        top: -25px;
        left: 50px;
    }
}
.cancel {
    background: #c96060;
    color: #ffffff;
}
.delete,
.remove {
    color: #c96060;
}
.common {
    height: 14px;
    position: relative;
    width: 2px;
    margin-left: 30px;
    margin-top: 12px;
}
.toge {
    content: "";
    height: 1.5px;
    left: -6px;
    top: 6px;
    width: 14px;
    position: absolute;
}
.cross {
    background: #00a6ac;
    @extend .common;
}
.cross:after {
    background: #00a6ac;
    @extend .toge;
}
.crucify {
    background-color: #ffffff;
    @extend .common;
}
.crucify:after {
    background-color: #ffffff;
    @extend .toge;
}
.add_task {
    #task {
        float: left;
        margin-top: -25px;
        margin-left: 50px;
    }
}
</style>
