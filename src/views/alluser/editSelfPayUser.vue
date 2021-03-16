<template>
  <div class="flex-column editCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleSave" type="success" plain>儲存</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="編輯白牌個案資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料"></SubTitle>
          <DisabledUserInfo :temp="basicTemp"></DisabledUserInfo>
          <SubTitle title="白牌資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="24" :md="24">
              <el-form-item label="居住地">
                <el-row :gutter="16">
                  <el-col :sm="12" :md="6" style="margin-bottom: 1rem">
                    <el-form-item prop="county">
                      <el-select @clear="handleClear" @change="handleClear" v-model="temp.county" clearable placeholder="請選擇居住縣市" style="width: 100%">
                        <el-option v-for="(conty, key, index) in taiwanCity" :key="index" :value="key" :label="key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="6" style="margin-bottom: 1rem" v-if="temp.county">
                    <el-form-item prop="district">
                      <el-select @clear="handleClear" v-model="temp.district" placeholder="請選擇居住區域" style="width: 100%">
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
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import DisabledUserInfo from "@/components/DisabledUserInfo";

import * as taiwan from "@/assets/taiwan.js";
import * as users from "@/api/users";
import * as selfPayUsers from "@/api/selfPayUsers";

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
        county: "", //居住縣市
        district: "", //居住區域
        addr: "", //居住地址
      },
      rules: {
        // Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        county: [{ required: true, message: "必填欄位", tigger: "change" }],
        district: [{ required: true, message: "必填欄位", tigger: "change" }],
        addr: [{ required: true, message: "必填欄位", tigger: "blur" }],
      },
    };
  },
  methods: {
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
    // 獲取白牌資料
    getSelfPayUser() {
      const vm = this;
      selfPayUsers
        .get({ id: vm.$route.params.id.split("-")[1] })
        .then((res) => {
          vm.temp = Object.assign({}, res.result); // copy obj

          console.log(res);
        });
    },

    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          console.log(vm.temp);
          selfPayUsers.update(vm.temp).then((res) => {
            console.log(res);
            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 白牌身份編輯成功`,
            });
            // vm.$router.push("/alluser/index");
            this.$router.go(-1);
            // vm.getSelfPayUser();
          });
        } else {
          console.log("submit error");
        }
      });
    },

    handleClear() {
      this.temp.district = "";
      this.temp.addr = "";
    },
  },
  mounted() {
    this.getUserBasic();
    this.getSelfPayUser();
    this.taiwanCity = taiwan.cityAndCountiesLite;
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
</style>
