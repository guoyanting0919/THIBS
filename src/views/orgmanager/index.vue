<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" prefix-icon="el-icon-search" size="small" style="width: 200px; margin-bottom: 0" class="filter-item" :placeholder="'關鍵字'" v-model="listQuery.key"></el-input>

        <permission-btn moduleName="orgmanager" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
        <el-checkbox size="mini" style="margin-left: 15px" @change="tableKey = tableKey + 1" v-model="showDescription">Id/描述</el-checkbox>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="單位管理"></Title>
      <el-row style="height: calc(100% - 50px)">
        <el-col :span="4" style="height: 100%; border: 1px solid #ebeef5">
          <el-card shadow="never" class="body-small" style="height: 100%; overflow: auto">
            <div slot="header" class="clearfix">
              <el-button type="text" style="padding: 0 11px" @click="getAllOrgs">所有單位>></el-button>
            </div>

            <el-tree :data="orgsTree" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-card>
        </el-col>
        <el-col :span="20" style="height: 100%">
          <div class="bg-white" style="height: 100%">
            <el-table ref="mainTable" :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange">
              <el-table-column type="selection" align="center" width="55"></el-table-column>

              <el-table-column :label="'Id'" v-if="showDescription" min-width="120px">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>

              <!-- <el-table-column min-width="80px" :label="'層級ID'">
                <template slot-scope="scope">
                  <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.cascadeId}}</span>
                </template>
              </el-table-column>-->

              <el-table-column min-width="400px" :label="'單位名稱'">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="150px" :label="'單位代碼'">
                <template slot-scope="scope">
                  <span>{{ scope.row.einno }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="150px" :label="'主要聯絡人'">
                <template slot-scope="scope">
                  <span>{{ scope.row.chargeName }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="150px" :label="'主要聯絡人市話'">
                <template slot-scope="scope">
                  <span>{{ scope.row.chargeTel }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="150px" :label="'主要聯絡人手機'">
                <template slot-scope="scope">
                  <span>{{ scope.row.chargePhone }}</span>
                </template>
              </el-table-column>

              <!-- <el-table-column width="120px" :label="'上級部門'">
                <template slot-scope="scope">
                  <span>{{scope.row.parentName}}</span>
                </template>
              </el-table-column>-->

              <el-table-column class-name="status-col" :label="'狀態'" width="100">
                <template slot-scope="scope">
                  <span :class="scope.row.status | statusFilter">
                    {{
                      statusOptions.find((u) => u.key == scope.row.status)
                        .display_name
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" align="center" :label="'操作'" width="150" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!-- <div class="buttonFlexBox">
                    <el-tooltip
                      effect="dark"
                      content="編輯"
                      placement="top"
                      :open-delay="500"
                    >
                      <div
                        class="editIcon"
                        @click="handleUpdate(scope.row)"
                        v-if="hasButton('btnEdit')"
                      >
                        <i class="iconfont icon-edit"></i>
                      </div>
                    </el-tooltip>

                    <el-tooltip
                      effect="dark"
                      content="停用"
                      placement="top"
                      :open-delay="500"
                    >
                      <div
                        v-show="!scope.row.status"
                        class="status0Icon"
                        @click="handleChangeStatus(scope.row, 1)"
                        v-if="hasButton('btnEdit')"
                      >
                        <i class="iconfont icon-Vector2"></i>
                      </div>
                    </el-tooltip>

                    <el-tooltip
                      effect="dark"
                      content="啟用"
                      placement="top"
                      :open-delay="500"
                    >
                      <div
                        v-show="scope.row.status"
                        class="status1Icon"
                        @click="handleChangeStatus(scope.row, 0)"
                        v-if="hasButton('btnEdit')"
                      >
                        <i class="iconfont icon-Vector11"></i>
                      </div>
                    </el-tooltip>
                  </div> -->
                  <el-button type="info" size="mini" @click="handleUpdate(scope.row)">編輯</el-button>
                  <el-button v-if="scope.row.status == 0" size="mini" type="danger" @click="handleModifyStatus(scope.row, 1)">停用</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
          </div>
        </el-col>
      </el-row>

      <el-dialog v-el-drag-dialog class="dialog-mini" width="700px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="top" label-width="auto">
          <el-row :gutter="10">
            <!-- <el-form-item
              size="small"
              :label="'Id'"
              prop="id"
              v-show="dialogStatus == 'update'"
            >
              <span>{{ temp.id }}</span>
            </el-form-item>

            <el-form-item
              size="small"
              :label="'層級ID'"
              v-show="dialogStatus == 'update'"
            >
              <span>{{ temp.cascadeId }}</span>
            </el-form-item>-->

            <el-col :span="24">
              <el-form-item size="small" :label="'單位名稱'" prop="name">
                <el-input v-model="temp.name" :disabled="dialogStatus == 'update'"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'單位代碼'" prop="einno">
                <el-input v-model="temp.einno" :disabled="dialogStatus == 'update'"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'主要聯絡人'" prop="chargeName">
                <el-input v-model="temp.chargeName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'主要聯絡人市話'">
                <el-input v-model="temp.chargeTel"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'主要聯絡人手機'" prop="chargePhone">
                <el-input v-model="temp.chargePhone"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'主要聯絡信箱'" prop="chargeMail">
                <el-input v-model="temp.chargeMail"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'信箱通知'">
                <el-select class="filter-item" v-model="temp.noticeMail" placeholder="Please select">
                  <el-option :label="'關閉'" :value="false"></el-option>
                  <el-option :label="'開起'" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'狀態'">
                <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
                  <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item size="small" :label="'上級組織'">
                <treeselect ref="orgsTree" :options="mechOrgsTree" :default-expand-level="3" :multiple="false" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="selectOrgs"></treeselect>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" type="primary" @click="createData">確認</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">確認</el-button>
        </div>
      </el-dialog>
      <!-- 添加角色用戶 -->
      <el-dialog class="dialog-mini user-dialog" v-el-drag-dialog :title="'權限設定'" :visible.sync="roleUsers.dialogUserResource">
        <selectUsersCom ref="selectUser" v-if="roleUsers.dialogUserResource" :orgId="multipleSelection[0].id" :hiddenFooter="true" :loginKey="'loginUser'" :selectUsers.sync="
            roleUsers.rowIndex > -1 && roleUsers.list[roleUsers.rowIndex]
          "></selectUsersCom>
        <div style="text-align: right" slot="footer">
          <el-button size="small" type="cancel" @click="roleUsers.dialogUserResource = false">取消</el-button>
          <el-button size="small" type="primary" @click="handleSaveUsers">確定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listToTreeSelect } from "@/utils";
import * as orgs from "@/api/orgs";
import * as apiUsers from "@/api/users";
import * as login from "@/api/login";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import Title from "@/components/ConsoleTableTitle";
import selectUsersCom from "@/components/SelectUsersCom";

export default {
  name: "org",
  components: {
    Sticky,
    permissionBtn,
    Treeselect,
    Pagination,
    selectUsersCom,
    Title,
  },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      buttons: [],
      defaultProps: {
        // tree配置項
        children: "children",
        label: "label",
      },
      multipleSelection: [], // 列表checkbox選中的值
      tableKey: 0,
      list: null,
      subLists: [],
      total: 0,
      currentOrgId: "",
      listLoading: true,
      listQuery: {
        // 查詢條件
        page: 1,
        limit: 20,
        orgId: "",
        key: undefined,
      },
      apps: [],
      statusOptions: [
        {
          key: 1,
          display_name: "停用",
        },
        {
          key: 0,
          display_name: "啟用",
        },
      ],
      showDescription: false,
      orgs: [], // 用戶可訪問到的組織列表
      orgsTree: [], // 用戶可訪問到的所有機構組成的樹
      temp: {
        id: undefined,
        cascadeId: "",
        parentName: "",
        parentId: null,
        name: "",
        status: 0,
        chargeName: "", //主要聯絡人
        chargePhone: "", //主要聯絡人手機
        chargeTel: "", //主要聯絡人電話
        chargeMail: "", //主要聯絡信箱
        noticeMail: true, //主要聯絡信箱
        einno: "", //統一編號
      },
      dialogFormVisible: false,
      chkRoot: false, // 根節點是否選中
      treeDisabled: true, // 樹選擇框時候可用
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "新增",
      },
      rules: {
        name: [
          {
            required: true,
            message: "名稱不能為空",
            trigger: "blur",
          },
        ],
        chargeName: [
          {
            required: true,
            message: "主要聯絡人名稱不能為空",
            trigger: "blur",
          },
        ],
        chargeTel: [
          {
            required: true,
            message: "主要聯絡人市話不能為空",
            trigger: "blur",
          },
        ],
        einno: [
          {
            required: true,
            message: "統一編號不能為空",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
      selectOrgs: "",
      roleUsers: {
        dialogUserResource: false,
        Texts: "",
        rowIndex: -1,
        selectUsers: [],
        list: [],
      },
    };
  },
  watch: {
    selectOrgs() {
      if (
        this.selectOrgs === undefined ||
        this.selectOrgs === null ||
        this.selectOrgs === ""
      ) {
        // 如果是根節點
        this.temp.parentName = "根節點";
        this.temp.parentId = "";
        this.isRoot = true;
        return;
      }
      this.isRoot = false;
      this.temp.parentId = this.selectOrgs;
      var parentname = this.orgs.find((val) => {
        return this.selectOrgs === val.id;
      }).label;
      this.temp.parentName = parentname;
    },
  },
  computed: {
    mechOrgsTree() {
      const arr = [
        {
          id: "",
          label: "根節點",
          parentId: null,
        },
      ];
      return arr.concat(this.orgsTree);
    },
    isRoot: {
      get() {
        return this.chkRoot;
      },
      set(v) {
        this.chkRoot = v;
        if (v) {
          this.temp.parentName = "根節點";
          this.temp.parentId = "";
        }
        this.treeDisabled = v;
      },
    },
  },
  filters: {
    statusFilter(status) {
      var res = "color-success";
      switch (status) {
        case 1:
          res = "color-danger";
          break;
        default:
          break;
      }
      return res;
    },
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getOrgTree();
    this.getButtons();
  },
  methods: {
    // 獲取本路由下所有功能按鈕
    getButtons() {
      this.$route.meta.elements.forEach((el) => {
        this.buttons.push(el.domId);
      });
    },

    // 是否擁有按鈕功能權限
    hasButton(domId) {
      return this.buttons.includes(domId);
    },

    handleChangeStatus(row, status) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.status = status;
      console.log(this.temp);
      const tempData = Object.assign({}, this.temp);
      orgs.update(tempData).then(() => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000,
        });

        this.getOrgTree();
        this.getList();
      });
    },
    loadRoleUsers() {
      var _this = this;
      this.isLoading = true;
      apiUsers
        .LoadByOrg({
          page: 1,
          limit: 99999,
          orgId: _this.multipleSelection[0].id,
        })
        .then((response) => {
          this.roleUsers.dialogUserResource = true;
          _this.roleUsers.list[this.roleUsers.rowIndex] = response.data || [];
        });
    },
    handleSaveUsers() {
      this.$refs.selectUser.handleSaveUsers();
      const arr = this.roleUsers.list[this.roleUsers.rowIndex];
      const postData = {
        orgId: this.multipleSelection[0].id,
        userIds: (arr.length > 0 && arr.map((item) => item.id)) || [],
      };
      orgs.AssignOrgUsers(postData).then(() => {
        this.$message.success("添加成功");
        this.roleUsers.dialogUserResource = false;
      });
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleNodeClick(data) {
      this.currentOrgId = data.id;
      this.getList();
    },
    getAllOrgs() {
      this.currentOrgId = "";
      this.getList();
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
        case "btnAssignOrgUser":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.roleUsers.rowIndex = this.list.findIndex(
            (item) => item.id === this.multipleSelection[0].id
          );
          this.loadRoleUsers();
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
      login
        .getSubOrgs({
          orgId: this.currentOrgId,
          limit: this.listQuery.limit,
          page: this.listQuery.page,
          // key: this.listQuery.key,
        })
        .then((response) => {
          this.subLists = Object.assign([], response.data);
          this.total = response.count;
          this.listLoading = false;
          this.pageSubOrgs();
        });
    },
    pageSubOrgs() {
      this.list = this.subLists.slice(
        (this.listQuery.page - 1) * this.listQuery.limit,
        this.listQuery.page * this.listQuery.limit
      );
      this.roleUsers.selectUsers = this.list.map(() => {
        return { users: [], Texts: "" };
      });
    },
    getOrgTree() {
      var _this = this; // 記錄vuecomponent
      login.getOrgs().then((response) => {
        _this.orgs = response.result.map(function (item) {
          return {
            id: item.id,
            label: item.name,
            parentId: item.parentId || null,
          };
        });
        var orgstmp = JSON.parse(JSON.stringify(_this.orgs));
        _this.orgsTree = listToTreeSelect(orgstmp);
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
      this.pageSubOrgs();
    },
    handleModifyStatus(row, status) {
      // 模擬修改狀態
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        cascadeId: "",
        parentName: "根節點",
        parentId: "",
        name: "",
        status: 0,
      };
    },
    handleCreate() {
      // 彈出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.selectOrgs = "";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          orgs.add(this.temp).then((response) => {
            // 需要回填數據庫生成的數據
            this.temp.id = response.result.id;
            this.temp.cascadeId = response.result.cascadeId;
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "創建成功",
              type: "success",
              duration: 2000,
            });
            this.getOrgTree();
          });
        }
      });
    },
    handleUpdate(row) {
      // 彈出編輯框
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.einno = 1;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.selectOrgs = this.temp.parentId;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          orgs.update(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });

            this.getOrgTree();
            this.getList();
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行刪除
      orgs.del(rows.map((u) => u.id)).then(() => {
        this.$notify({
          title: "成功",
          message: "刪除成功",
          type: "success",
          duration: 2000,
        });
        this.getOrgTree();
        rows.forEach((row) => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.updateName {
  margin-left: 8px;
  border-bottom: 1px dashed #ffc691;
}

.buttonFlexBox {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}

.editIcon {
  width: 40px;
  height: 40px;
  border-radius: 200px;
  background: #3e79ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  i {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
}

.status0Icon {
  width: 40px;
  height: 40px;
  border-radius: 200px;
  background: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  i {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
}

.status1Icon {
  width: 40px;
  height: 40px;
  border-radius: 200px;
  background: #389e0d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  i {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-form {
  padding-right: 0 !important;
  padding-top: 0 !important ;
}

.el-form-item {
  margin-bottom: 18px !important;
}

.el-select.filter-item.el-select--small {
  width: 100%;
}
/deep/ .user-dialog {
  .el-dialog {
    height: 70%;
    .el-icon-close {
      padding-top: 10px;
    }
    .el-dialog__body {
      height: calc(100% - 35px - 40px);
    }
    .el-dialog__headerbtn {
      top: 0;
    }
  }
}
</style>
