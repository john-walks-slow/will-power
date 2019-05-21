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
  .iconTimerButton {
    display: block !important;
    position: relative;
    bottom: 10px;
    font-size: 30px;
  }
  .spanTimerName {
    font-size: 0.9rem;
    position: relative;
    display: block;
  }
  .spanTime {
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
      timerName: String,
      progress: Number,
      target: Number,
      startTime: Number,
      size: Number
    },
    data() {
      return {
        currentTime: new Date().getTime()
      };
    },
    computed: {
      inner() {
        let currentTimePatched = this.currentTime;
        if (this.currentTime < this.startTime) {
          currentTimePatched = this.startTime;
        }
        if (this.startTime) {
          return `<i class="el-icon-check iconTimerButton"></i><span class="spanTimerName">${
            this.timerName
          }</span><span class="spanTime">${Math.floor(
            (currentTimePatched - this.startTime) / 1000 / 60
          )} m ${Math.floor((currentTimePatched - this.startTime) / 1000) %
            60} s</span>`;
        } else {
          return `<i class="el-icon-caret-right iconTimerButton"></i><span class="spanTimerName">${
            this.timerName
          }</span><span class="spanTime">${this.progress} / ${
            this.target
          }</span>`;
        }
      }
    },
    mounted() {
      setInterval(() => {
        this.currentTime = new Date().getTime();
      }, 1000);
    }
  };
</script>
