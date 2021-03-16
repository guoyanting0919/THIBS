<template>
  <el-dialog @close="handleClose()" title="編輯訂單" :visible.sync="editDialog" width="800px">
    <div id="map" ref="map" style="width: 0%; height: 0%"></div>
    <div class="editDialogBody">
      <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
        <el-row :gutter="16">

          <el-col :sm="12" :md="8">
            <el-form-item label="聯絡電話" prop="noticePhone">
              <el-input :disabled="tempObj.status > 2" style="width: 100%" v-model="temp.noticePhone">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="車種" prop="carCategoryId">
              <el-select :disabled="tempObj.status > 2" style="width: 100%" v-model="temp.carCategoryId" placeholder="選擇車種" @change="temp.wheelchairType = ''">
                <el-option v-for="type in carCategorysList" :key="type.id" :label="type.label" :value="type.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="輪椅" prop="wheelchairType">
              <el-select :disabled="tempObj.status > 2" clearable v-model="temp.wheelchairType" placeholder="請選擇輪椅" style="width: 100%">
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
            <el-form-item label="願意共乘">
              <el-radio-group :disabled="tempObj.status > 2" v-model="temp.canShared">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="乘車日期" prop="date">
              <el-date-picker :disabled="tempObj.status > 2" v-model="temp.date" type="date" placeholder="請選擇乘車日期" value-format="yyyy-MM-dd" style="width: 100%" :picker-options="{
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  },
                }"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="乘車時間" prop="time">
              <el-time-select :disabled="tempObj.status > 2" v-model="temp.time" :picker-options="{
                  start: timeStartTime,
                  step: '00:10',
                  end: '20:00',
                }" placeholder="請選擇乘車時間" style="width: 100%">
              </el-time-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="8">
            <el-form-item label="陪同人數" prop="familyWith">
              <el-select :disabled="tempObj.status > 2" style="width: 100%" v-model="temp.familyWith" placeholder="選擇陪同人數">
                <el-option v-for="num in 8" :key="num" :label="num - 1" :value="num - 1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="18">
            <el-form-item label="起點" prop="fromAddr">
              <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodFrom" @change="handleChange('from')" @visible-change="handleVisibleChangeFrom" ref="atc" :trigger-on-focus="false" v-model="temp.fromAddr" placeholder="請輸入起點" style="width: 100%">
                <el-option v-for="item in searchResultsFrom" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="24" :md="6">
            <el-form-item label="起點備註" prop="fromAddrRemark">
              <el-select clearable v-model="temp.fromAddrRemark" placeholder="請選擇備註" style="width: 100%">
                <el-option value="醫院診所" label="醫院診所">醫院診所</el-option>
                <el-option value="洗腎中心" label="洗腎中心">洗腎中心</el-option>
                <el-option value="復健診所" label="復健診所">復健診所</el-option>
                <el-option value="住家" label="住家">住家</el-option>
                <el-option value="其他" label="其他">其他</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="!['醫院診所','洗腎中心','復健診所','住家',''].includes(temp.fromAddrRemark)" :sm="24" :md="24">
            <el-form-item label="起點備註-其他">
              <el-input v-model="temp.fromRemark" placeholder="請輸入起點備註"></el-input>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :md="18">
            <el-form-item label="迄點" prop="toAddr">
              <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodTo" @change="handleChange('to')" @visible-change="handleVisibleChangeTo" ref="atc" :trigger-on-focus="false" v-model="temp.toAddr" placeholder="請輸入迄點" style="width: 100%">
                <el-option v-for="item in searchResultsTo" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="6">
            <el-form-item label="訖點備註" prop="toAddrRemark">
              <el-select clearable v-model="temp.toAddrRemark" placeholder="請選擇備註" style="width: 100%">
                <el-option value="醫院診所" label="醫院診所">醫院診所</el-option>
                <el-option value="洗腎中心" label="洗腎中心">洗腎中心</el-option>
                <el-option value="復健診所" label="復健診所">復健診所</el-option>
                <el-option value="住家" label="住家">住家</el-option>
                <el-option value="其他" label="其他">其他</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="!['醫院診所','洗腎中心','復健診所','住家',''].includes(temp.toAddrRemark)" :sm="24" :md="24">
            <el-form-item label="訖點備註-其他">
              <el-input v-model="temp.toRemark" placeholder="請輸入訖點備註"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleEdit">確 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import acMixins from "@/mixins/autoComplete.js";

import moment from "moment";
export default {
  name: "editCaseUserDespatchDialog",
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
  },
  data() {
    return {
      editDialog: false,
      temp: {},
      today: moment().format("yyyy-MM-DD"),
      /* 地點詳情 */
      fromAddr: "", //起點詳細地址
      toAddr: "", //迄點詳細地址

      rules: {
        date: [{ required: true, message: "必填欄位", tigger: "change" }],
        time: [{ required: true, message: "必填欄位", tigger: "change" }],
        createdIdentity: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        fromAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromAddrRemark: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        toAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        toAddrRemark: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        carCategoryId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        wheelchairType: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        familyWith: [{ required: true, message: "必填欄位" }],
        noticePhone: [{ required: true, message: "必填欄位", tigger: "blur" }],
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
        vm.temp.fromAddr = vm.fromAddr ? vm.fromAddr : vm.temp.fromAddr;
        vm.temp.toAddr = vm.toAddr ? vm.toAddr : vm.temp.toAddr;
        if (valid) {
          this.$emit("handleEdit", vm.temp);
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
  },
  mounted() {
    console.log(this.tempObj);
  },
};
</script>

<style>
</style>