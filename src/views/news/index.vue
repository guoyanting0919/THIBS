<template>
  <div class="flex-column colsedUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" v-model="value" clearable placeholder="請輸入關鍵字"></el-input>
        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 最新消息管理 -->
      <Title title="最新消息管理"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" border fit v-loading="listLoading" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column property="title" width="150" align="center" label="主旨"></el-table-column>
          <el-table-column property="createDate" label="創建日期" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column property="createUserName" label="創建人" width="200" align="center"></el-table-column>
          <el-table-column property="newsCategoryId" label="類別" width="150" align="center"></el-table-column>
          <el-table-column property="isTop" label="是否置頂" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.isTop ?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="createDate" label="發布日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.releaseDate | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column property="setting" label="操作" fixed="right" width="166">
            <template slot-scope="scope">
              <div class="buttonFlexBox">
                <el-button size="mini" @click="$router.push(`/news/edit/${scope.row.id}`)" type="success" v-if="hasButton('edit')">編輯</el-button>
                <el-button size="mini" @click="handleDelete(scope.row)" type="danger" v-if="hasButton('delete')">刪除</el-button>
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
import moment from "moment";

import pbMixins from "@/mixins/permissionBtn.js";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";

import * as news from "@/api/news";
export default {
  name: "news",
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
      // 表格相關
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        IsClient: false,
        key: undefined,
      },
      multipleSelection: [], // 列表checkbox選中的值

      value: "",
      value1: "",
      violationDialog: false,
    };
  },
  filters: {
    dateFilter(date) {
      let res = moment(date).format("YYYY-MM-DD");
      return res;
    },
  },
  methods: {
    // 獲取最新消息資料
    getList() {
      const vm = this;
      vm.listLoading = true;
      news.load(vm.listQuery).then((res) => {
        console.log(res.data);

        // res.data
        vm.list = res.data;
        vm.total = res.count;
        vm.listLoading = false;
      });
    },

    // 刪除
    handleDelete(item) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除 ${item.title} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          news.remove([item.id]).then((res) => {
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
    handleDeleteNews() {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除已選擇的最新消息?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = vm.multipleSelection.map((s) => s.id);
          news.remove(ids).then((res) => {
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
      //   console.log(domId);
      switch (domId) {
        case "add":
          this.$router.push("/news/add/addNews");
          break;
        case "edit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.$router.push(`/news/edit/${this.multipleSelection[0].id}`);
          break;
        case "delete":
          this.handleDeleteNews();
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
