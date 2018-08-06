<template>
  <div class="study-page">
    <div class="cl-module label-match">
      <div class="cl-m-header">
        <template v-if="type=='age'">
          <span>为了为您匹配有针对意义的文章，我们会根据您孩子的年龄和您关注的重点，来为您进行推荐。</span><br><br>
        </template>
        <span class="header">{{header}}</span>
      </div>
      <div class="cl-m-body">
        <div class="label-list">
          <div v-for="label in list" @click="select(label)"
           :class="(type !== 'theme' && labelNotEmpty.indexOf(label.id) === -1) ? 'label-item disabled' : 'label-item'"
           v-if="">
            <h3>{{label.title}}</h3>
            <p>{{label.description}}</p>
          </div>

          <!--div class="label-item active">
            <h3>父母</h3>
            <p>单独针对父母提供体系化的共玩课程，对父母个人成长进行提升</p>
          </div>

          <div class="label-item disabled">
            <h3>父母</h3>
            <p>单独针对父母提供体系化的共玩课程，对父母个人成长进行提升</p>
          </div-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tabbar, Cell, Group, Badge, XButton } from 'vux'
import labelModule from 'lanmaLib/modules/label'
import _ from 'lodash'
// import api from 'lanmaLib/common/api'
// import config from 'lanmaLib/config'
export default {
  name: 'filter',
  components: {
    Tabbar,
    Cell,
    Group,
    Badge,
    XButton
  },
  data () {
    return {
      labelID: {},
      labelList: [],
      labelTree: [],
      filter: {
      },
      parent_id: 2,
      type: 'age',
      parentLabel: {},
      list: {},
      ageTree: [],
      currentAgeTree: [],
      labelNotEmpty: []
    }
  },
  watch: {
    // 用户信息页面 和 个人信息页面 复用同一组件，而原来的组件实例会被复用，所以生命周期钩子不会再被调用
    // 因此需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.init()
    }
  },
  created () {
    // console.log('filter = ' + this.$route.params.filter)
    var filterStr = JSON.parse(this.$route.params.filter)
    // console.log('filterStr = ' + filterStr)
    if ('parent_id' in filterStr) {
      this.parent_id = filterStr.parent_id
    }
    if ('parent_id' in filterStr) {
      this.type = filterStr.type
    }
    if ('currentAgeTree' in filterStr) {
      this.currentAgeTree = filterStr.currentAgeTree
    }
    this.filter = filterStr

    labelModule.getLabelList().then((list) => {
      // console.log(list)
      this.labelList = list
      this.labelTree = labelModule.getLabelTree(list)
      this.getLabelList()

      // console.log(this.labelTree)
      this.getAgeRelation()
    })
    this.$api.label.reader_count().then((data) => {
      var countData = data.list
      var list = []
      for (var type in countData) {
        if (countData.hasOwnProperty(type)) {
          countData[type].forEach((item) => {
            var labelId = item[type]
            list.push(labelId)
            var _arr = labelModule.getParentIdList(labelId)
            list = list.concat(_arr)
          })
        }
      }
      list = _.uniq(list)
      this.labelNotEmpty = list
    })
  },
  computed: {
    header () {
      var header = this.$config.label.labelSelectHeader[this.type]
      console.log(this.$config.label.labelSelectHeader)
      if (!header) {
        header = ''
      }
      return header
    }
  },
  methods: {
    init () {
      var filterStr = JSON.parse(this.$route.params.filter)
      if (_.isEmpty(filterStr)) {
        this.parent_id = 2
        this.type = 'age'
        this.currentAgeTree = []
      }
      if ('parent_id' in filterStr) {
        this.parent_id = filterStr.parent_id
      }
      if ('parent_id' in filterStr) {
        this.type = filterStr.type
      }
      if ('currentAgeTree' in filterStr) {
        this.currentAgeTree = filterStr.currentAgeTree
      }
      this.filter = filterStr

      labelModule.getLabelList().then((list) => {
        console.log(list)
        this.labelList = list
        this.labelTree = labelModule.getLabelTree(list)
        this.getLabelList()

        console.log(this.labelTree)
        this.getAgeRelation()
      })
      this.$api.label.reader_count().then((data) => {
        var countData = data.list
        var list = []
        for (var type in countData) {
          if (countData.hasOwnProperty(type)) {
            countData[type].forEach((item) => {
              var labelId = item[type]
              list.push(labelId)
              var _arr = labelModule.getParentIdList(labelId)
              list = list.concat(_arr)
            })
          }
        }
        list = _.uniq(list)
        this.labelNotEmpty = list
      })
    },
    getAgeRelation () {
      this.$api.label.age_relation().then((data) => {
        var list = {}
        for (var id in data) {
          if (data.hasOwnProperty(id)) {
            var arr = this.labelTree[0].childs.slice(0)
            list[id] = this.getAgeLabel(arr, data[id])
          }
        }
        this.ageTree = list
      })
    },
    getAgeLabel (labelTree, idList) {
      var list = []
      console.log(idList)
      // console.log(JSON.stringify(labelTree))
      labelTree.forEach((item) => {
        console.log('item.id:' + item.id)
        if (this.labelSelected(item, idList)) {
          console.log('push.id:' + item.id)
          var obj = _.clone(item)
          obj.childs = this.getAgeLabel(item.childs, idList)
          list.push(obj)
        }
      })
      return list
    },
    labelSelected (label, idList) {
      var childSelected = false
      var labelChecked = idList.indexOf(label.id) !== -1
      label.childs.forEach((item) => {
        if (this.labelSelected(item, idList)) {
          childSelected = true
        }
      })
      if (label.childs.length > 0) {
        labelChecked = false
      }
      return childSelected || labelChecked
    },
    getLabelList () {
      var labelTree = this.type === 'theme' ? this.currentAgeTree : this.labelTree
      // console.log(JSON.stringify(labelTree))
      // console.log(this.parent_id)

      this.parentLabel = this.$label.getLabelFromTree(labelTree, this.parent_id)
      this.list = this.parentLabel ? this.parentLabel.childs : labelTree

      // console.log(this.list)
    },
    search () {
      this.filter.currentAgeTree = []
      var filterStr = JSON.stringify(this.filter)
      this.$router.push('/parent/course/reader_list/' + filterStr)
    },
    selectAnother () {
      var filterStr = JSON.stringify(this.filter)
      this.$router.push('/parent/course/reader_filter/' + filterStr)
    },
    select (label) {
      if (this.type !== 'theme' && this.labelNotEmpty.indexOf(label.id) === -1) {
        return
      }
      switch (this.type) {
        case 'target':
          if (label.code === 'parent') {
            var parentTheme = this.$label.getParentTheme()

            this.parent_id = parentTheme.id
            this.type = 'parent_theme'
          } else {
            this.parent_id = this.$config.label.SCENE_LABEL_ID
            this.type = 'scene'
          }
          this.filter.target = label.id

          this.filter.parent_id = this.parent_id
          this.filter.type = this.type
          this.selectAnother()
          break
        case 'scene':
          this.parent_id = this.$config.label.AGE_LABEL_ID
          this.type = 'age'
          this.filter.scene = label.id

          this.filter.parent_id = this.parent_id
          this.filter.type = this.type
          this.selectAnother()
          break
        case 'age':
          this.parent_id = label.id
          this.type = 'theme'
          this.filter.age = label.id
          this.currentAgeTree = this.ageTree[label.id]

          this.filter.currentAgeTree = this.currentAgeTree
          this.filter.parent_id = this.parent_id
          this.filter.type = this.type
          this.selectAnother()
          break
        case 'parent_theme':
        case 'theme':
          this.parent_id = label.id
          this.filter.theme = label.id
          this.filter.parent_id = this.parent_id
          if (label.childs.length === 0) {
            this.filter.parent_id = this.parent_id
            this.search()
          } else {
            this.filter.parent_id = this.parent_id
            this.selectAnother()
          }
          break
        default:
          break
      }

      this.getLabelList()
    }
  }
}
</script>

<style scoped>
.cl-m-header {
  padding: 10px 30px;
  background-color: #60c9cf;
  font-size: 18px;
  color: #ffffff;
  height: inherit;
  line-height: inherit;
  text-align: left;
}
.study-page{
  margin-bottom: 60px;
}
.header{
  font-weight: bold;
}
</style>
