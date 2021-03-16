<template>
  <div class="flex-column {{ $頁面ID }}">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" clearable placeholder="請輸入關鍵字"></el-input>
        <permission-btn size="mini" moduleName="modulemanager" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="{{ $pageTitle }}"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table ref="mainTable" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column min-width="80px" :label="'名稱'">
            <template slot-scope="scope">
              <span>\{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column property="setting" label="操作" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="handleEdit(scope.row)" v-if="hasButton('edit')">編輯</el-button>
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
import * as {{ $apiName }} from "@/api/{{ $apiName }}";

export default {
  name: "{{ $頁面ID }}",
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
      const vm = this
      {{ $apiName }}.load(vm.listQuery).then(res=>{
        vm.$cl(res)
        vm.list = res.result
      })
    },

    /* 新增資料 */
    handleAdd(){},

    /* 編輯資料 */
    handleUpdate(){},

    /* 刪除資料 */
    handleDelete(){},

    /* 獲取單筆資料 */
    handleGet(){},

    /* 權限按鈕中控 */
    onBtnClicked(domId) {
      this.$cl(domId);
      switch (domId) {
        case 'add':
          this.handleAdd()
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