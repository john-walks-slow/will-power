<template>
  <div id="divContainer">
    <el-dropdown
      style="z-index: 300;"
      trigger="click"
      @command="handleDropdown"
    >
      <!-- <dir ></dir> -->
      <img id="imgAvatar" :src="avatar" class="el-dropdown-link" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-user" command="profile">{{
          email
        }}</el-dropdown-item>
        <el-dropdown-item icon="el-icon-key" command="logout"
          >Log Out</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <Bar class="barHp" type="hp" :value="hp" :maxValue="maxHp" />
    <Bar class="barWp" type="wp" :value="wp" :maxValue="maxWp" />
  </div>
</template>

<style scoped>
  #divContainer {
    position: fixed;
    left: 20px;
    top: 20px;
  }
  #imgAvatar {
    width: 120px;
    position: relative;
    left: 5px;
    border-radius: 100px;
    border: 10px solid white;
    background-color: rgb(255, 255, 255);
    z-index: 102;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  .barHp {
    width: 220px;
    max-width: 60vw;
    position: absolute;
    left: 95px;
    top: 17px;
    z-index: 100;
  }
  .barWp {
    width: 200px;
    max-width: 60vw;
    position: absolute;
    left: 95px;
    top: 60px;
    z-index: 100;
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
  import { ASSETS_AVATAR } from 'assets';
  import { mapActions, mapGetters } from 'vuex';
  import { makeGetMixin } from 'feathers-vuex';
  import { mapFields } from '../../utils';
  import Bar from 'components/shared/Bar.vue';
  export default {
    components: { Bar },
    computed: {
      ...mapGetters('knights', { knight: 'current' }),
      ...mapGetters('users', { user: 'current' }),
      equippedOffHands() {
        if (!this.equipments) {
          return null;
        } else {
          return this.equipments.filter(
            e => e.equipped === true && e.type === 'offHand'
          );
        }
      },
      avatar() {
        return ASSETS_AVATAR['knight.png'];
      },
      ...mapFields('knight', ['hp', 'wp', 'maxHp', 'maxWp']),
      ...mapFields('user', ['email'])
    },
    methods: {
      ...mapActions('auth', ['logout']),
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
      console.log(this.user);
      console.log(this.$store.state);

      // this.findKnights({
      //   query: {
      //     userId: this.user._id
      //   }
      // }).then(v => {
      //   this.knight = v.data[0];
      // });
    }
  };
</script>
