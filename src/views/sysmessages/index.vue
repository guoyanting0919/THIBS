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
        <permission-btn moduleName="sysMessages" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
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
          <el-table-column min-width="80px" :label="'消息分類'">
            <template slot-scope="scope">
              <span>{{scope.row.typeName}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="80px" :label="'發送人'">
            <template slot-scope="scope">
              <span>{{scope.row.fromName}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="80px" :label="'狀態'">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.toStatus ==0">未讀</el-tag>
              <el-tag v-if="scope.row.toStatus ==1">已讀</el-tag>
            </template>
          </el-table-column>
          <el-table-column min-width="80px" :label="'消息標題'">
            <template slot-scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="80px" :label="'消息內容'">
            <template slot-scope="scope">
              <span>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="80px" :label="'消息時間'">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="'操作'"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">標記已讀</el-button>
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
import * as sysMessages from "@/api/sysmessages";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  name: "sysMessage",
  components: { Sticky, permissionBtn, Pagination },
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
      statusOptions: [
        { key: true, display_name: "停用" },
        { key: false, display_name: "正常" },
      ],
      temp: {
        id: "", // Id
        typeName: "", // 分類名稱
        typeId: "", // 分類ID
        fromId: "", // 消息源頭
        toId: "", // 到達
        fromName: "", // 消息源頭名稱
        toName: "", // 消息到達名稱
        fromStatus: "", // -1:已刪除；0:默認
        toStatus: "", // -1:已刪除；0:默認未讀；1：已讀
        href: "", // 點擊消息跳轉的頁面等
        title: "", // 消息標題
        content: "", // 消息內容
        createTime: "", // 創建時間
        createId: "", // 創建人ID
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
          { required: true, message: "必須選擇一個應用", trigger: "change" },
        ],
        name: [{ required: true, message: "名稱不能為空", trigger: "blur" }],
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
      sysMessages.getList(this.listQuery).then((response) => {
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
        typeName: "",
        typeId: "",
        fromId: "",
        toId: "",
        fromName: "",
        toName: "",
        fromStatus: "",
        toStatus: "",
        href: "",
        title: "",
        content: "",
        createTime: "",
        createId: "",
        extendInfo: "",
      };
    },
    handleCreate() {
      // 彈出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          sysMessages.add(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "創建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      // 彈出編輯框
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          sysMessages.update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行刪除
      sysMessages.del(rows.map((u) => u.id)).then(() => {
        this.$notify({
          title: "成功",
          message: "刪除成功",
          type: "success",
          duration: 2000,
        });
        rows.forEach((row) => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
  },
};
</script>
<style>
.dialog-mini .el-select {
  width: 100%;
}
</style>
