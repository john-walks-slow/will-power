<template>
  <transition name="zoom">
    <Panel
      title="PROOF OF WILLS"
      :imgSrc="ICON_ACHIEVEMENT"
      v-if="open"
      color="#d784f8"
      :closePanel="closePanel"
    >
      <div slot="content" class="divContent">
        <el-tabs class=".tab" v-model="activeName">
          <el-tab-pane
            v-for="perseverance in perseverances"
            :key="perseverance._id"
            :label="perseverance.name"
            :name="perseverance._id"
          >
            <FunctionalCalendar
              v-model="calendarData"
              :is-date-picker="true"
              class="calendar"
              :markedDates="calcMarkedDate(perseverance._id)"
            />
            <div v-if="calendarData.selectedDate" class="divInfo"></div>
          </el-tab-pane>
        </el-tabs>
        <div class="divPow">
          <div v-for="pow in currentPows" :key="pow._id">
            <div class="powRow">
              <span>{{
                pow.powType ? camelToText(pow.powType) : '?????'
              }}</span>
              <span>*{{ pow.ratio * 100 }}%</span>
              <span
                >Complete {{ pow.target }} times in the last {{ pow.period }}
                {{ pow.cycle }}s</span
              >
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </transition>
</template>
<style>
  .vfc-main-container {
    box-shadow: none !important;
    /* cursor: pointer; */
  }
  /* .vfc-day {
              transition: all 500ms;
            }
            .vfc-marked {
              transition-delay: 100s;
              background-color: #d784f8 !important;
              transition: all 500ms;
            }

            .vfc-today {
              background-color: #a5a5a5 !important;
            }
            .vfc-day :hover {
              transform: scale(1.2);
              transition: all 500ms;
            }
            .vfc-day :active {
              background-color: #cecece;
              transition: all 500ms;
            }
            .el-tabs__active-bar.is-top {
              background-color: #d784f8;
            }
            .el-tabs__item.is-active {
              color: #d784f8;
            }
            .el-tabs__item:hover {
              color: #bc19fc;
            } */
</style>

<style scoped>
  .divContent {
    height: calc(100% - 40px);
    width: 100%;
    padding-top: 20px;
    overflow-y: auto;
  }
  .tab {
    height: 50%;
  }
  .calendar {
    width: 50%;
    height: calc(50vh - 180px);
  }
</style>

<script>
  import FunctionalCalendar from 'vue-functional-calendar';
  import Panel from 'components/shared/Panel.vue';
  import { ASSETS_UI } from 'assets';
  import { mapState, mapGetters } from 'vuex';

  export default {
    props: {
      open: Boolean
    },
    data() {
      return {
        activeName: null,
        ICON_ACHIEVEMENT: ASSETS_UI['IconAchievement.png'],
        calendarData: {}
      };
    },
    components: {
      Panel,
      FunctionalCalendar
    },
    methods: {
      closePanel() {
        this.$emit('close');
      },
      onTabClick() {},
      camelToText(string) {
        var result = string.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
      },
      calcMarkedDate(willId) {
        let result = this.records.filter(r => r.willId == willId && r.completed);
        console.log(result);
        if (result.length == 0) {
          return null;
        } else result = result.map(r => r.day);
        console.log(result);
        return result;
      }
    },

    computed: {
      ...mapGetters('commitments', {
        commitments: 'list'
      }),
      ...mapGetters('perseverances', {
        perseverances: 'list'
      }),
      ...mapGetters('restraints', {
        restraints: 'list'
      }),
      ...mapGetters('proof-of-wills', {
        findPows: 'find'
      }),
      ...mapGetters('check-records', {
        records: 'list'
      }),
      currentPows() {
        return this.findPows({
          query: { $sort: { period: 1 }, willId: this.activeName }
        }).data;
      }
    },
    mounted() {
      if (this.commitments.length !== 0) {
        this.activeName = this.this.commitments[0]._id;
      } else if (this.perseverances.length !== 0) {
        this.activeName = this.this.perseverances[0]._id;
      } else if (this.restraints.length !== 0) {
        this.activeName = this.this.restraints[0]._id;
      }
    }
  };
</script>


