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
                label="By acquired date"
              ></el-radio-button>
            </el-radio-group>
          </div>
          <div class="divEquipments">
            <el-popover
              v-for="equipment in equipments"
              :key="equipment.id"
              placement="top"
              width="100"
              trigger="click"
              class="item"
            >
              {{ equipment.name }}
              <div
                class="divDescription"
                v-if="equipment.equipmentType == 'weapon'"
              >
                Damage: {{ equipment.damage }} <br />
                WP Cost:
                {{ equipment.wpConsumption }}
                <br />
              </div>

              <div
                class="divDescription"
                v-if="equipment.equipmentType == 'offHand'"
              >
                Max Hp: {{ equipment.maxHp }} <br />
                Max WP:{{ equipment.maxWp }}
                <br />
              </div>
              <el-button v-if="!equipment.equipped" size="mini" type="text"
                >Equip</el-button
              >
              <el-button v-if="equipment.equipped" size="mini" type="text"
                >Unequip</el-button
              >
              <el-button size="mini" type="text">Decompose</el-button>

              <div
                @click="onEquipmentClick(equipment)"
                slot="reference"
                :class="[
                  'divEquipmentItem',
                  { rarity1: equipment.rarity === 1 },
                  { rarity2: equipment.rarity === 2 },
                  { rarity3: equipment.rarity === 3 }
                ]"
              >
                <img
                  :src="ASSETS_EQUIPMENT[`${equipment.type}.png`]"
                  alt=""
                  srcset=""
                />
                <span v-if="equipment.equipped" class="badgeEquipped">E</span>
              </div>
            </el-popover>
          </div>
          <el-button class="buttonForge" round>
            <div class="flexButtonForge">
              Forge New Equipment
              <img class="imgWillGem" :src="WILL_GEM" alt="" srcset="" /><span
                class="spanGem"
                >{{ willGem }} / 10</span
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
          :src="ASSETS_EQUIPMENT[`${newEquipment.type}.png`]"
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
    height: calc(100vh - 420px);
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
    background-color: #dfdfdf;
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
    border: gold 3px solid;
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
    display: block;
    margin: auto;
    height: 30px;
    padding: 0px 20px;
    background-color: #eeeeee;
    border-color: transparent;
  }
  .flexButtonForge {
    display: flex;
    align-content: center;
    align-items: center;
    font-size: 0.8rem;
    color: black !important;
  }
  .imgWillGem {
    height: 0.8rem;
    margin-left: 15px;
    margin-right: 5px;
  }
  .spanGem {
    font-size: 12px;
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
  import { CLIENT_RENEG_LIMIT } from 'tls';
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
        ASSETS_EQUIPMENT: ASSETS_EQUIPMENT,
        radioSort: 'By rarity',
        dialogVisible: false,
        newEquipment: undefined
      };
    },
    computed: {
      equipments() {
        function compare(key, smallFirst) {
          return function compare(a, b) {
            if (a[key] < b[key]) {
              return smallFirst ? -1 : 1;
            }
            if (a[key] > b[key]) {
              return smallFirst ? 1 : -1;
            }
            return 0;
          };
        }

        if (this.radioSort === 'By rarity') {
          return this.$store.state.equipments.sort(compare('rarity', false));
        } else {
          return this.$store.state.equipments.sort(
            compare('acquiredTimestamp', false)
          );
        }
      },
      weapons() {
        return this.equipments.filter(e => e.equipmentType === 'weapon');
      },

      offHands() {
        return this.equipments.filter(e => e.equipmentType === 'offHand');
      },
      willGem() {
        return this.$store.state.gameProgress.willGem;
      }
    },
    methods: {
      closePanel() {
        this.$emit('close');
      },
      onEquipmentClick(equipment) {},
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

