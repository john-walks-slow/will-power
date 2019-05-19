<template>
  <transition name="zoom">
    <Panel
      title="WILLS"
      :imgSrc="ICON_WILL"
      v-if="open"
      color="#62e9e2"
      :closePanel="closePanel"
    >
      <div class="divContent" slot="content">
        <!-- <span v-if="empty">You don't have any active will. </span> -->
        <div
          class="willItem"
          v-for="commitment in activeCommitments"
          :key="commitment.id"
        >
          <TimerButton
            :timerName="commitment.name"
            :progress="commitment.progress"
            :target="commitment.target"
            :size="140"
          />
          <i class="el-icon-edit" @click="editWill(commitment)"></i>
        </div>
        <div
          class="willItem"
          v-for="perseverance in activePerseverances"
          :key="perseverance.id"
        >
          <CounterButton
            :counterName="perseverance.name"
            :progress="perseverance.progress"
            :target="perseverance.target"
            :size="140"
          />
          <i class="el-icon-edit" @click="editWill(perseverance)"></i>
        </div>
        <div
          class="willItem"
          v-for="restraint in activeRestraints"
          :key="restraint.id"
        >
          <MinusButton
            :minusName="restraint.name"
            :progress="restraint.progress"
            :target="restraint.target"
            :size="140"
          />
          <i class="el-icon-edit" @click="editWill(restraint)"></i>
        </div>
        <el-button
          class="btnCreateCommitment"
          icon="el-icon-plus"
          circle
          @click="dialogFormVisible = true"
        >
          <br />
          <span class="spanBtnCreate">Create New</span>
        </el-button>

        <el-dialog :visible.sync="dialogFormVisible" title="Create a will">
          <el-form :model="form">
            <el-form-item label="I am willing to" label-width="100px">
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="What are you willing to accomplish?"
              >
                <el-select
                  slot="prepend"
                  class="selectType"
                  v-model="form.type"
                  placeholder="Select"
                >
                  <el-option label="Spend time" value="commitment" key="1">
                    <span style="float: left">Spend time</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Learn to play guitar
                    </span></el-option
                  >
                  <el-option label="Insist on" value="perseverance" key="2">
                    <span style="float: left">Insist on</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Keep a diary
                    </span></el-option
                  >
                  <el-option label="Resist" value="restraint" key="3">
                    <span style="float: left">Resist</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Smoking
                    </span></el-option
                  >
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item
              label="At Least"
              label-width="100px"
              v-if="form.type === 'commitment'"
            >
              <el-input-number
                v-model="form.target"
                class="inputFrequency"
                placeholder="0"
                :min="0"
              ></el-input-number>
              <span>Minutes </span>
              <el-select v-model="form.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="At Least"
              label-width="100px"
              v-if="form.type === 'perseverance'"
            >
              <el-input-number
                v-model="form.target"
                class="inputFrequency"
                placeholder="1"
                :min="1"
                :max="99"
              ></el-input-number>
              <span>Time(s) </span>
              <el-select v-model="form.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.type === 'restraint'"
              label="No More Than"
              label-width="120px"
            >
              <el-input-number
                v-model="form.target"
                class="inputFrequency"
                placeholder="0"
                :min="0"
                :max="99"
              ></el-input-number>
              <span>Time(s) </span>
              <el-select v-model="form.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createWill">Create</el-button>
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogFormEditVisible"
          :title="`Edit ${formEdit.name}`"
        >
          <el-form :model="formEdit">
            <el-form-item label="I am willing to" label-width="100px">
              <el-input
                v-model="formEdit.name"
                autocomplete="off"
                placeholder="What are you willing to accomplish?"
              >
                <el-select
                  slot="prepend"
                  class="selectType"
                  v-model="formEdit.type"
                  placeholder="Select"
                >
                  <el-option label="Spend time" value="commitment" key="1">
                    <span style="float: left">Spend time</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Learn to play guitar
                    </span></el-option
                  >
                  <el-option label="Insist on" value="perseverance" key="2">
                    <span style="float: left">Insist on</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Keep a diary
                    </span></el-option
                  >
                  <el-option label="Resist" value="restraint" key="3">
                    <span style="float: left">Resist</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; padding-left:20px"
                      >e.g. Smoking
                    </span></el-option
                  >
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item
              label="At Least"
              label-width="100px"
              v-if="formEdit.type === 'commitment'"
            >
              <el-input-number
                v-model="formEdit.target"
                class="inputFrequency"
                placeholder="0"
                :min="0"
              ></el-input-number>
              <span>Minutes </span>
              <el-select v-model="formEdit.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="At Least"
              label-width="100px"
              v-if="formEdit.type === 'perseverance'"
            >
              <el-input-number
                v-model="formEdit.target"
                class="inputFrequency"
                placeholder="1"
                :min="1"
                :max="99"
              ></el-input-number>
              <span>Time(s) </span>
              <el-select v-model="formEdit.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="formEdit.type === 'restraint'"
              label="No More Than"
              label-width="120px"
            >
              <el-input-number
                v-model="formEdit.target"
                class="inputFrequency"
                placeholder="0"
                :min="0"
                :max="99"
              ></el-input-number>
              <span>Time(s) </span>
              <el-select v-model="formEdit.cycle" placeholder="Per Day">
                <el-option label="Per Day" value="day"> </el-option>
                <el-option label="Per Week" value="week"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateWill">Update</el-button>
            <el-button @click="deleteWill">Delete</el-button>
            <el-button @click="dialogFormEditVisible = false">Cancel</el-button>
          </div>
        </el-dialog>
      </div>
    </Panel>
  </transition>
</template>
  <style >
  .el-select .el-input {
    width: 123px;
    font-size: 14px;
  }
  .el-input-group__prepend {
    background-color: #fff;
  }
  .el-dialog {
    width: 600px;
    max-width: 90vw;
    border-radius: 12px;
  }
</style>

<style scoped>
  .el-icon-edit {
    font-size: 15px;
    color: #888888;
    position: relative;
    left: 125px;
    bottom: 25px;
    cursor: pointer;
  }
  .divContent {
    display: flex;
    /* justify-items: flex-start; */
    flex-wrap: wrap;
    height: calc(100vh - 360px);
    overflow-y: scroll;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }
  .willItem {
    margin: 15px;
    width: 140px;
    height: 140px;
  }
  .inputFrequency {
    width: 130px;
    margin-right: 10px;
    margin-left: 10px;
  }

  .btnCreateCommitment {
    position: inline-block;
    margin: 15px;
    width: 140px;
    height: 140px;
    font-size: 30px;
  }
  .spanBtnCreate {
    font-size: 14px;
    position: relative;
  }
  @media screen and (max-width: 1200px) {
    #divWillPanel {
      width: 80%;
      left: 10%;
    }
  }
  @media screen and (max-width: 480px) {
    .divContent {
      justify-content: center;
    }
  }
</style>

<script>
  import Panel from 'components/shared/Panel.vue';
  import CommitmentView from './CommitmentView.vue';
  import PerseveranceView from './PerseveranceView.vue';
  import RestraintView from './RestraintView.vue';
  import { ASSETS_UI } from 'assets';
  import TimerButton from './TimerButton.vue';
  import CounterButton from './CounterButton.vue';
  import MinusButton from './MinusButton.vue';

  export default {
    data() {
      return {
        activeName: 'second',
        ICON_WILL: ASSETS_UI['IconWill.png'],
        dialogFormVisible: false,
        dialogFormEditVisible: false,
        form: {
          name: undefined,
          type: 'commitment',
          target: 0,
          cycle: 'day'
        },
        formEdit: {
          name: undefined,
          type: 'commitment',
          target: 0,
          cycle: 'day'
        }
      };
    },
    props: {
      open: Boolean
    },

    components: {
      TimerButton,
      CounterButton,
      MinusButton,
      Panel
    },
    computed: {
      activeCommitments() {
        return this.$store.getters.activeCommitments;
      },
      activePerseverances() {
        return this.$store.getters.activePerseverances;
      },
      activeRestraints() {
        return this.$store.getters.activeRestraints;
      },
      empty() {
        return (
          this.activeCommitments.length == 0 &&
          this.activePerseverances.length == 0 &&
          this.activeRestraints.length == 0
        );
      }
    },
    methods: {
      closePanel() {
        this.$emit('close');
      },
      editWill(will) {
        this.formEdit = {
          name: will.name,
          type: will.type,
          target: will.target,
          cycle: will.cycle
        };
        this.dialogFormEditVisible = true;
      },
      resetForm() {
        this.form = {
          name: undefined,
          type: 'commitment',
          target: 0,
          cycle: 1,
          target: 1,
          cycle: 1,
          target: 0,
          cycle: 1
        };
      },
      createWill() {
        this.dialogFormVisible = false;
        this.resetForm();
      },
      updateWill() {
        this.dialogFormEditVisible = false;
      },
      deleteWill() {
        this.dialogFormEditVisible = false;
      }
    },
    mounted() {}
  };
</script>
