<template>
  <div id="divContainer">
    <el-dropdown
      style="z-index: 300;"
      trigger="click"
      @command="handleDropdown"
    >
      <img id="imgAvatar" :src="avatar" class="el-dropdown-link" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-user" command="profile">{{
          user.email
        }}</el-dropdown-item>
        <el-dropdown-item icon="el-icon-key" command="logout"
          >Log Out</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <div class="barHp bar">
      <el-progress
        :percentage="(100 * hp) / maxHp"
        :stroke-width="27"
        :text-inside="true"
        color="#e96268"
      />
      <span class="spanBar">{{ `${hp}/${maxHp} HP` }}</span>
    </div>
    <div class="barWp bar">
      <el-progress
        :percentage="(100 * wp) / maxWp"
        :stroke-width="27"
        :text-inside="true"
        color="#62e9e3"
      />
      <span class="spanBar">{{ `${wp}/${maxWp} WP` }}</span>
    </div>
  </div>
</template>

<style scoped>
  #divContainer {
    position: fixed;
    left: 20px;
    top: 20px;
  }
  #imgAvatar {
    width: 105px;
    position: relative;
    left: 5px;
    border-radius: 100px;
    border: 6px solid white;
    z-index: 102;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .bar
    /deep/
    div
    /deep/
    div
    /deep/
    div
    /deep/
    div
    /deep/
    .el-progress-bar__innerText {
    display: none;
  }

  .bar /deep/ div /deep/ div /deep/ div /deep/ .el-progress-bar__inner {
    border-radius: 10px;
  }
  .bar /deep/ div /deep/ div /deep/ .el-progress-bar__outer {
    border: 6px solid white;
    border-radius: 0px 12px 12px 0px;
  }
  .spanBar {
    position: absolute;
    color: #000000;
    font-size: 14pt;
    right: 16px;
    top: 12px;
    font-family: 'silom';
  }

  .barHp {
    width: 260px;
    max-width: 60vw;
    position: absolute;
    left: 95px;
    top: 17px;
    z-index: 100;
  }

  .barHp /deep/ div /deep/ div /deep/ div {
    background-color: #fff4f4;
  }

  .barWp {
    width: 220px;
    max-width: 60vw;
    position: absolute;
    left: 95px;
    top: 60px;
    z-index: 100;
  }
  .barWp /deep/ div /deep/ div /deep/ div {
    background-color: #d2fcff;
  }
  @media screen and (max-width: 1200px) {
    #divContainer {
      position: fixed;
      left: 10px;
      top: 10px;
    }
    #imgAvatar {
      width: 85px;
    }
    .barHp {
      left: 75px;
      top: 10px;
    }
    .barWp {
      left: 75px;
      top: 50px;
    }
  }
</style>

<script>
  import { ASSETS_PROFILE } from 'assets';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        knight: undefined
      };
    },
    computed: {
      ...mapGetters('users', { user: 'current' }),
      equippedOffHands() {
        console.log('calculating offhands');
        if (!this.equipments) {
          return null;
        } else {
          return this.equipments.filter(
            e => e.equipped === true && e.position === 'offHand'
          );
        }
        return null;
      },
      avatar() {
        return ASSETS_PROFILE['user.png'];
      },
      hp() {
        return this.knight ? this.knight.hp : 0;
      },
      wp() {
        return this.knight ? this.knight.wp : 0;
      },
      maxHp() {
        return this.equippedOffhands ? this.equippedOffhands.maxHp : 50;
      },
      maxWp() {
        return this.equippedOffhands ? this.equippedOffhands.maxWp : 50;
      }
    },
    methods: {
      ...mapActions('auth', ['logout']),
      ...mapActions('knights', { findKnights: 'find' }),

      submitLogout() {
        this.logout();
        this.$router.push('/login');
      },
      handleDropdown(command) {
        switch (command) {
          case 'logout':
            this.submitLogout();
            break;

          default:
            break;
        }
      }
    },
    mounted() {
      this.findKnights({
        query: {
          userId: this.user._id
        }
      }).then(v => {
        this.knight = v.data[0];
      });
    }
  };
</script>