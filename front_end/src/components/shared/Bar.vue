<template>
  <div class="divBar">
    <el-progress
      :percentage="progress"
      :stroke-width="30"
      :text-inside="true"
      :color="color"
    />
    <span class="spanBar">{{ text }}</span>
  </div>
</template>
<style scope>
  .divBar {
    width: 450px;
    position: fixed;
    left: 0;
    top: 0;
  }

  .divBar div div .el-progress-bar__outer {
    border: 7px solid white;
    border-radius: 14px;
    background-color: #fff4f4;
  }
  .divBar div div .el-progress-bar__outer .el-progress-bar__inner {
    border-radius: 10px;
  }
  .divBar div div div div .el-progress-bar__innerText {
    display: none;
  }
</style>

<script>
  export default {
    props: {
      progress: Number,
      text: String,
      color: String
    },
    watch: {
      text(v, old) {}
    },
    mounted() {
      document.querySelector(
        '.divBar div div div div .el-progress-bar__innerText'
      ).innerHTML = this.text;
    }
  };
</script>
