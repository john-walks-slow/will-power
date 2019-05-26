<template>
  <transition name="zoom">
    <Panel
      title="POWS"
      :imgSrc="ICON_POW"
      v-if="open"
      color="#d784f8"
      :closePanel="closePanel"
    >
      <div slot="content" class="divContent">
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane
            v-for="commitment in commitments"
            :key="commitment._id"
            :label="commitment.name"
            :name="commitment._id"
            class="innerTab"
          >
            <el-row
              class="rowPow"
              v-for="pow in calcCurrentPows(commitment._id)"
              :key="pow._id"
            >
              <el-col
                :span="12"
                class="colPowProgress"
                :class="{ active: pow.powType }"
                ><span class="spanPowProgress">{{ pow.progress }} /</span>
                {{ pow.target }} success in {{ pow.period }}
                {{ pow.cycle }}s</el-col
              >
              <el-col :span="12" class="colPowType active" v-if="pow.powType">{{
                powToText(pow)
              }}</el-col>
              <el-col :span="12" class="colPowType" v-else>????????????</el-col>
            </el-row>
            <el-divider />
          </el-tab-pane>
          <el-tab-pane
            v-for="perseverance in perseverances"
            :key="perseverance._id"
            :label="perseverance.name"
            :name="perseverance._id"
            class="innerTab"
          >
            <el-row
              class="rowPow"
              v-for="pow in calcCurrentPows(perseverance._id)"
              :key="pow._id"
            >
              <el-col
                :span="12"
                class="colPowProgress"
                :class="{ active: pow.powType }"
                ><span class="spanPowProgress">{{ pow.progress }} /</span>
                {{ pow.target }} success in {{ pow.period }}
                {{ pow.cycle }}s</el-col
              >
              <el-col :span="12" class="colPowType active" v-if="pow.powType">{{
                powToText(pow)
              }}</el-col>
              <el-col :span="12" class="colPowType" v-else>????????????</el-col>
            </el-row>
            <el-divider />
          </el-tab-pane>

          <el-tab-pane
            v-for="restraint in restraints"
            :key="restraint._id"
            :label="restraint.name"
            :name="restraint._id"
            class="innerTab"
          >
            <el-row
              class="rowPow"
              v-for="pow in calcCurrentPows(restraint._id)"
              :key="pow._id"
            >
              <el-col
                :span="12"
                class="colPowProgress"
                :class="{ active: pow.powType }"
                ><span class="spanPowProgress">{{ pow.progress }} /</span>
                {{ pow.target }} success in {{ pow.period }}
                {{ pow.cycle }}s</el-col
              >
              <el-col :span="12" class="colPowType active" v-if="pow.powType">{{
                powToText(pow)
              }}</el-col>
              <el-col :span="12" class="colPowType" v-else>????????????</el-col>
            </el-row>
            <el-divider />
          </el-tab-pane>
          <el-row v-if="activeName !== undefined && activeName !== '0'">
            <el-col :span="9">
              <FunctionalCalendar
                :sundayStart="false"
                v-model="calendarData"
                :is-date-picker="false"
                class="calendar"
                :key="activeName"
                :markedDates="markedDates"
              />
            </el-col>
            <el-col :span="15">
              <ve-pie
                class="powPie"
                :settings="{ radius: 80, offsetY: 100 }"
                :data="calcedData"
                :legend-visible="false"
                height="200px"
                width="300px"
              />
            </el-col>
          </el-row>
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
    background-color: #b7faf1 !important;
  }
  .uncompleted {
    background-color: #fcbeb5 !important;
  }
  .vfc-today {
    background-color: #bebebe !important;
  }
  .vfc-day :hover {
    transform: scale(1.2);
    transition: all 500ms;
  }
  .el-tabs__active-bar.is-top {
    background-color: #60e4d2;
  }
  .el-tabs__item.is-active {
    color: #6ce2d2;
  }
  .el-tabs__item:hover {
    color: #b7faf1;
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
    height: calc(100% - 240px);
    display: inline-block !important;
  }
  .div-pow {
    width: 100%;
    height: 300px;
    display: inline-block !important;
  }
  .calendar {
    width: 200px;
    height: 220px;
    font-size: 1em;
  }
  .titlePow {
    font-size: 0.9em;
  }
  .rowPow {
    font-size: 0.8em;
    font-family: 'silom';
  }
  .powPie {
    width: 200px !important;
    height: 200px !important;
    display: inline-block !important;
  }
  .colPowProgress {
    color: #b4b4b4;
  }
  .colPowProgress.active {
    color: #46e2cd;
  }
  .spanPowProgress {
    color: #9ff1e7;
  }
  .colPowProgress.active .spanPowProgress {
    color: #46e2cd;
  }
  .colPowType {
    color: #edbeff;
  }
  .colPowType.active {
    color: #bc19fc;
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
        ICON_POW: ASSETS_UI['IconAchievement.png'],
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
      powToText({ powType, ratio }) {
        let result = powType.slice(3);
        if (powType.includes('Increase')) {
          result = powType.replace('Increase', '');
          result += '*' + ratio * 100 + '%';
        } else {
          result = powType.replace('Reduce', '');
          result += '/' + ratio * 100 + '%';
        }
        result = result.replace(/([A-Z])/g, ' $1');
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
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
      }),

      markedDates() {
        let result = [];
        this.records.forEach(r => {
          if (r.willId == this.activeName) {
            if (r.completed) {
              result.push({ date: r.date, class: 'completed' });
            } else {
              result.push({ date: r.date, class: 'uncompleted' });
            }
          }
        });
        return result;
      },
      calcedData() {
        let result = { columns: ['Success', 'Count'], rows: [] };
        let completed = 0;
        let uncompleted = 0;
        this.records.forEach(r => {
          if (r.willId == this.activeName) {
            if (r.completed) {
              completed++;
            } else {
              uncompleted++;
            }
          }
        });
        result.rows.push({ Success: 'Success', Count: completed });
        result.rows.push({ Success: 'Fail', Count: uncompleted });
        console.log(result);
        return result;
      }
    }
  };
</script>


