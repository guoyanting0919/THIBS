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
      <Title title="路線管理"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" border fit v-loading="listLoading" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column property="createDate" label="建立日期" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column property="name" label="路線名稱(中文)" width="180" align="center"></el-table-column>
          <el-table-column property="lineCode" label="路線名稱(英文)" align="center" width="180"></el-table-column>
          <el-table-column property="workWeek" label="行駛日" align="center">
            <template slot-scope="scope">
              <span v-for="(day, index) in scope.row.weekArr" :key="index">
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '0'">星期日</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '1'">星期一</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '2'">星期二</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '3'">星期三</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '4'">星期四</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '5'">星期五</el-tag>
                <el-tag style="margin-right: 8px" size="mini" v-if="day == '6'">星期六</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column property="sort" label="排序" width="80" align="center"></el-table-column>

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

import * as busStationLines from "@/api/busStationLines";

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
      checkedWeek: [],
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
      busStationLines.load(vm.listQuery).then((res) => {
        console.log(res.data);
        res.data.forEach((r) => {
          r.weekArr = r.workWeek?.split(",");
          r.weekArr?.sort();
        });

        // res.data
        vm.list = res.data;
        vm.total = res.count;
        vm.listLoading = false;
      });
    },

    // 編輯
    handleEdit(route) {
      this.$router.push(`/busroute/edit/${route.id}`);
    },
    // 刪除
    handleDelete(route) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除 ${route.name} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          busStationLines.remove([route.id]).then((res) => {
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
        text: `確認刪除已選擇的路線?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = vm.multipleSelection.map((s) => s.id);
          busStationLines.remove(ids).then((res) => {
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
          this.$router.push("/busroute/add/newBusStop");
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
