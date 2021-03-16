<template>
  <div class="flex-column userInfo">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" clearable placeholder="請輸入關鍵字"></el-input>
        <permission-btn size="mini" moduleName="modulemanager" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="乘客資訊"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" v-if="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
          <el-table-column property="name" label="姓名" width="120" align="center"></el-table-column>

          <el-table-column min-width="80" property="sex" :label="'性別'" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sex == 1 ? '男' : '女' }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="130" property="isLowIncome" :label="'是否為低收入戶'" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.isLowIncome == 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>

          <el-table-column property="birthday" label="生日" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.birthday | globalDateFilter("yyyy-MM-DD")}}</span>
            </template>
          </el-table-column>

          <el-table-column property="phone" label="手機號碼" min-width="140" align="center"></el-table-column>
          <el-table-column property="userType" label="身份" width="120" align="center"></el-table-column>
          <el-table-column property="town" label="鄉鎮" width="120" align="center"></el-table-column>
          <el-table-column property="village" label="村里" width="120" align="center"></el-table-column>

          <el-table-column property="setting" label="操作" fixed='right' width="150">
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

/* components */
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";

/* API */
import * as userInfo from "@/api/userInfo";

export default {
  name: "userInfo",
  mixins: [pbMixins],
  components: { Sticky, Title, permissionBtn, Pagination },
  data() {
    return {
      /* 權限按鈕 */
      buttons: [],
      multipleSelection: [],
      list: [{ name: "aaaa" }], // 菜單列表
      total: 10,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
      },
      temp: {
        id: "",
        newsTypeId: "",
        newsTypeName: "",
        releaseDate: "2020-12-16T07:31:15.488Z",
        title: "",
        contents: "",
        attachedFile: "",
        sort: 999,
      },
    };
  },
  methods: {
    /* 獲取主要資料 */
    getList() {
      const vm = this;
      userInfo.load(vm.listQuery).then((res) => {
        vm.$cl(res);
        vm.list = res.data;
      });
    },

    /* 新增資料 */
    handleAdd() {},

    /* 編輯資料 */
    handleUpdate() {},

    /* 刪除資料 */
    handleDelete() {},

    /* 獲取單筆資料 */
    handleEdit(userInfo) {
      console.log(userInfo);
      this.$router.push(`/userInfo/edit/${userInfo.id}`);
    },

    /* 權限按鈕中控 */
    onBtnClicked(domId) {
      this.$cl(domId);
      switch (domId) {
        case "add":
          this.$router.push("/userinfo/add/1");
          break;

        default:
          break;
      }
    },
    rowClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
  },
  mounted() {
    this.getButtons();
    this.getList();
  },
};
</script>

<style lang='scss' scoped>
</style>