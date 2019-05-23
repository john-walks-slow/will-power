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
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane
            v-for="perseverance in perseverances"
            :key="perseverance._id"
            :label="perseverance.name"
            :name="perseverance._id"
            class="innerTab"
          >
            <FunctionalCalendar
              :sundayStart="false"
              v-model="calendarData"
              :is-date-picker="false"
              class="calendar"
              :markedDates="calcMarkedDate(perseverance._id)"
            />
            <el-row>
              <el-col :span="12">Buff</el-col>
              <el-col :span="12">Unleash Condition</el-col>
            </el-row>
            <el-row
              v-for="pow in calcCurrentPows(perseverance._id)"
              :key="pow._id"
            >
              <el-col
                >{{ pow.powType ? camelToText(pow.powType) : '?????' }}*{{
                  pow.ratio * 100
                }}%</el-col
              >
              <el-col
                >Complete {{ pow.target }} times in the last {{ pow.period }}
                {{ pow.cycle }}s to unleash
                {{ pow.target - calcProgress(pow) }} times remain.</el-col
              >
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </Panel>
  </transition>
</template>
<style>
  .vfc-main-container {
    box-shadow: none !important;
    font-size: 0.7rem;
    width: 100%;
    /* cursor: pointer; */
  }
  .vfc-day {
    transition: all 500ms;
  }
  .completed {
    background-color: #adfff8 !important;
  }
  .uncompleted {
    background-color: #f6b4ff !important;
  }
  .vfc-today {
    background-color: #000000 !important;
  }
  .vfc-day :hover {
    transform: scale(1.2);
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
  }
</style>

<style scoped>
  .divContent {
    height: calc(100% - 40px);
    width: 100%;
    padding-top: 20px;
    overflow-y: auto;
  }
  .tab {
    width: 100%;
    height: calc(100% - 40px);
    display: inline-block !important;
  }
  .div-pow {
    width: 100%;
    height: 300px;
    display: inline-block !important;
  }
  .calendar {
    width: 100%;
    height: 400px;
    font-size: 0.8em;
  }
</style>

<script>
  import FunctionalCalendar from 'vue-functional-calendar';
  import Panel from 'components/shared/Panel.vue';
  import { ASSETS_UI } from 'assets';
  import { mapState, mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    props: {
      open: Boolean
    },
    data() {
      return {
        activeName: undefined,
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
        let result = [];
        this.records.forEach(r => {
          if (r.willId == willId) {
            if (r.completed) {
              result.push({ date: r.day, class: 'completed' });
            } else {
              result.push({ date: r.day, class: 'uncompleted' });
            }
          }
        });
        return result;
      },
      calcProgress({ willId, period, cycle }) {
        let now = moment();
        let powCount = 0;
        this.records.forEach(record => {
          if (!record.willId == willId) {
            return;
          }
          let recordDate = moment(record.day, 'D/M/YYYY');
          if (
            recordDate.isAfter(now.subtract(period, cycle + 's')) &&
            record.completed
          ) {
            powCount++;
          }
        });
        return powCount;
      },
      calcCurrentPows(activeName) {
        return this.findPows({
          query: { $sort: { period: 1 }, willId: activeName }
        }).data;
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
      })
    },
    mounted() {
      if (this.commitments.length > 0) {
        this.activeName = this.commitments[0]._id;
      } else if (this.perseverances.length > 0) {
        this.activeName = this.perseverances[0]._id;
      } else if (this.restraints.length > 0) {
        this.activeName = this.restraints[0]._id;
      }
    }
  };
</script>


