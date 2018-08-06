<template>
  <div class="study-page">
    <div class="cl-module label-match">
      <div class="cl-m-header">
        {{header}}
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
import {
  Tabbar,
  Cell,
  Group,
  Badge,
  XButton
} from 'vux'
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
  created () {
    labelModule.getLabelList().then((list) => {
      console.log(list)
      this.labelList = list
      this.labelTree = labelModule.getLabelTree(list)
      this.getLabelList()

      console.log(this.labelTree)
      this.getAgeRelation()
    })
    this.$api.label.learn_count().then((data) => {
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
      var filterStr = JSON.stringify(this.filter)
      this.$router.push('/parent/course/learn_list/' + filterStr)
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
          break
        case 'scene':
          this.parent_id = this.$config.label.AGE_LABEL_ID
          this.type = 'age'
          this.filter.scene = label.id
          break
        case 'age':
          this.parent_id = label.id
          this.type = 'theme'
          this.filter.age = label.id
          this.currentAgeTree = this.ageTree[label.id]
          break
        case 'parent_theme':
        case 'theme':
          this.parent_id = label.id
          this.filter.theme = label.id
          if (label.childs.length === 0) {
            this.search()
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
.study-page{
  margin-bottom: 60px;
}
</style>
