<template>
  <ul id="ul-Perseverance">
    <li
      class="li-Perseverance"
      v-for="Perseverance in activePerseverance"
      :key="Perseverance.id"
    >
      <!-- When stopped -->
      <div class="div-Perseverance">
        <img class="img-tier" src="/img/gem_blue.png" />
        <el-tag type="warning" class="tag-tier">{{
          'TIER ' + Perseverance.tier
        }}</el-tag>
        <span>{{ Perseverance.name }}</span>
        <el-button
          circle
          type="success"
          class="btn-round-Perseverance"
          icon="el-icon-check"
          @click="succeedPerseverance(Perseverance.id)"
        ></el-button>
        <el-button
          circle
          type="danger"
          class="btn-round-Perseverance-second"
          icon="el-icon-remove"
          @click="failPerseverance(Perseverance.id)"
        ></el-button>
      </div>
      <el-progress
        v-if="!Perseverance.isStarted"
        class="progress-Perseverance"
        :stroke-width="10"
        :percentage="Math.round((100 * Perseverance.exp) / Perseverance.maxExp)"
      ></el-progress>
      <el-divider></el-divider>
    </li>
    <!-- Form -->
    <el-button
      id="btn-create-Perseverance"
      icon="el-icon-plus"
      circle
      @click="dialogFormVisible = true"
    />
    <el-dialog title="Create Perseverance" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Name" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="
            dialogFormVisible = false;
            createPerseverance(form.name);
          "
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </ul>
</template>
<style scoped>
  #btn-create-Perseverance {
    position: absolute;
    bottom: 50px;
    right: 50px;
  }
  #ul-Perseverance {
    overflow: auto;
    height: 60vh;
  }
  .li-Perseverance {
    list-style-type: none;
    text-align: left;
  }
  .img-tier {
    image-rendering: pixelated;
    display: inline;
  }
  .tag-tier {
    font-size: 0.5em;
    padding: 1px;
    height: auto;
    line-height: normal;
    margin: 10px 10px 10px 0px;
  }
  .progress-Perseverance {
    width: 80%;
  }
  .div-Perseverance {
  }
  .btn-round-Perseverance {
    position: absolute;
    right: 80px;
  }
  .btn-round-Perseverance-second {
    position: absolute;
    right: 30px;
  }
</style>

<script>
  import { setInterval } from 'timers';
  export default {
    props: {
      activePerseverance: Array
    },
    data() {
      return {
        currentDate: new Date(),
        startDate: undefined,
        dialogFormVisible: false,
        form: {
          name: ''
        }
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
      startPerseverance: function(id) {
        this.startDate = this.currentDate;
        this.$store.dispatch('startPerseverance', id);
      },
      succeedPerseverance: function(id) {
        this.$store.dispatch('succeedPerseverance', id);
      },
      failPerseverance: function(id) {
        this.$store.dispatch('failPerseverance', id);
      },
      createPerseverance: function(name) {
        this.$store.dispatch('createPerseverance', name);
      }
    },
    computed: {}
  };
</script>
