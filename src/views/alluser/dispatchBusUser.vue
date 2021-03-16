<template>
  <div class="flex-column dispatchBusUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleReservation" type="primary" plain>預約</el-button>
        <el-button size="mini" @click="handleBack" type="success" plain>回列表</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="幸福巴士預約"></Title>
      <div class="dispatchContainer bg-white">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
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
                <el-select :disabled="temp.stationLineId == ''" style="width: 100%" v-model="temp.fromStationId" placeholder="選擇站牌" @change="handleFromChange">
                  <el-option v-for="(type, idx) in lineStop" :key="type.id" :label="`${idx + 1}.${type.stationName}`" :value="type.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="選擇終點站牌" prop="toStationId">
                <el-select :disabled="temp.fromStationId == ''" style="width: 100%" v-model="temp.toStationId" placeholder="選擇站牌">
                  <el-option :disabled="type.disabled" v-for="(type, idx) in toLineStop" :key="type.id" :label="`${idx + 1}.${type.stationName}`" :value="type.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";

import * as orderBusUser from "@/api/orderBusUser";
import * as busStationLines from "@/api/busStationLines";
import * as busStations from "@/api/busStations";
export default {
  name: "dispatchBusUser",
  components: {
    Sticky,
    Title,
  },
  data() {
    return {
      /* 今天日期 */
      today: "",

      /* 路線 */
      lineList: [],

      /* 所有站牌 */
      stopList: [],

      /* 起點站牌 */
      lineStop: [],
      //終點站牌
      toLineStop: [],

      /* 表單相關 */
      labelPosition: "top",
      passengerArr: [],
      passengerNum: 1,
      temp: {
        date: "",
        time: "",

        id: "",
        busUserId: "",
        userId: "",
        orgId: "",
        reserveDate: "",
        stationLineId: "",
        stationLineName: "",
        fromStationId: "",
        fromStationName: "",
        toStationId: "",
        toStationName: "",
        passengerNum: 1,
        remark: "",
      },
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

  methods: {
    /* 獲取巴士路線資料 */
    getLineList() {
      const vm = this;
      let query = {
        page: 1,
        limit: 99,
        key: undefined,
      };
      busStationLines.load(query).then((res) => {
        res.data.forEach((r) => {
          r.weekArr = r.workWeek?.split(",");
          r.weekArr.sort();
        });
        vm.lineList = res.data;
      });
    },

    /* 獲取巴士站牌資料 */
    getStopList() {
      const vm = this;
      let query = {
        page: 1,
        limit: 999,
        key: undefined,
      };
      busStations.load(query).then((res) => {
        vm.stopList = res.data;
      });
    },

    /* 回列表 */
    handleBack() {
      this.$router.go(-1);
    },

    /* 選擇路線 */
    handleLineChange() {
      const vm = this;
      vm.lineStop = [];
      vm.temp.fromStationId = "";
      vm.temp.toStationId = "";
      busStationLines.get({ id: vm.temp.stationLineId }).then((res) => {
        vm.stopList.forEach((s) => {
          if (res.result.assignLineStations.includes(s.id)) {
            s.disabled = false;
            vm.lineStop.push(s);
          }
        });
      });
    },

    /* 選擇起點站 */
    handleFromChange() {
      const vm = this;
      vm.temp.toStationId = "";
      let fromId = vm.temp.fromStationId;
      let idFlag;
      vm.lineStop.forEach((s, idx) => {
        idFlag = s.id == fromId ? idx : idFlag;
      });
      let cloneObj = Object.assign([], vm.lineStop);
      cloneObj.map((obj, index) => {
        obj.disabled = index <= idFlag;
      });
      vm.toLineStop = cloneObj;
    },

    /* 預約訂單 */
    handleReservation() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this;
          let date = moment(vm.temp.date).format("yyyy-MM-DD");
          vm.temp.busUserId = vm.$route.params.id.split("-")[1];
          vm.temp.userId = vm.$route.params.id.split("-")[0];
          vm.temp.reserveDate = `${date} ${vm.temp.time}`;
          vm.temp.stationLineName = vm.lineList.filter((l) => {
            return l.id === vm.temp.stationLineId;
          })[0].name;
          vm.temp.fromStationName = vm.lineStop.filter((s) => {
            return s.id === vm.temp.fromStationId;
          })[0].stationName;
          vm.temp.toStationName = vm.toLineStop.filter((s) => {
            return s.id === vm.temp.toStationId;
          })[0].stationName;
          vm.temp.orgId = vm.lineList.filter((item) => {
            return item.id === vm.temp.stationLineId;
          })[0].orgId;
          console.log(vm.temp.orgId);

          orderBusUser.add(vm.temp).then((res) => {
            vm.$alertT.fire({
              icon: "success",
              title: res.message,
            });
            this.$router.go(-1);
          });
        }
      });
    },

    /* 若有query 有 orderId */
    getOrder() {
      const vm = this;
      if (this.$route.query.orderId) {
        orderBusUser.get({ id: this.$route.query.orderId }).then((res) => {
          this.temp = res.result;
          busStationLines.get({ id: vm.temp.stationLineId }).then((res) => {
            vm.stopList.forEach((s) => {
              if (res.result.assignLineStations.includes(s.id)) {
                s.disabled = false;
                vm.lineStop.push(s);
              }
            });

            let fromId = vm.temp.fromStationId;
            let idFlag;
            vm.lineStop.forEach((s, idx) => {
              idFlag = s.id == fromId ? idx : idFlag;
            });
            let cloneObj = Object.assign([], vm.lineStop);
            cloneObj.map((obj, index) => {
              obj.disabled = index <= idFlag;
            });
            vm.toLineStop = cloneObj;
          });
        });
      }
    },
  },
  mounted() {
    this.today = moment().format("yyyy-MM-DD");
    this.getLineList();
    this.getStopList();
    this.getOrder();
  },
};
</script>

<style lang="scss" scoped>
.dispatchContainer {
  padding: 24px;
  padding-top: 12px;
}
.name {
  line-height: 20px;
  font-weight: 700;
}
.addr {
  font-size: 10px;
}
.passengerContainer {
  background: rgb(255, 244, 230);
}
</style>