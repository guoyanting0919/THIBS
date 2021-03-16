<template>
  <div class="flex-column allUserDetail">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" type="success">列印</el-button>
        <el-button size="mini" type="info">回列表</el-button>
        <!-- <el-button size="mini" type="success">編輯個案</el-button> -->
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="檢視個案基本資料"></Title>

      <!-- 基本資料 -->
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="基本資料編輯"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <div class="detailLabel">個案照片</div>
              <div class="userPicBox">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">個案編號</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">性別</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">姓名</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">生日</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">身分證字號</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">社會福利身份</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">手機</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">市話</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">個案身份</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">額度控管留用首月</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="24" :md="12">
              <div class="detailLabel">管理單位</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">失能等級</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">綁定手機</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">啟用日期</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">失效日期</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">可否派發</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="18">
              <div class="detailLabel">不可派發原因</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>

            <el-col :sm="24" :md="24">
              <div class="detailLabel">居住地</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>

            <el-col :sm="18" :md="18">
              <div class="detailLabel">輪住地址</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="3">
              <div class="detailLabel">經度</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="3">
              <div class="detailLabel">緯度</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
          </el-row>

          <SubTitle title="緊急聯絡人資訊"></SubTitle>
          <el-row :gutter="24">
            <el-col :sm="12" :md="6">
              <div class="detailLabel">聯絡人姓名</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">關係</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">聯絡人手機</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">聯絡人市話</div>
              <div class="detailValue">{{ temp.Id }}</div>
            </el-col>
          </el-row>

          <SubTitle title="備註"></SubTitle>
          <div class="detailValue">{{ temp.Id }}</div>
        </el-form>
      </div>

      <!-- 違規紀錄 -->
      <div class="formContainer bg-white" style="margin-top: 1rem">
        <div class="formTitle">
          <div style="margin-right: auto">個案違規紀錄</div>
          <div class="timeSelect">今天</div>
          <div class="timeSelect">近一週</div>
          <div class="timeSelect">近一個月</div>
          <div class="timeSelect">近三個月</div>
          <div class="timeSelect">自訂時間</div>
          <el-date-picker
            size="mini"
            v-model="temp.Id"
            type="daterange"
            range-separator="~"
            start-placeholder="開始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div class="bg-white" style="height: 500px">
          <el-table
            ref="mainTable"
            height="calc(100% - 52px)"
            :data="gridData"
            border
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              property="pic"
              label="照片"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              property="name"
              label="姓名"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              align="center"
            ></el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
          />
        </div>
      </div>

      <!-- 搭乘紀錄 -->
      <div class="formContainer bg-white" style="margin-top: 1rem">
        <div class="formTitle">
          <div style="margin-right: auto">個案搭乘紀錄</div>
          <div class="timeSelect">今天</div>
          <div class="timeSelect">近一週</div>
          <div class="timeSelect">近一個月</div>
          <div class="timeSelect">近三個月</div>
          <div class="timeSelect">自訂時間</div>
          <el-date-picker
            size="mini"
            v-model="temp.Id"
            type="daterange"
            range-separator="~"
            start-placeholder="開始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div class="bg-white" style="height: 500px">
          <el-table
            ref="mainTable"
            height="calc(100% - 52px)"
            :data="gridData"
            border
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              property="pic"
              label="照片"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              property="name"
              label="姓名"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              property="code"
              label="個案編號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              property="uid"
              label="身分證字號"
              width="140"
              align="center"
            ></el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import Pagination from "@/components/Pagination";
import SubTitle from "@/components/SubTitle";
export default {
  name: "allUserDetail",
  components: {
    Sticky,
    Title,
    Pagination,
    SubTitle,
  },
  data() {
    return {
      // 表單相關
      labelPosition: "top",
      temp: {
        Id: "123",
        cuty: "",
        lun: [
          {
            value1: "",
            value2: "",
            value3: "",
            value4: "",
            value5: "",
          },
        ],
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
      total: 200,
      listQuery: {
        page: 20,
        limit: 20,
      },
      multipleSelection: [],
      gridData: [
        {
          lock: 1,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A203******",
          birth: "1954-07-18",
          sex: 0,
          phone: "0921079303",
          tel: "0921079303",
          status: 1,
          setting: "功能按鈕",
        },
        {
          lock: 1,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A203******",
          birth: "1954-07-18",
          sex: 0,
          phone: "0921079303",
          tel: "0921079303",
          status: 0,
          setting: "功能按鈕",
        },
        {
          lock: 0,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A203******",
          birth: "1954-07-18",
          sex: 1,
          phone: "0921079303",
          tel: "0921079303",
          status: 1,
          setting: "功能按鈕",
        },
      ],
    };
  },
  methods: {
    addLun() {
      this.temp.lun.push({
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        key: Date.now(),
      });
    },
    delLun(item) {
      let index = this.temp.lun.indexOf(item);
      if (index !== -1) {
        this.temp.lun.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.formTitle {
  font-size: 18px;
  color: $--color-primary;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1rem;
  // transform: translateX(-8px);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid $--color-primary;
  display: flex;

  .timeSelect {
    margin-right: 1rem;
    font-size: 16px;
    padding: 0px 16px;
    border: 1px solid $--color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.detailLabel {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.detailValue {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px dashed $--color-primary;
  margin-bottom: 1rem;
}
.userPicBox {
  height: 200px;
  margin: auto;
  width: 200px;
  margin-top: 1rem;
  background: rgb(221, 221, 221);
}
</style>
