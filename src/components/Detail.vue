<template>
  <div>
    <CourseItem :course="course" :linkDisabel="true"></CourseItem>
    <div class="cl-module">
      <div class="cl-m-header">
        课程目标
      </div>
      <div class="cl-m-body">
        {{ material.subject }}
      </div>
    </div>
    <div class="cl-module">
      <div class="cl-m-header">
        费用说明
      </div>
      <div class="cl-m-body">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cousrse: {},
      material: {}
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    this.$api.course.find(id)
        .then((course) => {
          this.course = course
          this.material = course.material
        })
  }
}
</script>

<style scoped lang="scss">

</style>
