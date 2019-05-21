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
            :startTime="commitment.lastCommitmentStartTime"
            :size="140"
            @click.native="
              if (commitment.lastCommitmentStartTime) {
                completeCommitment(commitment._id);
              } else {
                startCommitment(commitment._id);
              }
            "
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
            @click.native="completePerseverance(perseverance._id)"
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
            @click.native="failRestraint(restraint._id)"
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
          <el-form :model="form" :rules="rules" ref="formCreate">
            <el-form-item
              label="I am willing to"
              label-width="110px"
              prop="name"
              :error="
                isCreateError ? 'Something went wrong! Please try again.' : null
              "
            >
              <el-input
                v-model="form.name"
                :minlength="1"
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
              label-width="110px"
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
            <el-button
              type="primary"
              @click="submitCreateWill"
              :loading="isCreateWillPending"
              >Create</el-button
            >
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogFormEditVisible"
          :title="`Edit ${formEdit.name}`"
        >
          <el-form :model="formEdit" :rules="rules" ref="formEdit">
            <el-form-item
              label="I am willing to"
              prop="name"
              label-width="100px"
              :error="
                isEditError ? 'Something went wrong! Please try again.' : null
              "
            >
              <el-input
                v-model="formEdit.name"
                autocomplete="off"
                :minlength="1"
                placeholder="What are you willing to accomplish?"
              >
                <el-select
                  slot="prepend"
                  class="selectType"
                  v-model="formEdit.type"
                  placeholder="Select"
                  @change="
                    formEdit.target = undefined;
                    formEdit.cycle = undefined;
                  "
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
            <el-button
              type="primary"
              @click="submitPatchWill"
              :loading="isPatchWillPending"
              >Update</el-button
            >
            <el-button @click="submitRemoveWill" :loading="isRemoveWillPending"
              >Delete</el-button
            >
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
  import { mapState, mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        activeName: 'second',
        ICON_WILL: ASSETS_UI['IconWill.png'],
        dialogFormVisible: false,
        dialogFormEditVisible: false,
        isCreateWillPending: false,
        isPatchWillPending: false,
        isRemoveWillPending: false,
        isCreateError: false,
        isEditError: false,
        form: {
          name: undefined,
          type: 'commitment',
          target: 1,
          cycle: 'day'
        },
        formEdit: {},
        rules: {
          name: [
            { required: true, message: 'Please enter your will', trigger: 'blur' }
          ]
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
      ...mapGetters('users', { user: 'current' }),
      ...mapState('commitments', {
        commitments: 'keyedById'
      }),
      ...mapState('perseverances', {
        perseverances: 'keyedById'
      }),
      ...mapState('restraints', {
        restraints: 'keyedById'
      }),
      activeCommitments() {
        console.log(this.commitments);
        return this.commitments
          ? Object.values(this.commitments).filter(w => w.active)
          : [];
      },
      activePerseverances() {
        return this.perseverances
          ? Object.values(this.perseverances).filter(w => w.active)
          : [];
      },
      activeRestraints() {
        return this.restraints
          ? Object.values(this.restraints).filter(w => w.active)
          : [];
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
      ...mapActions('commitments', {
        createCommitment: 'create',
        patchCommitment: 'patch',
        removeCommitment: 'remove'
      }),
      ...mapActions('perseverances', {
        createPerseverance: 'create',
        patchPerseverance: 'patch',
        removePerseverance: 'remove'
      }),
      ...mapActions('restraints', {
        createRestraint: 'create',
        patchRestraint: 'patch',
        removeRestraint: 'remove'
      }),
      closePanel() {
        this.$emit('close');
      },
      editWill(will) {
        this.formEdit = {
          ...will
        };
        this.dialogFormEditVisible = true;
      },
      resetForm() {
        this.form = {
          name: undefined,
          type: 'commitment',
          target: 0,
          cycle: 'day',
          active: true
        };
      },
      startCommitment(id) {
        this.patchCommitment([id, {}, { query: { action: 'start' } }]);
      },
      completeCommitment(id) {
        this.patchCommitment([id, {}, { query: { action: 'complete' } }]);
      },
      completePerseverance(id) {
        this.patchPerseverance([id, {}, { query: { action: 'complete' } }]);
      },
      failRestraint(id) {
        this.patchRestraint([id, {}, { query: { action: 'fail' } }]);
      },
      async submitCreateWill() {
        this.$refs['formCreate'].validate(async valid => {
          if (valid) {
            this.isCreateWillPending = true;
            try {
              switch (this.form.type) {
                case 'commitment':
                  await this.createCommitment(
                    Object.assign(this.form, { userId: this.user._id })
                  );
                  break;
                case 'perseverance':
                  await this.createPerseverance(
                    Object.assign(this.form, { userId: this.user._id })
                  );
                  break;
                case 'restraint':
                  await this.createRestraint(
                    Object.assign(this.form, { userId: this.user._id })
                  );
                  break;
                default:
                  break;
              }
            } catch (e) {
              this.isCreateError = true;
            }
            this.dialogFormVisible = false;
            this.isCreateWillPending = false;
            this.resetForm();
          }
        });
      },
      async submitPatchWill() {
        this.$refs['formEdit'].validate(async valid => {
          if (valid) {
            this.isPatchWillPending = true;
            try {
              switch (this.formEdit.type) {
                case 'commitment':
                  await this.patchCommitment([
                    this.formEdit._id,
                    Object.assign(this.formEdit)
                  ]);
                  break;
                case 'perseverance':
                  await this.patchPerseverance([
                    this.formEdit._id,
                    Object.assign(this.formEdit)
                  ]);
                  break;
                case 'restraint':
                  await this.patchRestraint([
                    this.formEdit._id,
                    Object.assign(this.formEdit)
                  ]);
                  break;
                default:
                  break;
              }
            } catch (e) {
              this.isEditError = true;
            }
            this.isPatchWillPending = false;
            this.dialogFormEditVisible = false;
          }
        });
      },

      async submitRemoveWill() {
        this.isRemoveWillPending = true;
        try {
          switch (this.formEdit.type) {
            case 'commitment':
              await this.removeCommitment([this.formEdit._id]);
              break;
            case 'perseverance':
              await this.removePerseverance([this.formEdit._id]);
              break;
            case 'restraint':
              await this.removeRestraint([this.formEdit._id]);
              break;
            default:
              break;
          }
        } catch (e) {
          this.isEditError = true;
        }
        this.isRemoveWillPending = false;
        this.dialogFormEditVisible = false;
      }
    },
    mounted() {}
  };
</script>
