<template>
  <CircleProgress
    class="cProgress"
    :progress="progress"
    :total="target"
    :inner="inner"
    :size="size || 150"
  />
</template>
<style>
  .iconCounterButton {
    display: block !important;
    position: relative;
    bottom: 10px;
    font-size: 30px;
  }
  .spanCounterName {
    font-size: 0.9rem;
    position: relative;
    display: block;
  }
  .spanCount {
    font-size: 0.9rem;
    position: relative;
    display: block;
    top: 10px;
  }
</style>

<style scoped>
  .cProgress {
    /* pointer-events: all; */
    cursor: pointer;
    display: inline-block;
  }
  .cProgress:hover {
    transform: scale(1.1);
    transition: all 400ms;
  }
  .cProgress:active {
    transform: scale(0.7);
    transition: all 200ms;
  }
</style>

<script>
  import CircleProgress from 'components/shared/CircleProgress.vue';
  export default {
    components: {
      CircleProgress
    },
    props: {
      counterName: String,
      progress: Number,
      target: Number,
      size: Number
    },
    data() {
      return {
        currentTime: new Date().getTime()
      };
    },
    computed: {
      inner() {
        return `<i class="el-icon-plus iconCounterButton"></i><span class="spanCounterName">${
          this.counterName
        }</span><span class="spanCount">${this.progress} / ${this.target}</span>`;
      }
    },
    mounted() {
      setInterval(() => {
        this.currentTime = new Date().getTime();
      }, 1000);
    }
  };
</script>
