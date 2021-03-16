<template>
  <div class="flex-column car">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->

        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="車輛資料"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" v-if="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>

          <el-table-column property="status" label="車輛狀態" width="120" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status=='Y' ? '可派發' : '不可派發'}}</span>
            </template>
          </el-table-column>
          <el-table-column property="township" label="鄉鎮" width="120" align="center"></el-table-column>
          <el-table-column property="carNo" label="車牌號碼" min-width="140" align="center"></el-table-column>
          <el-table-column property="brand" label="廠牌" width="120" align="center"></el-table-column>
          <el-table-column property="carCategoryName" label="車輛類型" width="170" align="center"></el-table-column>
          <el-table-column property="carType" label="型式" min-width="170" align="center"></el-table-column>
          <el-table-column property="seatNum" label="載客人數" min-width="170" align="center"></el-table-column>

          <el-table-column property="carOwner" label="車輛產權" min-width="170" align="center"></el-table-column>
          <el-table-column property="releaseDate" label="發照日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.releaseDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="displacement" label="排氣量" min-width="170" align="center"></el-table-column>
          <el-table-column property="makeDate" label="出廠日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.makeDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="insuranceNo" label="保險證號" min-width="170" align="center"></el-table-column>
          <el-table-column property="insuranceItem" label="投保項目與金額" min-width="170" align="center"></el-table-column>
          <el-table-column property="checkDate" label="檢驗合格日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.checkDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="nextCheckDate" label="下次檢定日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.nextCheckDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="maintainDate" label="上次保養日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.maintainDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="nextMaintainDate" label="下次定保日期" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.nextMaintainDate | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>
          <el-table-column property="maintainItems" label="定期保養項目" min-width="170" align="center"></el-table-column>

          <el-table-column property="setting" label="操作" :fixed="isMobile()" width="150">
            <template slot-scope="scope">
              <div class="buttonFlexBox">
                <el-button size="mini" type="warning" @click="handleEdit(scope.row)" v-if="hasButton('edit')">編輯</el-button>
                <el-button size="mini" type="success" @click="handleDetail(scope.row)" v-if="hasButton('check')">檢視</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-if="hasButton('delete')">刪除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import pbMixins from "@/mixins/permissionBtn.js";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";

import * as cars from "@/api/cars";
import * as drivers from "@/api/drivers";
export default {
  name: "car",
  mixins: [pbMixins],
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
  },
  data() {
    return {
      // 司機列表
      driverList: [],
      // main data
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        OrgId: "",
      },
      multipleSelection: [], // 列表checkbox選中的值
    };
  },
  filters: {
    driverFilter(id, driverList) {
      // const vm = this;
      let arr = driverList?.filter((category) => {
        return category.id === id;
      });
      return arr[0]?.userName;
    },
  },
  methods: {
    // 是否為移動端
    isMobile() {
      const vm = this;
      if (vm.$store.state.app.device === "mobile") {
        return null;
      } else {
        return "right";
      }
    },
    // 獲取所有車輛
    getList() {
      const vm = this;
      vm.listLoading = true;
      cars.load(vm.listQuery).then((res) => {
        vm.list = res.data;
        vm.total = res.count;
        vm.listLoading = false;
      });
    },
    //獲取所有司機
    getDrivers() {
      const vm = this;
      let query = {
        page: 1,
        limit: 999,
      };
      drivers.load(query).then((res) => {
        console.log(res);
        vm.driverList = res.data;
      });
    },

    // table 功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    // 換頁
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },

    // 主要功能按鈕
    onBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "add":
          this.$router.push("/car/add/1");
          break;
        case "delete":
          if (this.multipleSelection.length !== 0) {
            this.handleDeleteCars(this.multipleSelection);
          }
          break;
        default:
          break;
      }
    },
    handleDetail(car) {
      this.$router.push(`/car/check/${car.id}`);
    },
    handleEdit(car) {
      console.log(car);
      this.$router.push(`/car/edit/${car.id}`);
    },
    handleDeleteCars(car) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除已選取車輛?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = car.map((c) => c.id);
          cars.deleteCar(ids).then((res) => {
            vm.$alertT.fire({
              icon: "success",
              title: res.message,
            });
            vm.getList();
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
    handleDelete(car) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除車輛 車牌號碼：${car.carNo} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = [car.id];
          console.log(ids);
          cars.deleteCar(ids).then((res) => {
            vm.$alertT.fire({
              icon: "success",
              title: res.message,
            });
            vm.getList();
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
  },
  mounted() {
    this.getList();
    // this.getDrivers();
  },
};
</script>

<style></style>
