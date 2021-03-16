<template>
  <div class="flex-column addCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleSave" type="success" plain>儲存</el-button>
        <el-button size="mini" v-if="$route.query.fast != 'undefined'" @click="rolesDialog = true" type="success" plain>儲存並繼續新增用戶其他身份</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="新增長照個案基本資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="3">
              <el-form-item label="姓名">
                <el-input disabled placeholder="請輸入個案姓名" v-model="basicTemp.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="3">
              <el-form-item label="性別">
                <el-select disabled clearable v-model="basicTemp.sex" placeholder="請選擇性別" style="width: 100%">
                  <el-option :value="1" :label="'男'">男</el-option>
                  <el-option :value="0" :label="'女'">女</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="身份證字號">
                <el-input disabled v-model="basicTemp.uid" placeholder="請輸入個案身分證字號"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="生日">
                <el-date-picker disabled v-model="basicTemp.birthday" type="date" placeholder="請選擇生日" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="手機">
                <el-input disabled v-model="basicTemp.phone" placeholder="請輸入手機"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <SubTitle title="長照資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="個案編號" prop="caseUserNo">
                <el-input v-model="temp.caseUserNo" placeholder="請輸入個案編號"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="社會福利身份" prop="wealTypeId">
                <el-select v-model="temp.wealTypeId" placeholder="社會福利身份" style="width: 100%">
                  <el-option :value="'1'" :label="'低收入戶'">低收入戶</el-option>
                  <el-option :value="'2'" :label="'中低收入戶'">中低收入戶</el-option>
                  <el-option :value="'3'" :label="'一般戶'">一般戶</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="額度控管留用首月" prop="reviewDate">
                <el-date-picker v-model="temp.reviewDate" type="month" style="width: 100%" placeholder="請選擇額度控管留用首月" value-format="yyyy-MM"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="失能等級" prop="disabilityLevel">
                <el-select v-model="temp.disabilityLevel" placeholder="請選擇失能等級" style="width: 100%">
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
            <el-col :sm="24" :md="24">
              <el-form-item label="居住地">
                <span class="wealSpan" slot="label">居住地
                  <el-button class="wealBtn" type="info" size="mini" v-if="temp.addr" @click="handleTransfer">轉換經緯度</el-button>
                </span>
                <el-row :gutter="16">
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item prop="county">
                      <el-select v-model="temp.county" clearable placeholder="居住縣市" style="width: 100%">
                        <el-option v-for="(conty, key, index) in taiwanCity" :key="index" :value="key" :label="key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.county">
                    <el-form-item prop="district">
                      <el-select v-model="temp.district" placeholder="居住區域" style="width: 100%">
                        <el-option v-for="(district, key, index) in taiwanCity[
                            temp.county
                          ]" :key="index" :value="district.value" :label="district.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12" v-if="temp.district">
                    <el-form-item prop="addr">
                      <el-input placeholder="請輸入居住地址" v-model="temp.addr"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.addr && temp.district && temp.county">
                    <el-form-item prop="county">
                      <el-input placeholder="經度" v-model="temp.lon"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.addr && temp.district && temp.county">
                    <el-form-item prop="county">
                      <el-input placeholder="緯度" v-model="temp.lat"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="管理單位" prop="orgAId">
                <el-select v-model="temp.orgAId" placeholder="請選擇管理單位" style="width: 100%">
                  <el-option v-for="org in unitAs" :key="org.id" :value="org.id" :label="org.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="其他聯絡電話">
                <el-input placeholder="其他聯絡電話" v-model="temp.otherPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="24">
              <el-row :gutter="16">
                <el-col :sm="12" :md="6">
                  <el-form-item label="可否派發" prop="caseUserStatus">
                    <el-select v-model="temp.caseUserStatus" placeholder="請選擇派發狀態" style="width: 100%">
                      <el-option :value="'1'" :label="'可派發'">可派發</el-option>
                      <el-option :value="'0'" :label="'不可派發'">不可派發</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="12" v-if="temp.caseUserStatus == 0">
                  <el-form-item label="不可派發原因">
                    <el-input v-model="temp.statusReason"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <!-- <el-col :sm="24" :md="24">
              <el-form-item label="輪住地址">
                <el-row
                  :gutter="16"
                  v-for="(item, index) in temp.lun"
                  :key="index"
                  style="margin-bottom:1rem"
                >
                  <el-col :sm="12" :md="3" style="margin-bottom:1rem">
                    <el-form-item>
                      <el-select
                        v-model="item.value1"
                        clearable
                        placeholder="居住縣市"
                        style="width:100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom:1rem">
                    <el-form-item>
                      <el-select
                        v-model="item.value2"
                        clearable
                        placeholder="居住地區"
                        style="width:100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="8" style="margin-bottom:1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value3"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="12" :md="3" style="margin-bottom:1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value4"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom:1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value5"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :sm="3"
                    :md="2"
                    style="text-align:center;margin-bottom:1rem"
                  >
                    <el-button type="danger" @click="delLun(item)"
                      >刪除</el-button
                    >
                  </el-col>
                  <el-col
                    :sm="3"
                    :md="2"
                    style="text-align:center;margin-bottom:1rem"
                  >
                    <el-button type="info" @click="delLun(item)"
                      >轉換</el-button
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :sm="24" style="text-align:center">
              <el-button type="primary" @click="addLun">新增輪住地址</el-button>
            </el-col> -->
          </el-row>

          <SubTitle title="緊急聯絡人資訊"></SubTitle>
          <el-row :gutter="24">
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人姓名" prop="urgentName">
                <el-input placeholder="請輸入聯絡人姓名" v-model="temp.urgentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="關係" prop="urgentRelationship">
                <el-input placeholder="請輸入關係" v-model="temp.urgentRelationship"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人手機" prop="urgentPhone">
                <el-input placeholder="請輸入聯絡人手機" v-model="temp.urgentPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人市話" prop="urgentTel">
                <el-input placeholder="請輸入聯絡人市話" v-model="temp.urgentTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <SubTitle title="備註"></SubTitle>
          <el-input type="textarea" v-model="temp.remark"></el-input>
        </el-form>
      </div>
    </div>

    <!-- rolesDialog -->
    <el-dialog title="請選擇欲新增的身份" :visible.sync="rolesDialog" width="500px">
      <div class="rolesBox">
        <!-- <el-button
          v-if="hasButton('addCaseUser')"
          type="primary"
          plain
          @click="handleRole('1')"
          >長照身份</el-button
        > -->
        <el-button v-if="hasButton('addSelfPayUser')" type="primary" plain @click="handleRole('2')">白牌身份</el-button>
        <el-button v-if="hasButton('addBusUser')" type="primary" plain @click="handleRole('3')">幸福巴士身份</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";

import * as taiwan from "@/assets/country.js";
import * as users from "@/api/users";
import * as caseUsers from "@/api/caseUsers";
import * as orgs from "@/api/orgs";
import * as mapss from "@/api/map";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      //權限按鈕
      buttons: [],
      //dialog
      rolesDialog: false,
      taiwanCity: "",
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
        birthday: "", //用戶生日
        orgAId: "", //Ａ單位(管理單位)
        orgBIds: "", //B單位
        otherPhone: "", //其他聯絡電話
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
    /* 獲取特殊修改權限 */
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
    },

    /* 是否擁有按鈕功能權限 */
    hasButton(domId) {
      return this.buttons.includes(domId);
    },

    /* 獲取用戶基本資料 */
    getUserBasic() {
      const vm = this;
      users.getClient({ id: vm.$route.params.id }).then((res) => {
        vm.basicTemp = Object.assign({}, res.result); // copy obj
      });
    },

    /* 獲取A單位資料 */
    getUnitAs() {
      const vm = this;
      orgs.getOrgNoPermission({ orgCascadeId: vm.unitAId }).then((res) => {
        vm.unitAs = res.result;
      });
    },

    /* 轉換經緯度 */
    handleTransfer() {
      const vm = this;
      let params = {
        _addr: `${vm.temp.county}${vm.temp.district}${vm.temp.addr}`,
      };
      mapss.geocode(params).then((res) => {
        vm.$cl(res);
        vm.temp.lat = res.result.lat;
        vm.temp.lon = res.result.lon;
      });
    },

    /* 儲存身份資料 */
    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.temp.userId = vm.$route.params.id;
          // vm.temp.birthday = moment(vm.basicTemp.birthday).format("yyyy-MM-DD");
          // vm.temp.reviewDate = moment(vm.temp.reviewDate).format('yyyy')
          console.log(vm.temp);
          caseUsers.add(vm.temp).then(() => {
            // console.log(res);

            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 成功新增長照身份`,
            });
            vm.$router.push("/alluser/index");
          });
        } else {
          console.log("submit error");
        }
      });
    },

    /* 儲存並快速新增其他身份 */
    handleFastSave(myRoute) {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.temp.userId = vm.$route.params.id;
          // vm.temp.birthday = moment(vm.basicTemp.birthday).format("yyyy-MM-DD");
          // vm.temp.reviewDate = moment(vm.temp.reviewDate).format('yyyy')
          console.log(vm.temp);
          caseUsers.add(vm.temp).then(() => {
            // console.log(res);

            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 成功新增白牌身份`,
            });
            vm.$router.push(
              `/alluser/${myRoute}/${vm.$route.params.id}?fast=true`
            );
          });
        } else {
          console.log("submit error");
        }
      });
    },

    /* 替用戶添加身份 */
    handleRole(role) {
      console.log(role);
      switch (role) {
        case "1":
          this.rolesDialog = false;
          this.handleFastSave("addCaseUser");
          break;
        case "2":
          this.rolesDialog = false;
          this.handleFastSave("addSelfPayUser");
          break;
        case "3":
          this.rolesDialog = false;
          this.handleFastSave("addBusUser");
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.getUserBasic();
    this.getSpecialButtons();
    this.getUnitAs();
    this.taiwanCity = taiwan.cityAndCountiesLite;
    // console.log(this.taiwanCity);
    this.$cl(this.taiwanCity);
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
</style>
