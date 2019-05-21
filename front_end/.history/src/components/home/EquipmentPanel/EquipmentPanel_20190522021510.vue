<template>
  <div>
    <transition name="zoom">
      <Panel
        title="EQUIPMENTS"
        :imgSrc="ICON_EQUIPMENT"
        v-if="open"
        color="#e96268"
        :closePanel="closePanel"
      >
        <div slot="content">
          <div class="divSort">
            <el-radio-group
              fill="#e96268"
              class="radioGroupSort"
              v-model="radioSort"
            >
              <el-radio-button
                class="radioButtonSort"
                label="By rarity"
              ></el-radio-button>
              <el-radio-button
                class="radioButtonSort"
                label="By acquired time"
                break
              ></el-radio-button>
            </el-radio-group>
          </div>
          <div class="divEquipments">
            <el-popover
              v-for="equipment in sortedEquipments"
              :key="equipment._id"
              placement="top"
              width="100"
              trigger="click"
              class="item"
            >
              {{ equipment.name }}
              <div class="divDescription" v-if="equipment.cat == 'weapon'">
                Damage: {{ equipment.damage }} <br />
                WP Cost:
                {{ equipment.wpConsumption }}
                <br />
              </div>

              <div class="divDescription" v-if="equipment.cat == 'offHand'">
                Max Hp: {{ equipment.maxHp }} <br />
                Max WP:{{ equipment.maxWp }}
                <br />
              </div>
              <el-button
                v-if="!equipment.equipped"
                size="mini"
                type="text"
                @click="
                  equipment.infoOpen = false;
                  equip(equipment._id);
                "
                >Equip</el-button
              >
              <el-button
                v-if="equipment.equipped"
                size="mini"
                type="text"
                @click="
                  equipment.infoOpen = false;
                  unequip(equipment._id);
                "
                >Unequip</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="
                  equipment.infoOpen = false;
                  removeEquipment(equipment._id);
                "
                >Decompose</el-button
              >

              <div
                slot="reference"
                :class="[
                  'divEquipmentItem',
                  { rarity1: equipment.rarity === 1 },
                  { rarity2: equipment.rarity === 2 },
                  { rarity3: equipment.rarity === 3 },
                  { rarity4: equipment.rarity === 4 },
                  { rarity5: equipment.rarity === 5 }
                ]"
              >
                <img
                  :src="ASSETS_EQUIPMENT[`${equipment.typeId}.png`]"
                  srcset=""
                  alt=""
                />
                <span v-if="equipment.equipped" class="badgeEquipped">E</span>
              </div>
            </el-popover>
          </div>
          <el-button
            class="buttonForge"
            round
            :disabled="willGem < 100"
            @click="createEquipment({ userId: user._id })"
          >
            <div class="flexButtonForge">
              Forge New Equipment
              <img class="imgWillGem" :src="WILL_GEM" alt="" srcset="" /><span
                class="spanGem"
                :class="{ notEnough: willGem < 100 }"
                >100 / {{ willGem }}</span
              >
            </div>
          </el-button>
          <div></div>
        </div>
      </Panel>
    </transition>
    <el-dialog
      title="New equipment acuired"
      v-if="newEquipment"
      :visible.sync="dialogVisible"
      width="300px"
    >
      <div
        :class="[
          'divEquipmentItem dialogItem',
          { rarity1: newEquipment.rarity === 1 },
          { rarity2: newEquipment.rarity === 2 },
          { rarity3: newEquipment.rarity === 3 }
        ]"
      >
        <img
          :src="ASSETS_EQUIPMENT[`${newEquipment.typeId}.png`]"
          alt=""
          srcset=""
        />
      </div>
      <div class="divNewEquipmentInfo">
        {{ newEquipment.name }}
        <div v-if="newEquipment.equipmentType == 'weapon'">
          Damage: {{ newEquipment.damage }} <br />
          WP Cost:
          {{ newEquipment.wpConsumption }}
          <br />
        </div>

        <div v-if="newEquipment.equipmentType == 'offHand'">
          Max Hp: {{ newEquipment.maxHp }} <br />
          Max WP:{{ newEquipment.maxWp }}
          <br />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >Great!</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<style scoped>
  .divDescription {
    font-size: 0.8rem;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
  .divEquipments {
    display: flex;
    /* justify-items: flex-start; */
    flex-wrap: wrap;
    height: calc(100vh - 380px);
    overflow-y: scroll;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }
  .radioGroupSort {
    width: 100%;
  }
  .radioButtonSort {
    width: 50%;
  }
  .radioButtonSort /deep/ span {
    font-size: 12px;
    width: 100%;
    padding: 5px !important;
    border: 1px solid #e96268 !important;
    color: #e96268;
    /* border: none !important; */
  }
  .divSort {
    height: 30px;
  }

  .divEquipmentItem.dialogItem {
    background-color: #dfdfdf;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    margin: auto;
    transition: all 150ms;
  }
  .divEquipmentItem {
    background-color: #efefef;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    margin: 10px;
    cursor: pointer;
    transition: all 150ms;
  }
  .divEquipmentItem.rarity1 {
    border: #783714 3px solid;
  }

  .divEquipmentItem.rarity2 {
    border: #c0c0c0 3px solid;
  }

  .divEquipmentItem.rarity3 {
    border: #db4dff 3px solid;
  }
  .divEquipmentItem.rarity4 {
    border: gold 3px solid;
  }
  .divEquipmentItem.rarity5 {
    border: #91fcf6 3px solid;
  }

  .divEquipmentItem:hover {
    transform: scale(1.1);
    transition: all 150ms;
  }

  .divEquipmentItem img {
    width: 40px;
    height: 40px;
    padding: 5px;
    image-rendering: pixelated;
  }
  .buttonForge {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    width: 300px;
    display: block;
    margin: auto;
    height: 30px;
    padding: 0px 20px;
    background-color: #000000 !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    border-color: transparent;
  }
  .flexButtonForge {
    display: flex;
    align-content: center;
    align-items: center;
    font-size: 0.8rem;
    color: white !important;
  }
  .imgWillGem {
    height: 0.8rem;
    margin-left: 15px;
    margin-right: 5px;
  }
  .spanGem {
    font-size: 12px;
  }
  .spanGem.notEnough {
    font-size: 12px;
    color: #db4dff;
  }
  .badgeEquipped {
    position: relative;
    font-size: 10px;
    left: 5px;
    bottom: 30px;
    height: 10px;
  }
  .divNewEquipmentInfo /deep/ div {
    /* margin-left: 100px;
                                                                                                                                                                                                                                                                                                                                                                                                                                                        margin-top: 10px; */
    color: black;
    font-size: 0.8rem !important;
  }
  .divNewEquipmentInfo {
    text-align: center;
    margin-top: 10px;
    color: black;
    font-size: 0.8rem !important;
  }
</style>

<script>
  import Panel from 'components/shared/Panel.vue';
  import { ASSETS_UI, ASSETS_EQUIPMENT } from 'assets';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { mapFields } from '../../../utils';

  export default {
    components: {
      Panel
    },
    props: {
      open: Boolean
    },
    data() {
      return {
        ICON_EQUIPMENT: ASSETS_UI['IconEquipment.png'],
        WILL_GEM: ASSETS_UI['WillGem.gif'],
        ASSETS_EQUIPMENT,
        radioSort: 'By rarity',
        dialogVisible: false,
        newEquipment: undefined,
        infoOpen: false
      };
    },
    computed: {
      ...mapGetters('equipments', { findEquipment: 'find' }),
      sortedEquipments() {
        let result;
        switch (this.radioSort) {
          case 'By rarity':
            result = this.findEquipment({
              query: { $sort: { equipped: -1, rarity: -1 } }
            });
            break;
          case 'By acquired time':
            result = this.findEquipment({
              query: { $sort: { acquiredTime: -1 } }
            });
            break;
          default:
            result = null;
            break;
        }
        return result.data;
        // function compare(key, smallFirst) {
        //   return function compare(a, b) {
        //     if (a[key] < b[key]) {
        //       return smallFirst ? -1 : 1;
        //     }
        //     if (a[key] > b[key]) {
        //       return smallFirst ? 1 : -1;
        //     }
        //     return 0;
        //   };
        // }

        // if (this.radioSort === 'By rarity') {
        //   return Object.values(this.equipments).sort(compare('rarity', false));
        // } else {
        //   return Object.values(this.equipments).sort(
        //     compare('acquiredTimestamp', false)
        //   );
        // }
      },
      ...mapGetters('users', { user: 'current' }),
      ...mapGetters('knights', { knight: 'current' }),
      ...mapFields('knight', ['willGem'])
    },
    methods: {
      ...mapActions('equipments', {
        createEquipment: 'create',
        removeEquipment: 'remove',
        patchEquipment: 'patch'
      }),
      equip(_id) {
        this.patchEquipment([_id, {}, { query: { action: 'equip' } }]);
      },
      unequip(_id) {
        this.patchEquipment([_id, {}, { query: { action: 'unequip' } }]);
      },
      closePanel() {
        this.$emit('close');
      },
      openNewEquipmentDialog() {
        this.dialogVisible = true;
      }
    },
    mounted() {
      // this.newEquipment = this.equipments[0];
      // console.log(this.newEquipment);
      // this.openNewEquipmentDialog();
    }
  };
</script>

