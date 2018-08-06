<template>
  <div class="progress">
    <div class="bar" :style="{width: progressLength}">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props () {
    return {
      progressLenth: '100%'
    }
  }
}
</script>

<style scoped>
.progress{
  background-color: #ffffff;
  height: 6px;
  margin:15px;
  border-radius: 3px;
}
.bar{
  background: #60c9cf;
  height: 6px;
  border-radius: 3px;
}
</style>
