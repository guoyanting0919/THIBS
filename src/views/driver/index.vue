<template>
  <div class="flex-column driver">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" v-model="value" clearable placeholder="請輸入關鍵字"></el-input>
        <el-select size="mini" @change="end = end + 200" v-model="value" clearable placeholder="可否派發" style="margin-right: 0.5rem">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <!-- 公司選擇 -->
        <el-select size="mini" v-model="value" clearable placeholder="請選擇公司">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="司機資料"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" v-loading="listLoading" v-if="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>

          <el-table-column property="account" label="帳號" min-width="140" align="center">
            <template slot-scope="scope">
              {{ scope.row.account | hideFilter }}
            </template>
          </el-table-column>

          <el-table-column property="name" label="姓名" width="120" align="center"></el-table-column>

          <el-table-column property="uid" label="身分證字號" min-width="140" align="center">
            <template slot-scope="scope">
              {{ scope.row.uid | hideFilter }}
            </template>
          </el-table-column>

          <el-table-column property="phone" label="手機" width="250" align="center"></el-table-column>

          <el-table-column property="town" label="狀態" width="130" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.town}}</span>
            </template>
          </el-table-column>

          <el-table-column property="driverLicense" label="駕照種類" width="130" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.driverLicense}}</span>
            </template>
          </el-table-column>

          <el-table-column property="setting" label="操作" :fixed="isMobile()" width="220">
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

import * as drivers from "@/api/drivers";
export default {
  name: "driver",
  mixins: [pbMixins],
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
  },
  data() {
    return {
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      // main data
      list: [],
      listLoading: false,
      total: 200,
      listQuery: {
        page: 1,
        limit: 20,
      },
      multipleSelection: [], // 列表checkbox選中的值
    };
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

    // 獲取所有司機
    getList() {
      const vm = this;
      vm.listLoading = true;
      drivers.load(vm.listQuery).then((res) => {
        vm.list = res.data.map((d) => {
          // d.driverLicense = d.driverLicense.split(",");
          return d;
        });
        console.log(vm.list);
        vm.total = res.count;
        vm.listLoading = false;
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
        case "delete":
          if (this.multipleSelection.length !== 0) {
            this.handleDeleteDrivers(this.multipleSelection);
          }
          break;
        case "add":
          this.$router.push("/driver/add/1");
          break;
        default:
          break;
      }
    },
    handleDetail(driver) {
      this.$router.push(`/driver/check/${driver.id}`);
    },
    handleEdit(driver) {
      console.log(driver);
      this.$router.push(`/driver/edit/${driver.id}`);
    },
    handleDeleteDrivers(driver) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除已選取司機?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = driver.map((c) => c.id);
          drivers.deleteDriver(ids).then((res) => {
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
    handleDelete(driver) {
      console.log(driver);
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除司機 ${driver.userName} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = [driver.id];
          console.log(ids);
          drivers.deleteDriver(ids).then((res) => {
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
  },
};
</script>

<style></style>
