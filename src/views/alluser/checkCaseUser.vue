<template>
  <div class="flex-column editCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="$router.go(-1)" type="success" plain>回列表</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="檢視長照個案資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" ref="form">
          <SubTitle title="基本資料"></SubTitle>
          <DisabledUserInfo :temp="basicTemp"></DisabledUserInfo>

          <SubTitle title="長照資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="個案編號" prop="caseUserNo">
                <el-input disabled v-model="temp.caseUserNo" placeholder="請輸入個案編號"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="社會福利身份" prop="wealTypeId">
                <span class="wealSpan" slot="label">社會福利身份 </span>
                <el-select disabled v-model="temp.wealTypeId" placeholder="社會福利身份" style="width: 100%">
                  <el-option :value="'1'" :label="'低收入戶'">低收入戶</el-option>
                  <el-option :value="'2'" :label="'中低收入戶'">中低收入戶</el-option>
                  <el-option :value="'3'" :label="'一般戶'">一般戶</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="額度控管留用首月" prop="reviewDate">
                <el-date-picker disabled v-model="temp.reviewDate" type="month" style="width: 100%" value-format="yyyy-MM" placeholder="請選擇額度控管留用首月"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="失能等級" prop="disabilityLevel">
                <el-select disabled v-model="temp.disabilityLevel" placeholder="請選擇失能等級" style="width: 100%">
                  <el-option :value="'0'" :label="'1級(無失能)'">1級(無失能)</el-option>
                  <el-option :value="'1'" :label="'2級'">2級</el-option>
                  <el-option :value="'2'" :label="'3級'">3級</el-option>
                  <el-option :value="'3'" :label="'4級'">4級</el-option>
                  <el-option :value="'4'" :label="'5級'">5級</el-option>
                  <el-option :value="'5'" :label="'6級'">6級</el-option>
                  <el-option :value="'6'" :label="'7級'">7級</el-option>
                  <el-option :value="'7'" :label="'8級'">8級</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="A單位" prop="orgAId">
                <el-select disabled v-model="temp.orgAId" placeholder="請選擇A單位" style="width: 100%">
                  <el-option v-for="org in unitAs" :key="org.id" :value="org.id" :label="org.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="其他聯絡電話">
                <el-input placeholder="其他聯絡電話" v-model="temp.otherPhone" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="24">
              <el-form-item label="居住地">
                <el-row :gutter="16">
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item prop="county">
                      <el-select disabled v-model="temp.county" clearable placeholder="請選擇居住縣市" style="width: 100%">
                        <el-option v-for="(conty, key, index) in taiwanCity" :key="index" :value="key" :label="key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.county">
                    <el-form-item prop="district">
                      <el-select disabled v-model="temp.district" placeholder="請選擇居住區域" style="width: 100%">
                        <el-option v-for="(district, key, index) in taiwanCity[
                            temp.county
                          ]" :key="index" :value="district.value" :label="district.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" v-if="temp.district">
                    <el-form-item prop="addr">
                      <el-input disabled placeholder="請輸入居住地址" v-model="temp.addr"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.addr && temp.district && temp.county">
                    <el-form-item prop="county">
                      <el-input disabled placeholder="經度" v-model="temp.lon"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.addr && temp.district && temp.county">
                    <el-form-item prop="county">
                      <el-input disabled placeholder="緯度" v-model="temp.lat"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="24">
              <el-row :gutter="16">
                <el-col :sm="12" :md="6">
                  <el-form-item label="可否派發" prop="caseUserStatus">
                    <el-select disabled v-model="temp.caseUserStatus" placeholder="請選擇派發狀態" style="width: 100%">
                      <el-option :value="'1'" :label="'可派發'">可派發</el-option>
                      <el-option :value="'0'" :label="'不可派發'">不可派發</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="12" v-if="temp.caseUserStatus == 0">
                  <el-form-item label="不可派發原因">
                    <el-input v-model="temp.statusReason" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

          </el-row>

          <SubTitle title="緊急聯絡人資訊"></SubTitle>
          <el-row :gutter="24">
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人姓名" prop="urgentName">
                <el-input disabled placeholder="請輸入聯絡人姓名" v-model="temp.urgentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="關係" prop="urgentRelationship">
                <el-input disabled placeholder="請輸入關係" v-model="temp.urgentRelationship"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人手機" prop="urgentPhone">
                <el-input disabled placeholder="請輸入聯絡人手機" v-model="temp.urgentPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人市話" prop="urgentTel">
                <el-input disabled placeholder="請輸入聯絡人市話" v-model="temp.urgentTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <SubTitle title="備註"></SubTitle>
          <el-input disabled type="textarea" v-model="temp.remark"></el-input>

          <SubTitle title="個案違規紀錄"></SubTitle>
          <div class="formTitle">
            <div class="timeSelect">今天</div>
            <div class="timeSelect">近一週</div>
            <div class="timeSelect">近一個月</div>
            <div class="timeSelect">近三個月</div>
            <div class="timeSelect">自訂時間</div>
            <el-date-picker size="mini" v-model="temp.Id" type="daterange" range-separator="~" start-placeholder="開始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
          <div class="bg-white" style="height: 500px">
            <el-table ref="mainTable" height="calc(100% - 52px)" :data="gridData" border highlight-current-row style="width: 100%">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column property="pic" label="照片" width="80" align="center"></el-table-column>
              <el-table-column property="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" align="center"></el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
          </div>

          <SubTitle title="個案搭乘紀錄"></SubTitle>

          <div class="formTitle">
            <div class="timeSelect">今天</div>
            <div class="timeSelect">近一週</div>
            <div class="timeSelect">近一個月</div>
            <div class="timeSelect">近三個月</div>
            <div class="timeSelect">自訂時間</div>
            <el-date-picker size="mini" v-model="temp.Id" type="daterange" range-separator="~" start-placeholder="開始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
          <div class="bg-white" style="height: 500px">
            <el-table ref="mainTable" height="calc(100% - 52px)" :data="gridData" border highlight-current-row style="width: 100%">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column property="pic" label="照片" width="80" align="center"></el-table-column>
              <el-table-column property="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column property="code" label="個案編號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
              <el-table-column property="uid" label="身分證字號" width="140" align="center"></el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import Pagination from "@/components/Pagination";
import DisabledUserInfo from "@/components/DisabledUserInfo";

import moment from "moment";
import * as taiwan from "@/assets/taiwan.js";
import * as users from "@/api/users";
import * as orgs from "@/api/orgs";
import * as caseUsers from "@/api/caseUsers";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
    Pagination,
    DisabledUserInfo,
  },
  data() {
    return {
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
      taiwanCity: "",
      buttons: [],
      // Dailog
      wealTypeDialog: false,
      // A單位
      unitAs: "",
      unitAId: ".0.1.1.",
      // 表單相關
      labelPosition: "top",
      basicTemp: {
        name: "",
        birthday: "",
        uid: "",
        sex: "",
      },
      temp: {
        userId: "", //用戶id
        id: "", //身份id
        caseUserNo: "", //個案編號
        orgAId: "", //Ａ單位(A單位)
        orgBIds: "", //B單位
        disabilityLevel: "", //失能等級
        county: "", //居住縣市
        district: "", //居住區域
        addr: "", //居住地址
        lat: 0, //經度
        lon: 0, //緯度
        urgentName: "", //聯絡人姓名
        urgentRelationship: "", //聯絡人關係
        urgentPhone: "", //聯絡人手機
        urgentTel: "", //聯絡人市話
        remark: "", //備註
        caseUserStatus: "1", //可否派發
        statusReason: "", //不可派發原因
        reviewDate: "", //額度控管留用首月,
        wealTypeId: "", //社會福利身份
        wealTypeName: "", //社會福利身份
        isEffectNow: true, //是否生效
      },
      rules: {
        // Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        caseUserNo: [{ required: true, message: "必填欄位", tigger: "blur" }],
        orgAId: [{ required: true, message: "必填欄位", tigger: "change" }],
        disabilityLevel: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        county: [{ required: true, message: "必填欄位", tigger: "change" }],
        district: [{ required: true, message: "必填欄位", tigger: "change" }],
        addr: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentName: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentRelationship: [
          { required: true, message: "必填欄位", tigger: "blur" },
        ],
        urgentPhone: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentTel: [{ required: true, message: "必填欄位", tigger: "blur" }],
        caseUserStatus: [
          { required: true, message: "必填欄位", tigger: "blur" },
        ],
        reviewDate: [{ required: true, message: "必填欄位" }],
        wealTypeId: [{ required: true, message: "必填欄位", tigger: "change" }],
      },
    };
  },
  methods: {
    //獲取特殊修改權限
    getSpecialButtons() {
      let router2 = this.$store.getters.modules;
      let a = router2.filter((r) => {
        return r.item.name == "用戶資料";
      });
      let b = a[0].children.filter((r2) => {
        return r2.item.name == "全部用戶";
      });
      this.buttons = b[0].item.elements.map((btn) => {
        return btn.domId;
      });
      // console.log(this.buttons);
    },
    // 是否擁有按鈕功能權限
    hasButton(domId) {
      return this.buttons.includes(domId);
    },
    // 獲取用戶基本資料
    async getUserBasic() {
      const vm = this;
      await users
        .getClient({ id: vm.$route.params.id.split("-")[0] })
        .then((res) => {
          vm.basicTemp = Object.assign({}, res.result); // copy obj
          window.setTimeout(() => {
            vm.$refs.form.clearValidate();
          }, 100);
        });
    },
    // 獲取長照資料
    getCaseUser() {
      const vm = this;
      caseUsers.get({ id: vm.$route.params.id.split("-")[1] }).then((res) => {
        vm.temp = Object.assign({}, res.result); // copy obj
        vm.temp.caseUserStatus = vm.temp.caseUserStatus.toString();
        vm.temp.disabilityLevel = vm.temp.disabilityLevel.toString();
        console.log(res);
      });
    },
    /* 獲取A單位資料 */
    getUnitAs() {
      const vm = this;
      orgs.getOrgNoPermission({ orgCascadeId: vm.unitAId }).then((res) => {
        vm.unitAs = res.result;
      });
    },
    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          console.log(vm.temp);
          caseUsers.add(vm.temp).then((res) => {
            console.log(res);
            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 長照身份編輯成功`,
            });
            vm.$router.push("/alluser/index");
            // vm.getCaseUser();
          });
        } else {
          console.log("submit error");
        }
      });
    },
  },
  filters: {
    dateFilter(date) {
      let res = moment(date).format("YYYY-MM-DD");
      return res;
    },
    reviewDateFilter(date) {
      let res = moment(date).format("YYYY-MM");
      return res;
    },
    sexFilter(sex) {
      if (sex) {
        return "男";
      } else {
        return "女";
      }
    },
    wealTypeFilter(typeId) {
      if (typeId == "1") {
        return "低收入戶";
      } else if (typeId == "2") {
        return "中低收入戶";
      } else {
        return "一般戶";
      }
    },
    disabilityLevelFilter(levelId) {
      let arr = [
        "1級(無失能)",
        "2級",
        "3級",
        "4級",
        "5級",
        "6級",
        "7級",
        "8級",
      ];
      let index = Number(levelId);
      return arr[index];
    },
    orgAIdFilter(orgAid, unitAs) {
      if (unitAs != "") {
        let res = unitAs?.filter((unit) => {
          return unit.id === orgAid;
        });
        // console.log(res)
        if (res.length > 0) {
          return res[0].name;
        } else {
          return false;
        }
      }
    },
    caseUserStatusFilter(status) {
      if (Number(status)) {
        return "可派發";
      } else {
        return "不可派發";
      }
    },
  },
  async mounted() {
    this.getUserBasic();
    this.taiwanCity = taiwan.cityAndCountiesLite;
    this.getSpecialButtons();
    await this.getUnitAs();
    this.getCaseUser();
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
.formTitle {
  font-size: 18px;
  color: $--color-primary;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
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
</style>
