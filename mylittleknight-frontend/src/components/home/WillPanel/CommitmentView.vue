<template>
  <div id="divCommitment">
    <div
      class="divCommitmentItem"
      v-for="commitment in commitments"
      :key="commitment.id"
    >
      <span>{{ commitment.name }}</span>
      <CircleProgress
        class="cProgress"
        :progress="5"
        total="10"
        text="1 / 60mins"
        :size="50"
      />
      <CircleProgress
        class="cProgress"
        :progress="5"
        total="10"
        text="1 / 60mins"
        :size="50"
      />
      <!-- <span v-if="commitment.isStarted" class="timerCommitment"
          >-
          {{
            Math.round((currentDate.getTime() - startDate.getTime()) / 1000)
          }}s</span
        >
        <span v-else class="spanTimeSpent">Time spent today: 10s</span>
        <el-button
          v-if="!commitment.isStarted"
          class="btnStart"
          icon="el-icon-caret-right"
          circle
          @click="startCommitment(commitment.id)"
        ></el-button>
        <el-button
          v-if="commitment.isStarted"
          class="btnFail"
          type="danger"
          icon="el-icon-close"
          circle
          @click="failCommitment(commitment.id)"
        ></el-button>
        <el-button
          v-if="commitment.isStarted"
          class="btnComplete"
          type="success"
          icon="el-icon-check"
          circle
          @click="succeedCommitment(commitment.id)"
        ></el-button> -->
      <el-divider />
    </div>
  </div>
</template>
<style scoped>
  .cProgress {
    /* width: 30px;
                              height: 30px; */
  }
  .timerCommitment {
    margin-left: 15px;
  }
  .spanTimeSpent {
    font-size: 0.7em;
    font-style: italic;
    margin-left: 20px;
  }
  #btn-create-commitment {
    position: absolute;
    bottom: 50px;
    right: 50px;
  }
  #divCommitment {
    overflow: auto;
    height: 60vh;
  }
  .divCommitmentItem {
    list-style-type: none;
    text-align: left;
    margin: 15px;
  }

  .progressCommitment {
    width: 80%;
  }
  .divCommitment {
  }
  .btnStart {
    position: absolute;
    right: 50px;
  }
  .btnComplete {
    position: absolute;
    right: 100px;
  }
  .btnFail {
    position: absolute;
    right: 50px;
  }
  .dividerCommitment {
    background-color: yellow !important;
  }
</style>

<script>
  import CircleProgress from 'components/shared/CircleProgress.vue';
  export default {
    components: {
      CircleProgress
    },
    props: {
      commitments: Array
    },
    data() {
      return {
        currentDate: new Date(),
        startDate: undefined
      };
    },
    computed: {
      timeElapsed: v => {
        return v.startDate ? v.currentDate.getTime() - v.startDate.getTime() : 0;
      }
    },
    created() {
      setInterval(() => {
        this.currentDate = new Date();
      }, 1000);
    },

    methods: {
      startCommitment: function(id) {
        this.startDate = this.currentDate;
        this.$store.dispatch('startCommitment', id);
      },
      succeedCommitment: function(id) {
        this.$store.dispatch('succeedCommitment', id);
      },
      failCommitment: function(id) {
        this.$store.dispatch('failCommitment', id);
      },
      createCommitment: function(name) {
        this.$store.dispatch('createCommitment', name);
      }
    }
  };
</script>
