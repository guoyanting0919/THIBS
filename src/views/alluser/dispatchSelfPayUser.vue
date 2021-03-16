<template>
  <div class="flex-column dispatchSelfPay">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleReservation" type="primary" v-if="$route.path.split('/')[2] !== 'edit'" plain>預約</el-button>
        <el-button size="mini" @click="handleReservation" type="primary" v-if="$route.path.split('/')[2] == 'edit'" plain>編輯</el-button>
        <el-button size="mini" @click="handleBack" type="success" plain>回列表</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="預約"></Title>
      <!-- 預約表單 -->
      <el-row :gutter="16" style="display: flex; flex-wrap: wrap">
        <el-col :sm="0" :md="0" style="align-items: stretch">
          <div id="map" ref="map" style="width: 100%; height: 100%; min-height: 500px"></div>
        </el-col>
        <el-col :sm="24" :md="24">
          <div class="dispatchContainer bg-white">
            <SubTitle title="預約表單"></SubTitle>
            <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
              <el-row :gutter="16">
                <el-col :sm="12" :md="6">
                  <el-form-item label="乘客姓名" prop="name">
                    <el-input v-model="temp.name" placeholder="請輸入乘客姓名"></el-input>
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
                    <el-date-picker style="width: 100%" v-model="temp.reserveDate" type="date" placeholder="選擇日期" value-format="yyyy-MM-dd" :picker-options="{
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

                <el-col :xs="24" :md="16">
                  <el-form-item label="上車地點" prop="fromAddr">
                    <el-input @change="handleAddrChange('from')" style="width: 100%" v-model="temp.fromAddr" placeholder="輸入上車地點"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="4">
                  <el-form-item label="上車地點經度" prop="fromLng">
                    <el-input style="width: 100%" v-model="temp.fromLng" placeholder="輸入上車地點經度"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="4">
                  <el-form-item label="上車地點緯度" prop="fromLat">
                    <el-input style="width: 100%" v-model="temp.fromLat" placeholder="輸入上車地點緯度"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :md="16">
                  <el-form-item label="下車地點" prop="toAddr">
                    <el-input @change="handleAddrChange('to')" style="width: 100%" v-model="temp.toAddr" placeholder="輸入下車地點"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="4">
                  <el-form-item label="下車地點經度" prop="toLng">
                    <el-input style="width: 100%" v-model="temp.toLng" placeholder="輸入下車地點經度"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="12" :sm="12" :md="4">
                  <el-form-item label="下車地點緯度" prop="toLat">
                    <el-input style="width: 100%" v-model="temp.toLat" placeholder="輸入下車地點緯度"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

// import acMixins from "@/mixins/autoComplete.js";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";

import * as orderSelfPayUser from "@/api/orderSelfPayUser";
import * as map from "@/api/map";
export default {
  name: "dispatchSelfPay",
  // mixins: [acMixins],
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      /* 今天日期 */
      today: "",
      /* 權限按鈕 */
      buttons: [],
      /* 用戶資料 */
      userInfo: "",

      // 表單相關
      labelPosition: "top",
      temp: {
        // thiId: 0,
        name: "",
        town: "",
        village: "",
        userType: "",
        reserveDate: "",
        fromTime: "",
        fromAddr: "",
        fromLng: "",
        fromLat: "",
        toTime: "",
        toAddr: "",
        toLng: "",
        toLat: "",
        hasTransfer: "是",
        transferTraffic: "",
        transferOperator: "",
        transferPurpose: "",
      },

      /* 表單驗證 */
      rules: {
        reserveDate: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        name: [{ required: true, message: "必填欄位", tigger: "change" }],
        town: [{ required: true, message: "必填欄位", tigger: "change" }],
        village: [{ required: true, message: "必填欄位", tigger: "change" }],
        userType: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromTime: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromLng: [{ required: true, message: "必填欄位" }],
        fromLat: [{ required: true, message: "必填欄位" }],
        toAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        toLng: [{ required: true, message: "必填欄位" }],
        toLat: [{ required: true, message: "必填欄位" }],
        transferTraffic: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        transferOperator: [
          { required: true, message: "必填欄位", tigger: "blur" },
        ],
        transferPurpose: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
      },
    };
  },

  computed: {
    ...mapGetters(["defaultorgid"]),
    timeStartTime() {
      let time;
      if (this.temp.reserveDate !== this.today) {
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
    /* 獲取本路由下所有功能按鈕 */
    getButtons() {
      this.$route.meta.elements.forEach((el) => {
        this.buttons.push(el.domId);
      });
    },

    /* 是否擁有按鈕功能權限 */
    hasButton(domId) {
      return this.buttons.includes(domId);
    },

    /* 預約訂單 */
    handleReservation() {
      let fun = this.$route.path.split("/")[2] === "edit" ? "update" : "add";
      console.log(fun);
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          console.log("success");
          orderSelfPayUser[fun](vm.temp).then((res) => {
            console.log(res);
            this.$router.push("/orderselfpayuser/index");
          });
        }
      });
    },

    /* 地址變更 */
    handleAddrChange(dir) {
      console.log(dir);
      map.geocode({ _addr: this.temp.fromAddr }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.temp[`${dir}Lng`] = res.result.lon;
          this.temp[`${dir}Lat`] = res.result.lat;
        } else {
          this.temp[`${dir}Lng`] = "";
          this.temp[`${dir}Lat`] = "";
        }
      });
    },

    /* 若有params */
    getOrder() {
      if (this.$route.path.split("/")[2] === "edit") {
        orderSelfPayUser.get({ id: this.$route?.params?.id }).then((res) => {
          console.log(res);
          this.temp = JSON.parse(JSON.stringify(res.result));
          console.log(this.temp);
        });
      }
    },
    /* 回列表 */
    handleBack() {
      this.$router.go(-1);
    },
  },
  async mounted() {
    this.today = moment().format("yyyy-MM-DD");
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