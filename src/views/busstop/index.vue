<template>
  <div class="flex-column busStop">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" v-model="value" clearable placeholder="請輸入關鍵字"></el-input>
        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 站牌管理 -->
      <Title title="站牌管理"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" border fit v-loading="listLoading" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column property="createDate" label="建立日期" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column property="stationName" label="站牌名稱(中文)" width="200" align="center"></el-table-column>
          <el-table-column property="stationCode" label="站牌名稱(英文)" align="center"></el-table-column>
          <el-table-column property="lon" label="經度" align="center"></el-table-column>
          <el-table-column property="lat" label="緯度" align="center"></el-table-column>

          <el-table-column property="setting" label="操作" fixed="right" width="166">
            <template slot-scope="scope">
              <div class="buttonFlexBox">
                <el-button size="mini" @click="handleEdit(scope.row)" type="success" v-if="hasButton('edit')">編輯</el-button>
                <el-button size="mini" @click="handleDelete(scope.row)" type="danger" v-if="hasButton('delete')">刪除</el-button>
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column property="address" label="地址"></el-table-column> -->
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import pbMixins from "@/mixins/permissionBtn.js";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";

import * as busStations from "@/api/busStations";

export default {
  name: "busStop",
  mixins: [pbMixins],
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
  },
  directives: {
    elDragDialog,
  },
  data() {
    return {
      value: "",
      // 表格相關
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
      },

      multipleSelection: [], // 列表checkbox選中的值
    };
  },
  filters: {
    dateFilter(date) {
      let res = moment(date).format("YYYY-MM-DD");
      return res;
    },
  },
  methods: {
    // 獲取巴士站牌資料
    getList() {
      const vm = this;
      vm.listLoading = true;
      busStations.load(vm.listQuery).then((res) => {
        console.log(res.data);
        vm.list = res.data;
        vm.total = res.count;
        vm.listLoading = false;
      });
    },

    // 編輯
    handleEdit(stop) {
      this.$router.push(`/busstop/edit/${stop.id}`);
    },
    // 刪除
    handleDelete(stop) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除 ${stop.stationName} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          busStations.remove([stop.id]).then((res) => {
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
    // 批量刪除
    handleDeleteStops() {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除已選擇的站牌?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = vm.multipleSelection.map((s) => s.id);
          busStations.remove(ids).then((res) => {
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
    // 換頁
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    onBtnClicked(domId) {
      switch (domId) {
        case "add":
          this.$router.push("/busstop/add/newBusStop");
          break;
        case "delete":
          this.handleDeleteStops();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style></style>
