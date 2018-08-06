<template>
  <div class="cl-module">
    <div class="cl-m-header">
      任务目标&解读
    </div>
    <div class="cl-m-body">
      <div class="cl-m-title">
        <p>任务目标：</p>
      </div>
      <div class="cl-m-text">
        <p>{{labelTarget_title}}</p>
      </div>
      <div class="cl-m-title">
        <p>目标解读：</p>
      </div>
      <div class="cl-m-text">
        <p v-html="">{{labelTarget_description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import labelModule from 'lanmaLib/modules/label'
export default{
  components: {
  },
  directives: {
  },
  data () {
    return {
      labelTarget_title: '',
      labelTarget_description: ''
    }
  },
  props: {
    targetId: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      labelModule.getLabelList()
        .then((labelList) => {
          var id = parseInt(this.targetId)
          if (isNaN(id)) {
            id = 0
          }
          this.labelTarget_title = labelModule.getThemeLabel(id).replace(/ \/ /g, '|')
          this.labelTarget_description = labelModule.getLabel(id).description
        })
    }
  },
  watch: {
    targetId () {
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.cl-m-body {
    .cl-m-title {
      p {
        margin: 15px 15px -1px 15px;
        color: #00a6ac;
        font-size: 15px;
      }
    }
    .cl-m-text {
      p {
        margin: 0 15px 15px 15px;
        font-size: 15px;
        color: #7f7f7f;
      }
    }
  }
</style>