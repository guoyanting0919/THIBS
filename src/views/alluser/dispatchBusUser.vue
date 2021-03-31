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
            <el-col :sm="12" :md="6">
              <el-form-item label="乘客姓名" prop="name">
                <el-select filterable v-model="temp.name" placeholder="請選擇乘客" style="width: 100%">
                  <el-option v-for="user in userList" :value="user.name" :label="user.name" :key='user.id'></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="鄉鎮" prop="town">
                <el-select v-model="temp.town" placeholder="請選擇鄉鎮" style="width: 100%">
                  <el-option :value="'SSTW'" :label="'尖石鄉'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="村里" prop="village">
                <el-input v-model="temp.village" placeholder="請輸入村里"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="身分" prop="userType">
                <el-select v-model="temp.userType" placeholder="請選擇身分" style="width: 100%">
                  <el-option :value="'一般'" :label="'一般'"></el-option>
                  <el-option :value="'學生'" :label="'學生'"></el-option>
                  <el-option :value="'年長者'" :label="'年長者'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="預約日期" prop="reserveDate">
                <el-date-picker @change="cleanRoute" style="width: 100%" v-model="temp.reserveDate" type="date" placeholder="選擇日期" value-format="yyyy-MM-dd" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < Date.now() - 8.64e7;
                        }, 
                      }">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="上車時間" prop="fromTime">
                <el-time-select :picker-options="{
                        start: timeStartTime,
                        step: '00:10',
                        end: '20:00',
                      }" style="width: 100%" v-model="temp.fromTime" placeholder="選擇時間">
                </el-time-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="是否轉乘">
                <el-select style="width: 100%" v-model="temp.hasTransfer" placeholder="是否轉乘">
                  <el-option value="是" label="是"></el-option>
                  <el-option value="否" label="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="轉乘運具" prop="transferTraffic">
                <el-select style="width: 100%" v-model="temp.transferTraffic" placeholder="選擇轉乘運具">
                  <el-option value="臺鐵" label="臺鐵"></el-option>
                  <el-option value="公車客運" label="公車客運"></el-option>
                  <el-option value="醫療專車" label="醫療專車"></el-option>
                  <el-option value="計程車" label="計程車"></el-option>
                  <el-option value="小黃公車" label="小黃公車"></el-option>
                  <el-option value="幸福巴士" label="幸福巴士"></el-option>
                  <el-option value="公所接駁巴士" label="公所接駁巴士"></el-option>
                  <el-option value="噗噗共乘" label="噗噗共乘"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="轉乘業者" prop="transferOperator">
                <el-select style="width: 100%" v-model="temp.transferOperator" placeholder="選擇轉乘業者">
                  <el-option value="尖石鄉DRTS" label="尖石鄉DRTS"></el-option>
                  <el-option value="尖石鄉基本民行" label="尖石鄉基本民行"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="12" :lg="8">
              <el-form-item label="轉乘目的" prop="transferPurpose">
                <el-select style="width: 100%" v-model="temp.transferPurpose" placeholder="選擇轉乘目的">
                  <el-option value="就醫" label="就醫"></el-option>
                  <el-option value="就學" label="就學"></el-option>
                  <el-option value="就養" label="就養"></el-option>
                  <el-option value="日常" label="日常"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="8">
              <el-form-item label="選擇路線" prop="stationLineId">
                <el-select style="width: 100%" v-model="temp.stationLineId" placeholder="選擇路線" @change="handleLineChange()">
                  <el-option v-for="type in lineList" :key="type.id" :label="type.name" :value="type.id" :disabled='type.disabled'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="選擇起點站牌" prop="fromAddr">
                <el-select :disabled="temp.stationLineId == ''" style="width: 100%" v-model="temp.fromAddr" placeholder="選擇站牌" @change="handleFromChange">
                  <el-option v-for="(type, idx) in lineStop" :key="type.id" :label="`${idx + 1}.${type.stationName}`" :value="type.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="選擇終點站牌" prop="toAddr">
                <el-select :disabled="temp.fromAddr == ''" style="width: 100%" v-model="temp.toAddr" placeholder="選擇站牌">
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
import * as userInfo from "@/api/userInfo";
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
      /* 用戶列表 */
      userList: "",
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
        id: "", // 編輯
        name: "",
        town: "",
        village: "",
        userType: "",
        stationType: "前山DRTS",
        reserveDate: "", //日期
        fromTime: "", //時間
        stationLineId: "", //路線名稱
        fromAddr: "", //上車站牌
        toAddr: "", //下車站牌
        hasTransfer: "", //是否轉乘
        transferTraffic: "", //轉乘運具
        transferOperator: "", //轉乘業者
        transferPurpose: "", //轉乘目的
      },
      rules: {
        date: [{ required: true, message: "必填欄位", tigger: "change" }],
        time: [{ required: true, message: "必填欄位", tigger: "change" }],
        stationLineId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        fromAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        toAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
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
    async getLineList() {
      const vm = this;
      let query = {
        page: 1,
        limit: 99,
        key: undefined,
      };
      await busStationLines.load(query).then((res) => {
        res.data.forEach((r) => {
          r.weekArr = r.workWeek?.split(",");
          r.weekArr.sort();
        });
        vm.lineList = res.data;
      });
    },

    /* 獲取巴士站牌資料 */
    async getStopList() {
      const vm = this;
      let query = {
        page: 1,
        limit: 999,
        key: undefined,
      };
      await busStations.load(query).then((res) => {
        vm.stopList = res.data;
      });
    },

    /* 獲取用戶列表 */
    getUsers() {
      userInfo.load({ limit: 9999 }).then((res) => {
        this.userList = res.data;
      });
    },

    /* 回列表 */
    handleBack() {
      this.$router.go(-1);
    },

    /* 選擇 / 修改日期後清空路線和站點 */
    cleanRoute(val) {
      const vm = this;
      console.log(val);
      console.log(moment(val).day(), vm.lineList);
      vm.lineList = vm.lineList.map((l) => {
        console.log(l.workWeek.split(","));
        l.disabled = !l.workWeek
          .split(",")
          .includes(moment(val).day().toString());
        return l;
      });
      console.log(vm.lineList);
      vm.temp.stationLineId = "";
      vm.temp.fromAddr = "";
      vm.temp.toAddr = "";
    },

    /* 選擇路線 */
    handleLineChange() {
      const vm = this;
      vm.lineStop = [];
      vm.temp.fromAddr = "";
      vm.temp.toAddr = "";
      busStationLines.get({ id: vm.temp.stationLineId }).then((res) => {
        console.log(res, vm.stopList);
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
      vm.temp.toAddr = "";
      let fromId = vm.temp.fromAddr;
      let idFlag;
      vm.lineStop.forEach((s, idx) => {
        idFlag = s.id == fromId ? idx : idFlag;
      });
      let cloneObj = Object.assign([], vm.lineStop);
      // cloneObj.map((obj, index) => {
      //   obj.disabled = index <= idFlag;
      // });
      vm.toLineStop = cloneObj;
    },

    /* 預約訂單 */
    handleReservation() {
      let fun = this.$route.path.split("/")[2] === "edit" ? "update" : "add";

      this.$refs.form.validate((valid) => {
        console.log(valid);
        if (valid) {
          const vm = this;

          vm.temp.stationLineId = vm.lineList.filter((l) => {
            return l.id === vm.temp.stationLineId;
          })[0].name;
          vm.temp.fromAddr = vm.lineStop.filter((s) => {
            return s.id === vm.temp.fromAddr;
          })[0].stationName;
          vm.temp.toAddr = vm.toLineStop.filter((s) => {
            return s.id === vm.temp.toAddr;
          })[0].stationName;

          console.log(vm.temp);

          orderBusUser[fun](vm.temp).then((res) => {
            console.log(res);
            vm.$alertT.fire({
              icon: res.code == 200 ? "success" : "error",
              title: res.message,
            });
            if (res.code == 200) this.$router.go(-1);
          });
        }
      });
    },

    /* 若有query 有 orderId */
    getOrder() {
      const vm = this;
      console.log(vm.$route.path.split("/")[2] === "edit");
      if (this.$route.path.split("/")[2] === "edit") {
        orderBusUser.get({ id: this.$route?.params?.id }).then((res) => {
          this.temp = JSON.parse(JSON.stringify(res.result));
          this.temp.stationType = "前山DRTS";
          vm.temp.stationLineId = vm.lineList.filter((l) => {
            return l.name === vm.temp.stationLineId;
          })[0].id;
          vm.temp.fromAddr = vm.stopList.filter((s) => {
            return s.stationName === vm.temp.fromAddr;
          })[0].id;
          vm.temp.toAddr = vm.stopList.filter((s) => {
            return s.stationName === vm.temp.toAddr;
          })[0].id;
          vm.temp.fromTime = vm.temp.fromTime?.split(" ")[1].slice(0, 5);
          busStationLines.get({ id: this.temp.stationLineId }).then((res2) => {
            vm.stopList.forEach((s) => {
              if (res2.result.assignLineStations.includes(s.id)) {
                s.disabled = false;
                vm.lineStop.push(s);
                vm.toLineStop.push(s);
              }
            });
          });
          console.log(this.temp);
        });
      }
    },
  },
  async mounted() {
    this.today = moment().format("yyyy-MM-DD");
    await this.getLineList();
    await this.getStopList();
    this.getUsers();
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