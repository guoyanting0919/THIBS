<template>
  <el-dialog title="編輯訂單" @closed="temp.passengerNum = 0" @close="handleClose" :visible.sync="editDialog" width="800px">
    <div class="editDialogBody">
      <el-form :label-position="labelPosition" label-width="200px" :model="temp" ref="form" :rules="rules">
        <el-row :gutter="16">

          <el-col :sm="12" :md="8">
            <el-form-item label="預約日期" prop="date">
              <el-date-picker style="width: 100%" v-model="temp.date" type="date" placeholder="選擇日期" value-format="yyyy-MM-dd" :picker-options="{
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  },
                }">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="預約時間" prop="time">
              <el-time-select style="width: 100%" v-model="temp.time" :picker-options="{
                  start: timeStartTime,
                  step: '00:10',
                  end: '20:00',
                }" placeholder="選擇時間">
              </el-time-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="是否共乘">
              <el-switch active-text="願意共乘" inactive-text="不共乘" v-model="temp.canShared"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="車輛類型" prop="carCategoryId">
              <el-select @change="carCategoryChange" style="width: 100%" v-model="temp.carCategoryId" placeholder="選擇車輛類型">
                <el-option v-for="type in carCategorysList" :key="type.id" :label="type.label" :value="type.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="輪椅類型" prop="wheelchairType">
              <el-select style="width: 100%" v-model="temp.wheelchairType" placeholder="選擇輪椅類型">
                <el-option v-if="temp.carCategoryId === 'SYS_CAR_GENERAL'" value="無" label="無">無</el-option>
                <el-option v-if="temp.carCategoryId === 'SYS_CAR_GENERAL'" value="普通輪椅(可收折)" label="普通輪椅(可收折)">普通輪椅(可收折)</el-option>
                <el-option v-if="temp.carCategoryId === 'SYS_CAR_WEAL'" value="普通輪椅" label="普通輪椅">普通輪椅</el-option>
                <el-option value="高背輪椅" label="高背輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">高背輪椅</el-option>
                <el-option value="電動輪椅" label="電動輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">電動輪椅</el-option>
                <el-option value="電動高背輪椅" label="電動高背輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">電動高背輪椅</el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="聯絡電話" prop="noticePhone">
              <el-input style="width: 100%" v-model="temp.noticePhone" placeholder="輸入聯絡電話">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="搭乘人數">
              <el-select style="width: 100%" v-model="temp.passengerNum" placeholder="選擇搭乘人數">
                <el-option v-for="num in 8" :key="num" :label="num" :value="num">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <template v-if="passengerArr">
            <el-col class="passengerContainer" :sm="4" :md="24" v-for="item in passengerArr" :key="item.key">
              <el-row :gutter="16">
                <el-col :sm="4" :md="6" :offset="3">
                  <el-form-item label="姓名" required>
                    <el-input style="width: 100%" v-model="item.name" placeholder="輸入姓名">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="4" :md="6">
                  <el-form-item label="生日" required>
                    <el-date-picker style="width: 100%" v-model="item.birth" type="date" placeholder="選擇生日" value-format="yyyy-MM-dd" :picker-options="{
                              disabledDate(time) {
                                return time.getTime() > Date.now();
                              },
                            }">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :sm="4" :md="6">
                  <el-form-item label="聯絡電話">
                    <el-input style="width: 100%" v-model="item.phone" placeholder="輸入聯絡電話">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </template>

          <el-col :sm="12" :md="18">
            <el-form-item label="起點" prop="fromAddr">
              <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodFrom" @change="handleChange('from')" @visible-change="handleVisibleChangeFrom" ref="atc" :trigger-on-focus="false" v-model="temp.fromAddr" placeholder="請輸入起點" style="width: 100%">
                <el-option v-for="item in searchResultsFrom" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="4" :md="3">
            <el-form-item label="起點經度">
              <el-input style="width: 100%" v-model="temp.fromLon" placeholder="輸入起點經度">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="4" :md="3">
            <el-form-item label="起點緯度">
              <el-input style="width: 100%" v-model="temp.fromLat" placeholder="輸入起點緯度">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="18">
            <el-form-item label="迄點" prop="toAddr">
              <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodTo" @change="handleChange('to')" @visible-change="handleVisibleChangeTo" ref="atc" :trigger-on-focus="false" v-model="temp.toAddr" placeholder="請輸入迄點" style="width: 100%">
                <el-option v-for="item in searchResultsTo" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="4" :md="3">
            <el-form-item label="訖點經度">
              <el-input style="width: 100%" v-model="temp.toLon" placeholder="輸入訖點經度">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="4" :md="3">
            <el-form-item label="訖點緯度">
              <el-input style="width: 100%" v-model="temp.toLat" placeholder="輸入訖點緯度">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialog = false">取 消</el-button>
      <el-button type="primary" @click="handleEdit()">確 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from "moment";

import acMixins from "@/mixins/autoComplete.js";
export default {
  name: "editSelfPayUserDespatchDialog",
  mixins: [acMixins],
  props: {
    /* main data */
    tempObj: {
      type: Object,
      default: () => {},
      required: true,
    },

    /* toggle */
    editDialogProp: {
      type: Boolean,
      default: false,
      required: true,
    },

    /* labelPosition */
    labelPosition: {
      type: String,
      default: "top",
      required: false,
    },

    /* carCategorysList */
    carCategorysList: {
      type: Array,
      default: () => {},
      required: true,
    },

    /* passengerArr */
    passengerArr: {
      type: Array,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      temp: {},
      editDialog: false,
      today: moment().format("yyyy-MM-DD"),
      /* 地點詳情 */
      fromAddr: "", //起點詳細地址
      toAddr: "", //迄點詳細地址
      rules: {
        date: [{ required: true, message: "必填欄位", tigger: "change" }],
        time: [{ required: true, message: "必填欄位", tigger: "change" }],
        carCategoryId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        noticePhone: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        // name: [{ required: true, message: "必填欄位", tigger: "change" }],
        // birth: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        toAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        required: [{ required: true, message: "必填欄位", tigger: "change" }],
        caseUserNo: [{ required: true, message: "必填欄位", tigger: "blur" }],
        orgAId: [{ required: true, message: "必填欄位", tigger: "change" }],
      },
    };
  },
  computed: {
    timeStartTime() {
      let time;
      if (this.temp.date !== this.today) {
        time = "06:00";
      } else {
        let nowHr = moment().format("HH");
        let nowMin =
          (Math.floor(moment().format("hh:mm").split(":")[1] / 10) + 1) * 10;

        if (nowMin == 60) {
          nowMin = "00";
          nowHr++;
        }

        time = `${nowHr}:${nowMin}`;
      }
      return time;
    },
  },
  watch: {
    editDialogProp() {
      this.editDialog = this.editDialogProp;
    },
    tempObj() {
      this.temp = this.tempObj;
    },
  },
  methods: {
    /* 編輯 */
    handleEdit() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (vm.validatePassenger(vm.passengerArr)) {
            vm.temp.fromAddr = vm.fromAddr ? vm.fromAddr : vm.temp.fromAddr;
            vm.temp.toAddr = vm.toAddr ? vm.toAddr : vm.temp.toAddr;
            vm.$emit("handleEdit", vm.temp);
            // this.$emit("handleEdit");
          } else {
            vm.$alertM.fire({
              icon: "error",
              title: "請檢查搭乘資料是否確實填寫",
            });
          }
        } else {
          vm.$alertT.fire({
            icon: "error",
            title: "請確認欄位是否正確填寫",
          });
        }
      });
    },

    /* 關閉 */
    handleClose() {
      this.$emit("handleClose", false);
    },

    /* 變更車輛類型 */
    carCategoryChange() {
      this.$emit("carCategoryChange");
    },

    /* 驗證搭乘人員資料 */
    validatePassenger(data) {
      return data
        .map((passenger) => {
          return [
            () => {
              return passenger.name != "";
            },
            () => {
              return passenger.birth != "" && passenger.birth != null;
            },
          ].every((fun) => fun());
        })
        .every((bol) => bol);
    },
  },
  mounted() {},
};
</script>

<style>
</style>