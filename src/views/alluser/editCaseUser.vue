<template>
  <div class="flex-column editCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleSave" type="success" plain>儲存</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="編輯長照個案資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料"></SubTitle>
          <DisabledUserInfo :temp="basicTemp"></DisabledUserInfo>

          <SubTitle title="長照資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="個案編號" prop="caseUserNo">
                <el-input v-model="temp.caseUserNo" placeholder="請輸入個案編號"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="社會福利身份" prop="wealTypeId">
                <span class="wealSpan" slot="label">社會福利身份
                  <el-button v-if="hasButton('editWealType')" class="wealBtn" type="info" size="mini" @click="wealTypeDialog = true">修改</el-button>
                </span>
                <el-select disabled v-model="temp.wealTypeId" placeholder="社會福利身份" style="width: 100%">
                  <el-option :value="'1'" :label="'低收入戶'">低收入戶</el-option>
                  <el-option :value="'2'" :label="'中低收入戶'">中低收入戶</el-option>
                  <el-option :value="'3'" :label="'一般戶'">一般戶</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="額度控管留用首月" prop="reviewDate">
                <el-date-picker v-model="temp.reviewDate" type="month" style="width: 100%" value-format="yyyy-MM" placeholder="請選擇額度控管留用首月"></el-date-picker>
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

            <el-col :sm="24" :md="12">
              <el-form-item label="A單位" prop="orgAId">
                <el-select v-model="temp.orgAId" placeholder="請選擇A單位" style="width: 100%">
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
              <el-form-item label="居住地">
                <span class="wealSpan" slot="label">居住地
                  <el-button class="wealBtn" type="info" size="mini" v-if="temp.addr" @click="handleTransfer">轉換經緯度</el-button>
                </span>
                <el-row :gutter="16">
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item prop="county">
                      <el-select v-model="temp.county" clearable placeholder="請選擇居住縣市" style="width: 100%">
                        <el-option v-for="(conty, key, index) in taiwanCity" :key="index" :value="key" :label="key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem" v-if="temp.county">
                    <el-form-item prop="district">
                      <el-select v-model="temp.district" placeholder="請選擇居住區域" style="width: 100%">
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
                    <!-- <el-input v-model="temp.statusReason"></el-input> -->
                    <el-select v-model="temp.statusReason" placeholder="請選擇不可派發原因" style="width: 100%">
                      <el-option :value="'死亡'" :label="'死亡'">死亡</el-option>
                      <el-option :value="'移出'" :label="'移出'">移出</el-option>
                      <el-option :value="'失能等級不符'" :label="'失能等級不符'">失能等級不符</el-option>
                      <el-option :value="'其他'" :label="'其他'">其他</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
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

    <!-- wealTypeDialog -->
    <el-dialog title="修改社會福利身份" :visible.sync="wealTypeDialog" width="30%">
      <el-select v-model="temp.wealTypeId" placeholder="社會福利身份" style="width: 100%">
        <el-option :value="'1'" :label="'低收入戶'">低收入戶</el-option>
        <el-option :value="'2'" :label="'中低收入戶'">中低收入戶</el-option>
        <el-option :value="'3'" :label="'一般戶'">一般戶</el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wealTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="wealTypeDialog = false">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import DisabledUserInfo from "@/components/DisabledUserInfo";

import * as taiwan from "@/assets/taiwan.js";
import * as users from "@/api/users";
import * as mapss from "@/api/map";
import * as orgs from "@/api/orgs";
import * as caseUsers from "@/api/caseUsers";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
    DisabledUserInfo,
  },
  data() {
    return {
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
        console.log(r.item.name);
        return r.item.name == "用戶資料";
      });
      console.log(a);
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

    /* 獲取長照資料 */
    getCaseUser() {
      const vm = this;
      caseUsers.get({ id: vm.$route.params.id.split("-")[1] }).then((res) => {
        vm.temp = Object.assign({}, res.result); // copy obj
        vm.temp.caseUserStatus = vm.temp.caseUserStatus.toString();
        vm.temp.disabilityLevel = vm.temp.disabilityLevel.toString();
        // console.log(res);
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

    /* 獲取A單位資料 */
    getUnitAs() {
      const vm = this;
      orgs.getOrgNoPermission({ orgCascadeId: vm.unitAId }).then((res) => {
        vm.unitAs = res.result;
      });
    },

    /* 儲存 */
    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          console.log(vm.temp);
          caseUsers.add(vm.temp).then((res) => {
            vm.$alertT.fire({
              icon: res.code == 200 ? "success" : "error",
              title:
                res.code === 200
                  ? `用戶${vm.basicTemp.name} 長照身份編輯成功`
                  : res.message,
            });
            // vm.$router.push("/alluser/index");
            this.$router.go(-1);
            // vm.getCaseUser();
          });
        } else {
          console.log("submit error");
        }
      });
    },
  },
  mounted() {
    this.getUserBasic();
    this.getCaseUser();
    this.getUnitAs();
    this.taiwanCity = taiwan.cityAndCountiesLite;
    this.getSpecialButtons();
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
</style>
