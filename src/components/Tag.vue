<template>
  <div>
    <div class="detail">
      课程资料{{id}}
    </div>
    <div class="cl-module">
      <div class="bar">
      </div>
      <div class="data_detail">
        <p>
          {{title}}
        </p>
        <ul v-for="obj in objects" class="obj">
          <li>
            {{obj.age}}{{obj.theme}}{{obj.obj}}{{obj.time}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: 'ID',
      title: '标题(渠道)',
      objects: [{
        age: '年龄标签'
      }, {
        theme: '主题标签'
      }, {
        obj: '对象标签'
      }, {
        time: '时长标签'
      }]
    }
  }
}
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    li {
        float: left;
    }
}
.detail {
    margin-top: -50px;
    color: #ffffff;
    margin-left: 15px;
}
.data_detail {
    p {
        margin-top: 10px;
        margin-left: 15px;
        color: #353535;
    }
    ul {
        color: #00a6ac;
        margin-top: 5px;
        margin-left: 15px;
    }
    li {
        margin-right: 15px;
        margin-bottom: 15px;
    }
}
.bar {
    width: 6px;
    background-color: #00a6ac;
    height: 90px;
    float: left;
    margin-top: -10px;
}
</style>
