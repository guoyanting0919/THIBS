<template>
  <el-dialog title="編輯訂單" @closed="temp.passengerNum = 0" @close="handleClose()" :visible.sync="editDialog" width="800px">
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
            <el-form-item label="搭乘人數">
              <el-select style="width: 100%" v-model="temp.passengerNum" placeholder="選擇搭乘人數">
                <el-option v-for="num in 8" :key="num" :label="num" :value="num">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="選擇路線" prop="stationLineId">
              <el-select style="width: 100%" v-model="temp.stationLineId" placeholder="選擇路線" @change="handleLineChange()">
                <el-option v-for="type in lineList" :key="type.id" :label="type.name" :value="type.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="選擇起點站牌" prop="fromStationId">
              <el-select :disabled="temp.stationLineId == ''" style="width: 100%" v-model="temp.fromStationId" placeholder="選擇路線" @change="handleFromChange">
                <el-option v-for="(type, idx) in lineStop" :key="type.id" :label="`${idx + 1}.${type.stationName}`" :value="type.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="選擇終點站牌" prop="toStationId">
              <el-select :disabled="temp.fromStationId == ''" style="width: 100%" v-model="temp.toStationId" placeholder="選擇路線">
                <el-option :disabled="type.disabled" v-for="(type, idx) in toLineStop" :key="type.id" :label="`${idx + 1}.${type.stationName}`" :value="type.id">
                </el-option>
              </el-select>
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
export default {
  name: "editBusUserDespatchDialog",
  props: {
    /* main data */
    temp: {
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

    /* lineList */
    lineList: {
      type: Array,
      default: () => {},
      required: true,
    },

    /* stopList */
    stopList: {
      type: Array,
      default: () => {},
      required: true,
    },

    /* lineStop */
    lineStop: {
      type: Array,
      default: () => {},
      required: true,
    },

    /* toLineStop */
    toLineStop: {
      type: Array,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      editDialog: false,
      today: moment().format("yyyy-MM-DD"),
      rules: {
        date: [{ required: true, message: "必填欄位", tigger: "change" }],
        time: [{ required: true, message: "必填欄位", tigger: "change" }],
        stationLineId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        fromStationId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        toStationId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
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
        this.$cl(nowHr);
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
  },
  methods: {
    /* 編輯 */
    handleEdit() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("handleEdit");
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

    /* 選擇路線 */
    handleLineChange() {
      const vm = this;
      vm.$emit("handleLineChange", vm.temp.stationLineId);
    },

    /* 選擇起點站 */
    handleFromChange() {
      const vm = this;
      vm.$emit("handleFromChange", vm.temp.fromStationId);
    },
  },
  mounted() {},
};
</script>

<style>
</style>