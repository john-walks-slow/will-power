<template>
  <transition name="zoom">
    <Panel
      title="ACHIEVEMENTS"
      :imgSrc="ICON_ACHIEVEMENT"
      v-if="open"
      color="#d784f8"
      :closePanel="closePanel"
    >
      <div slot="content" class="divContent">
        <el-tabs class=".tab" v-model="activeName" @tab-click="onTabClick">
          <el-tab-pane
            v-for="commitment in commitments"
            :key="commitment._id"
            :label="commitment.name"
            :name="commitment._id"
          >
            <FunctionalCalendar
              v-model="calendarData"
              :is-date-picker="true"
              class="calendar"
              :markedDates="calculateCommitmentCompletedDates(commitment)"
            />
            <div v-if="calendarData.selectedDate" class="divInfo">
              <!-- {{
                calculateCommitmentProgressByDay(
                  commitment,
                  new Date(calendarData.selectedDate)
                )
              }} -->
            </div>
          </el-tab-pane>
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
              :markedDates="calculatePerseveranceCompletedDates(perseverance)"
            />
          </el-tab-pane>
          <el-tab-pane
            v-for="restraint in restraints"
            :key="restraint._id"
            :label="restraint.name"
            :name="restraint._id"
          >
            <FunctionalCalendar
              v-model="calendarData"
              :is-date-picker="true"
              class="calendar"
              :markedDates="calculateRestraintCompletedDates(restraint)"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </Panel>
  </transition>
</template>
<style>
  .vfc-main-container {
    box-shadow: none !important;
    /* cursor: pointer; */
  }
  .vfc-day {
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
  }
</style>

<style scoped>
  .divContent {
    height: calc(100vh - 360px);
    width: 100%;
    padding-top: 20px;
  }
  .tab {
  }
  .calendar {
    width: 50%;
    height: calc(50vh - 180px);
  }
</style>

<script>
  Date.prototype.Format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        );
    return fmt;
  };
  import FunctionalCalendar from 'vue-functional-calendar';

  import Panel from 'components/shared/Panel.vue';
  import { ASSETS_UI } from 'assets';
  import { mapState, mapGetters } from 'vuex';
  function sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

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
      calculateCommitmentProgressByDay(commitment, date) {
        console.log(commitment);
        return commitment.records
          .filter(r => sameDay(new Date(r.time), date))
          .reduce((i, current) => {
            return i + current.progress;
          }, 0);
      },
      calculateCommitmentCompletedDates(commitment) {
        // new Date(r.recordDate).Format('d/M/yyyy'))
        let completedDates = [];
        commitment.records.reduce((i, current, index) => {
          // if not same day, calculate progress
          let currentDate = new Date(current.time);
          if (
            index != 0 &&
            !sameDay(new Date(commitment.records[index - 1].time), currentDate)
          ) {
            let progress = this.calculateCommitmentProgressByDay(
              commitment,
              currentDate
            );
            if (progress >= commitment.target) {
              completedDates.push(currentDate.timeFormat('d/M/yyyy'));
            }
            i = [];
          }
          i.push(current);
          return i;
        }, []);
        return completedDates;
      },
      calculatePerseveranceProgressByDay(perseverance, date) {
        console.log(perseverance);
        return perseverance.records.filter(r => sameDay(new Date(r.time), date))
          .length;
      },
      calculatePerseveranceCompletedDates(perseverance) {
        // new Date(r.recordDate).Format('d/M/yyyy'))
        let completedDates = [];
        perseverance.records.reduce((i, current, index) => {
          // if not same day, calculate progress
          let currentDate = new Date(current.time);
          if (
            index != 0 &&
            !sameDay(new Date(perseverance.records[index - 1].time), currentDate)
          ) {
            let progress = this.calculatePerseveranceProgressByDay(
              perseverance,
              currentDate
            );
            if (progress >= perseverance.target) {
              completedDates.push(currentDate.timeFormat('d/M/yyyy'));
            }
            i = [];
          }
          i.push(current);
          return i;
        }, []);
        return completedDates;
      },
      calculateRestraintProgressByDay(restraint, date) {
        console.log(restraint);
        return restraint.records.filter(r => sameDay(new Date(r.time), date))
          .length;
      },
      calculateRestraintCompletedDates(restraint) {
        // new Date(r.recordDate).Format('d/M/yyyy'))
        let completedDates = [];
        restraint.records.reduce((i, current, index) => {
          // if not same day, calculate progress
          let currentDate = new Date(current.time);
          if (
            index != 0 &&
            !sameDay(new Date(restraint.records[index - 1].time), currentDate)
          ) {
            let progress = this.calculateRestraintProgressByDay(
              restraint,
              currentDate
            );
            if (progress <= restraint.target) {
              completedDates.push(currentDate.timeFormat('d/M/yyyy'));
            }
            i = [];
          }
          i.push(current);
          return i;
        }, []);
        return completedDates;
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
      })
      // commitments() {
      //   let commitments = this.$store.state.wills.commitments.slice(0);
      //   // function calculateRange(dates) {
      //   //   let lastD;
      //   //   let d = dates.sort();
      //   //   let oldRange ={};
      //   //   let range = {};
      //   //   let oldStreak=0;
      //   //   let streak=0;
      //   //   d.forEach(d => {
      //   //     if (new Date(d) - new Date(lastD) <= 86400000) {
      //   //       streak++;
      //   //       if (range.end === lastD) {
      //   //         range.end = d;
      //   //       } else {
      //   //         if (range.end){
      //   //           oldRange=range
      //   //         }
      //   //         range={ start: d, end: d };
      //   //       }
      //   //     }
      //   //   });
      //   //   console.log(ranges);
      //   //   return ranges;
      //   // }
      //   commitments.forEach(c => {
      //     c.accomplishedDates = c.records
      //       ? c.records
      //           .filter(r => r.progress >= c.target)
      //           .map(r => new Date(r.recordDate).Format('d/M/yyyy'))
      //       : [];
      //   });
      //   // commitments.forEach(c => {
      //   //   c.accomplishedRanges = c.records
      //   //     ? calculateRange(c.accomplishedDates)
      //   //     : [];
      //   // });
      //   return commitments;
      // },
      // wills() {
      //   let wills = [
      //     ...this.$store.state.wills.commitments,
      //     ...this.$store.state.wills.perseverances,
      //     ...this.$store.state.wills.restraints
      //   ];
      //   wills.forEach(c => {
      //     c.accomplishedDates = c.records
      //       ? c.records
      //           .filter(r => r.progress >= c.target)
      //           .map(r => new Date(r.recordDate).Format('d/M/yyyy'))
      //       : [];
      //   });
      //   return wills;
      // },
      // perseverances() {
      //   return this.$store.state.wills.perseverances;
      // },
      // restraints() {
      //   return this.$store.state.wills.restraints;
      // }
    },
    mounted() {
      this.activeName = this.commitments[0]._id;
    }
  };
</script>


