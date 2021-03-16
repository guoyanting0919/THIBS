<template>
  <div class="flex-column driverAdd">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini">回列表</el-button>
        <el-button @click="handleSave" type="success" size="mini">儲存</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="新增司機"></Title>
      <div class="bg-white formContainer customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料編輯"></SubTitle>
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
              <el-form-item label="司機狀態" prop="town">
                <el-select v-model="temp.town" placeholder="請選擇司機狀態" style="width: 100%">
                  <el-option :value="'在職'" :label="'在職'"></el-option>
                  <el-option :value="'離職'" :label="'離職'"></el-option>
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
              <el-form-item label="身分證字號" prop="uid">
                <el-input v-model="temp.uid" placeholder="請輸入身分證字號"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="地址" prop="addr">
                <el-input v-model="temp.addr" placeholder="請輸入地址"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="地址經度" prop="addrLng">
                <el-input v-model="temp.addrLng" placeholder="請輸入地址經度"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="地址緯度" prop="addrLat">
                <el-input v-model="temp.addrLat" placeholder="請輸入地址緯度"></el-input>
              </el-form-item>
            </el-col>
            <!-- 普通大貨車/普通小型車/普通聯結車/職業大客車/職業大貨車/職業小型車/職業小客車/職業聯結車) -->
            <el-col :sm="12" :md="6">
              <el-form-item label="駕照種類" prop="driverLicense">
                <el-select multiple v-model="temp.driverLicense" placeholder="請選擇駕照種類" style="width: 100%">
                  <el-option :value="'普通大貨車'" :label="'普通大貨車'"></el-option>
                  <el-option :value="'普通小型車'" :label="'普通小型車'"></el-option>
                  <el-option :value="'普通聯結車'" :label="'普通聯結車'"></el-option>
                  <el-option :value="'職業大客車'" :label="'職業大客車'"></el-option>
                  <el-option :value="'職業大貨車'" :label="'職業大貨車'"></el-option>
                  <el-option :value="'職業小型車'" :label="'職業小型車'"></el-option>
                  <el-option :value="'職業小客車'" :label="'職業小客車'"></el-option>
                  <el-option :value="'職業聯結車'" :label="'職業聯結車'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="發照日期" prop="releaseDate">
                <el-date-picker v-model="temp.releaseDate" type="date" placeholder="請選擇發照日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="最高學歷" prop="highestEdu">
                <el-select v-model="temp.highestEdu" placeholder="請輸入最高學歷" style="width: 100%">
                  <el-option :value="'國小'" :label="'國小'"></el-option>
                  <el-option :value="'國中'" :label="'國中'"></el-option>
                  <el-option :value="'二專'" :label="'二專'"></el-option>
                  <el-option :value="'高中'" :label="'高中'"></el-option>
                  <el-option :value="'高職'" :label="'高職'"></el-option>
                  <el-option :value="'大學'" :label="'大學'"></el-option>
                  <el-option :value="'碩士'" :label="'碩士'"></el-option>
                  <el-option :value="'博士'" :label="'博士'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="地方風評" prop="localEvaluation">
                <el-input v-model="temp.localEvaluation" placeholder="請輸入地方風評"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="到職日" prop="onJobDate">
                <el-date-picker v-model="temp.onJobDate" type="date" placeholder="請選擇到職日" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="離職日" prop="offJobDate">
                <el-date-picker v-model="temp.offJobDate" type="date" placeholder="請選擇離職日" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
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
import * as drivers from "@/api/drivers";
export default {
  name: "driverAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      labelPosition: "top",

      temp: {
        account: "",
        password: "",
        name: "",
        thiId: null,
        town: "",
        sex: "",
        phone: "",
        birthday: "",
        uid: "",
        addr: "",
        addrLng: "",
        addrLat: "",
        driverLicense: [], //普通大貨車/普通小型車/普通聯結車/職業大客車/職業大貨車/職業小型車/職業小客車/職業聯結車
        releaseDate: "",
        highestEdu: "",
        localEvaluation: "",
        onJobDate: "",
        offJobDate: "",
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // 確認新增司機
    handleSave() {
      const vm = this;
      let obj = JSON.parse(JSON.stringify(vm.temp));
      obj.driverLicense = obj.driverLicense.join(",");
      console.log(obj);
      drivers.add(obj).then(() => {
        vm.$alertT.fire({
          icon: "success",
          title: `司機 ${obj.name} 新增成功`,
        });
        vm.$router.push("/driver/index");
      });
    },

    // 檢查是否勾選
    hasChecked(id) {
      return !this.temp.driverLicenses.includes(id);
    },
  },
  mounted() {},
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
