<template>
  <div class="flex-column revenueReport">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">

        <!-- 區域選擇 -->
        <!-- <el-select size="mini" v-model="value" clearable placeholder="請選擇區域">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->

        <!-- 服務單位選擇 -->
        <el-select v-if="orgList" size="mini" @change="getList" v-model="listQuery.OrgId" clearable placeholder="請選擇服務單位">
          <el-option :label="'全部單位'" :value="''"></el-option>
          <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id"></el-option>
        </el-select>

        <!-- 社會福利身份選擇 -->
        <el-select size="mini" @change="getList" v-model="listQuery.WealTypeId" placeholder="社會福利身份">
          <el-option :value="''" :label="'所有社會福利身份'">所有社會福利身份</el-option>
          <el-option :value="'1'" :label="'低收入戶'">低收入戶</el-option>
          <el-option :value="'2'" :label="'中低收入戶'">中低收入戶</el-option>
          <el-option :value="'3'" :label="'一般戶'">一般戶</el-option>
        </el-select>

        <!-- 日期選擇 -->
        <el-date-picker value-format="yyyy-MM-dd" size="mini" v-model="dateRange" type="daterange" start-placeholder="開始日期" end-placeholder="结束日期" @change="getList"></el-date-picker>

        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 營收報表 -->
      <div class="reportContainer">
        <Title title="營收報表"></Title>
        <ve-bar height="300px" :data="chartData"></ve-bar>
      </div>

      <!-- 車輛使用率 -->
      <!-- <div class="carContainer">
        <Title title="車輛使用率"></Title>
        <div class="carBoxies">
          <div class="carBox" v-for="item in 5" :key="item">
            <p>NAM-03</p>
            <p>豐均國際租賃有限公司</p>
            <ve-ring class="carChart" :data="chartData2" :settings="chartSettings2"></ve-ring>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { getToken } from "@/utils/auth";

import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Title from "@/components/ConsoleTableTitle";

import * as orgs from "@/api/login";
import * as report from "@/api/report";
export default {
  name: "carUse",
  components: {
    Sticky,
    Title,
    permissionBtn,
  },
  data() {
    return {
      /* 組織列表 */
      orgList: [],

      /* 列表 */
      list: "",
      listQuery: {
        StartDate: null,
        EndDate: null,
        OrgId: "",
        WealTypeId: "",
      },
      dateRange: [],

      chartSettings: {
        metrics: ["金額"],
        dimension: ["key"],
      },

      chartData: {
        columns: ["key", "金額"],
        rows: [
          { key: "總營收", 金額: 0 },
          { key: "個案負擔", 金額: 0 },
          { key: "陪同金額", 金額: 0 },
          { key: "政府補助", 金額: 0 },
        ],
      },

      chartSettings2: {
        radius: [40, 80],
        offsetY: 120,
        dimension: "key",
        metrics: "value",
      },

      chartData2: {
        columns: ["key", "value"],
        rows: [
          { key: "個案負擔", value: 30 },
          { key: "政府補助", value: 70 },
          { key: "總營收", value: 70 },
        ],
      },
    };
  },
  methods: {
    /* 獲取接送數據 */
    getList() {
      this.listQuery.StartDate = this.dateRange[0];
      this.listQuery.EndDate = this.dateRange[1];
      report.getRevenue(this.listQuery).then((res) => {
        console.log(res);
        this.list = res.result;

        this.chartData.rows.forEach((r) => {
          switch (r.key) {
            case "總營收":
              r.金額 = res.result.totalAmt;
              break;
            case "個案負擔":
              r.金額 = res.result.selfPayAmt;
              break;
            case "陪同金額":
              r.金額 = res.result.withAmt;
              break;
            case "政府補助":
              r.金額 = res.result.discountAmt;
              break;

            default:
              break;
          }
        });
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
      let { StartDate, EndDate, OrgId, WealTypeId } = vm.listQuery;
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
          `${process.env.VUE_APP_BASE_API}Reports/ExportRevenueReportByCaseOrgA?StartDate=${StartDate}&EndDate=${EndDate}&OrgId=${OrgId}&WealTypeId=${WealTypeId}`,
          config
        )
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/" + res.headers["content-type"],
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); // 創建下載的鏈接
          downloadElement.href = href;
          downloadElement.download = `營收報表${nowTime}.xlsx`; // 下載後文件名
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

<style lang="scss"></style>
