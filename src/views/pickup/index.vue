<template>
  <div class="flex-column pickup">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 用戶身份選擇 -->
        <!-- <el-select size="mini" @change="end = end + 200" v-model="value" clearable placeholder="請選擇用戶身份">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->

        <!-- 服務單位選擇 -->
        <el-select v-if="orgList" size="mini" @change="getList" v-model="listQuery.OrgId" clearable placeholder="請選擇服務單位">
          <el-option :label="'全部單位'" :value="''"></el-option>
          <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id"></el-option>
        </el-select>

        <!-- 日期選擇 -->
        <el-date-picker value-format="yyyy-MM-dd" size="mini" v-model="dateRange" type="daterange" start-placeholder="開始日期" end-placeholder="结束日期" @change="getList"></el-date-picker>

        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 接送數據 -->
      <div class="chartContainer">
        <Title title="接送數據"></Title>
        <div class="cardContainer" v-if="list">
          <div class="dataCard">
            <i class="iconfont icon-chart"></i>
            <p>總趟次</p>
            <count-to class="card-panel-num" :startVal="0" :endVal="list.totalTrip" :duration="2000"></count-to>
          </div>

          <div class="dataCard">
            <i class="iconfont icon-success"></i>
            <p>已完成(共乘)</p>
            <count-to class="card-panel-num" :startVal="0" :endVal="list.carpoolCompleteTrip" :duration="2000"></count-to>
          </div>

          <div class="dataCard">
            <i class="iconfont icon-success"></i>
            <p>已完成(非共乘)</p>
            <count-to class="card-panel-num" :startVal="0" :endVal="list.completeTrip" :duration="2000"></count-to>
          </div>

          <div class="dataCard">
            <i class="iconfont icon-Frame1304"></i>
            <p>空趟</p>
            <count-to class="card-panel-num" :startVal="0" :endVal="list.noSeatTrip" :duration="2000"></count-to>
          </div>

          <div class="dataCard">
            <i class="iconfont icon-InfoCircle"></i>
            <p>未執行</p>
            <count-to class="card-panel-num" :startVal="0" :endVal="list.unExecutionTrip" :duration="2000"></count-to>
          </div>

          <div class="dataCard">
            <i class="iconfont icon-Star"></i>
            <p>達成率</p>
            <div>
              <count-to class="card-panel-num card-panel-num-num" :startVal="0" :endVal="list.completeRate" :duration="2000"></count-to>
              <span class="card-panel-num card-panel-num-persent">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 本週接送 -->
      <!-- <div class="weeklyContainer">
        <Title title="本周接送狀況"></Title>
        <ve-line class="chartMargin" :data="chartData"></ve-line>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import CountTo from "vue-count-to";
import permissionBtn from "@/components/PermissionBtn";

import * as orgs from "@/api/login";
import * as report from "@/api/report";
export default {
  name: "todaypickup",
  components: {
    Sticky,
    CountTo,
    Title,
    permissionBtn,
  },
  data() {
    return {
      /* 組織列表 */
      orgList: [],

      /* 接送數據列表 */
      list: "",
      listQuery: {
        StartDate: null,
        EndDate: null,
        OrgId: "",
        Sex: null,
      },
      dateRange: [],
    };
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
  },
  methods: {
    /* 獲取接送數據 */
    getList() {
      this.listQuery.StartDate = this.dateRange[0];
      this.listQuery.EndDate = this.dateRange[1];
      report.getPickUp(this.listQuery).then((res) => {
        this.list = res.result;
      });
    },

    /* 獲取用戶組織 */
    getOrg() {
      orgs.getOrgs().then((res) => {
        this.orgList = res.result;
      });
    },

    /* 匯出報表 */
    handleExpoort() {
      const vm = this;
      let { StartDate, EndDate, OrgId } = vm.listQuery;
      StartDate = moment(StartDate).format("yyyy-MM-DD");
      EndDate = moment(EndDate).format("yyyy-MM-DD");
      const nowTime = Date.parse(new Date());
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", //// 回應類型為 blob
      };
      config.headers["X-Token"] = getToken();
      axios
        .get(
          `${process.env.VUE_APP_BASE_API}Reports/ExportPickReportByCaseOrgA?StartDate=${StartDate}&EndDate=${EndDate}&OrgId=${OrgId}`,
          config
        )
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/" + res.headers["content-type"],
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); // 創建下載的鏈接
          downloadElement.href = href;
          downloadElement.download = `接送數據${nowTime}.xlsx`; // 下載後文件名
          // 此寫法兼容可火狐瀏覽器
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 點擊下載
          document.body.removeChild(downloadElement); // 下載完成移除元素
          window.URL.revokeObjectURL(href); // 釋放掉 blob 對象
        })
        .catch(() => {
          vm.$alertM.fire({
            icon: "error",
            title: "下載失敗",
          });
        });
    },

    /* 權限按鈕 */
    onBtnClicked(domId) {
      const vm = this;
      switch (domId) {
        case "export":
          vm.$swal({
            title: "匯出提示",
            text: `匯出資料將與搜尋結果相同`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#227294",
            cancelButtonColor: "#d63737",
            confirmButtonText: "確認匯出",
            cancelButtonText: "取消匯出",
          }).then((result) => {
            if (result.value) {
              vm.handleExpoort();
            } else {
              vm.$alertT.fire({
                icon: "info",
                title: "已取消匯出",
              });
            }
          });
          break;
        case "search":
          this.getList();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$set(this.dateRange, 0, moment().format("yyyy-MM-DD"));
    this.$set(this.dateRange, 1, moment().format("yyyy-MM-DD"));
    this.getList();
    this.getOrg();
  },
};
</script>
 
<style lang="scss" scoped>
.cardContainer {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.dataCard {
  background: #fff;
  width: 200px;
  height: 250px;
  margin: 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 2px;

  p {
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.5rem;
    color: #444141;
  }
}

.iconfont {
  font-size: 4rem;
  font-weight: 700;
  color: $--color-primary;
}

.card-panel-num {
  font-weight: 600;
  font-size: 2rem;
  color: $--color-primary;
}

.card-panel-num-num {
  display: inline-block;
  transform: translate(0.25rem);
}

.card-panel-num-persent {
  font-size: 1.25rem;
  transform: translate(0.25rem);
  display: inline-block;
}
</style>
