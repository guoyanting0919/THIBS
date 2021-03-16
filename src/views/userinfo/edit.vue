<template>
  <div class="flex-column userInfoEdit">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini" @click="handleBack">回列表</el-button>
        <el-button @click="handleSave" type="success" size="mini">儲存</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="編輯乘客"></Title>
      <div class="bg-white formContainer customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="乘客基本資料編輯"></SubTitle>
          <el-row :gutter="16">

            <el-col :sm="12" :md="6">
              <el-form-item label="帳號" prop="account">
                <el-input v-model="temp.account" placeholder="請輸入帳號"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="密碼" prop="password">
                <el-input v-model="temp.password" placeholder="請輸入密碼"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" placeholder="請輸入姓名"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="鄉鎮" prop="town">
                <el-select v-model="temp.town" placeholder="請選擇鄉鎮" style="width: 100%">
                  <el-option :value="'SSTW'" :label="'尖石鄉'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="村里" prop="village">
                <el-input v-model="temp.village" placeholder="請輸入村里"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="手機號碼" prop="phone">
                <el-input v-model="temp.phone" placeholder="請輸入手機號碼"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="temp.birthday" type="date" placeholder="請選擇生日" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="身分" prop="userType">
                <el-select v-model="temp.userType" placeholder="請選擇身分" style="width: 100%">
                  <el-option :value="'一般'" :label="'一般'"></el-option>
                  <el-option :value="'學生'" :label="'學生'"></el-option>
                  <el-option :value="'年長者'" :label="'年長者'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="是否為低收入戶" prop="isLowIncome">
                <el-select v-model="temp.isLowIncome" placeholder="請選擇是否為低收入戶" style="width: 100%">
                  <el-option :value="'1'" :label="'是'"></el-option>
                  <el-option :value="'0'" :label="'否'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="性別" prop="sex">
                <el-select v-model="temp.sex" placeholder="請選擇性別" style="width: 100%">
                  <el-option :value="'1'" :label="'男'"></el-option>
                  <el-option :value="'0'" :label="'女'"></el-option>
                </el-select>
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
import * as userInfo from "@/api/userInfo";

export default {
  name: "userInfoEdit",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      labelPosition: "top",
      temp: {
        thiId: "",
        account: "",
        password: "",
        name: "",
        town: "",
        village: "",
        phone: "",
        birthday: "",
        userType: "", //userType
        isLowIncome: "1", //是否為低收入戶
        sex: "1",
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    // 獲取乘客資料
    getList() {
      const vm = this;
      userInfo.get({ id: vm.$route.params.id }).then((res) => {
        vm.temp = JSON.parse(JSON.stringify(res.result));
      });
    },

    // 確認編輯乘客
    handleSave() {
      const vm = this;
      userInfo.update(vm.temp).then(() => {
        vm.$alertT.fire({
          icon: "success",
          title: `乘客 ${vm.temp.name} 修改成功`,
        });
        vm.$router.push("/userinfo/index");
      });
    },

    // back
    handleBack() {
      const vm = this;
      vm.$router.push("/userinfo/index");
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.formTitle:nth-child(1) {
  margin-top: 1rem;
}
.uploadPic {
  width: 240px;
  height: 240px;
  background: #ffe6d1;
  margin: auto;
  margin-top: 1.5rem;
}
.avatar-uploader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tableContainer {
  width: 100%;
  // background: lightcoral;
}
.tableHeader {
  display: flex;
}
.headerCheckBox {
  border-right: 1px solid #fff;
}
.headerCheckBox,
.expireDate {
  width: 50%;
  text-align: center;
  padding: 1rem 0;
  background: #fafafa;
  font-size: 13px;
  font-weight: 700;
  box-sizing: border-box;
}
.expireDateBox {
  width: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
