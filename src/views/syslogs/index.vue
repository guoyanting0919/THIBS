<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          size="mini"
          style="width: 200px;"
          class="filter-item"
          :placeholder="'名稱'"
          v-model="listQuery.key"
        ></el-input>

        <el-button
          class="filter-item"
          size="mini"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <permission-btn moduleName="sysLogs" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <div class="bg-white" style="height: 100%;">
        <el-table
          ref="mainTable"
          height="calc(100% - 52px)"
          :key="tableKey"
          :data="list"
          v-loading="listLoading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column min-width="150px" :label="'日誌內容'">
            <template slot-scope="scope">
              <span>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'日誌分類'">
            <template slot-scope="scope">
              <span>{{scope.row.typeName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'模塊'">
            <template slot-scope="scope">
              <span>{{scope.row.href}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="'操作人'">
            <template slot-scope="scope">
              <span>{{scope.row.createName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'操作結果'">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.result ==1">失敗</el-tag>
              <el-tag v-else>成功</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="'所屬應用'">
            <template slot-scope="scope">
              <span>{{scope.row.application}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'日誌時間'">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as sysLogs from "@/api/syslogs";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  name: "sysLog",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
  },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      multipleSelection: [], // 列表checkbox選中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查詢條件
        page: 1,
        limit: 20,
        key: undefined,
        appId: undefined,
      },
      temp: {
        id: "", // Id
        content: "", // 日誌內容
        typeName: "", // 分類名稱
        typeId: "", // 分類ID
        href: "", // 操作所屬模塊地址
        createTime: "", // 記錄時間
        createId: "", // 操作人ID
        createName: "", // 操作人
        ip: "", // 操作機器的IP地址
        result: "", // 操作的結果：0：成功；1：失敗；
        application: "", // 所屬應用
        extendInfo: "", // 其他信息,防止最後加逗號，可以刪除
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        appId: [
          {
            required: true,
            message: "必須選擇一個應用",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "名稱不能為空",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  filters: {
    statusFilter(disable) {
      const statusMap = {
        false: "color-success",
        true: "color-danger",
      };
      return statusMap[disable];
    },
  },
  created() {
    this.getList();
  },
  methods: {
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked: function (domId) {
      console.log("you click:" + domId);
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              message: "至少刪除一個",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      sysLogs.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleModifyStatus(row, disable) {
      // 模擬修改狀態
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.disable = disable;
    },
    resetTemp() {
      this.temp = {
        id: "",
        content: "",
        typeName: "",
        typeId: "",
        href: "",
        createTime: "",
        createId: "",
        createName: "",
        ip: "",
        result: "",
        application: "",
        extendInfo: "",
      };
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
