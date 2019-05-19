<template>
  <ul id="ul-Restraint">
    <li
      class="li-Restraint"
      v-for="Restraint in activeRestraints"
      :key="Restraint.id"
    >
      <!-- When stopped -->
      <div class="div-Restraint">
        <img class="img-tier" src="/img/gem_blue.png" />
        <el-tag type="warning" class="tag-tier">{{
          'TIER ' + Restraint.tier
        }}</el-tag>
        <span>{{ Restraint.name }}</span>
        <el-button
          circle
          class="btn-round-Restraint"
          icon="el-icon-check"
          @click="succeedRestraint(Restraint.id)"
        ></el-button>
        <el-button
          circle
          type="danger"
          class="btn-round-Restraint"
          icon="el-icon-remove"
          @click="failRestraint(Restraint.id)"
        ></el-button>
      </div>
      <el-progress
        v-if="!Restraint.isStarted"
        class="progress-Restraint"
        :stroke-width="10"
        :percentage="Math.round((100 * Restraint.exp) / Restraint.maxExp)"
      ></el-progress>
      <el-divider></el-divider>
    </li>
    <!-- Form -->
    <el-button
      id="btn-create-Restraint"
      icon="el-icon-plus"
      circle
      @click="dialogFormVisible = true"
    />
    <el-dialog title="Create Restraint" :visible.sync="dialogFormVisible">
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
            createRestraint(form.name);
          "
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </ul>
</template>
<style scoped>
  #btn-create-Restraint {
    position: absolute;
    bottom: 50px;
    right: 50px;
  }
  #ul-Restraint {
    overflow: auto;
    height: 60vh;
  }
  .li-Restraint {
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
  .progress-Restraint {
    width: 80%;
  }
  .div-Restraint {
  }
  .btn-round-Restraint {
    position: absolute;
    right: 10px;
  }
</style>

<script>
  import { setInterval } from 'timers';
  export default {
    props: {
      activeRestraints: Array
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
      succeedRestraint: function(id) {
        this.$store.dispatch('succeedRestraint', id);
      },
      failRestraint: function(id) {
        this.$store.dispatch('failRestraint', id);
      },
      createRestraint: function(name) {
        this.$store.dispatch('createRestraint', name);
      }
    },
    computed: {}
  };
</script>
