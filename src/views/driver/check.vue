<template>
  <div class="flex-column driverAdd">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini" @click="$router.push('/driver/index')">回列表</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="檢視司機"></Title>
      <div class="bg-white formContainer customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料編輯"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="姓名" prop="name">
                <el-input disabled v-model="temp.name" placeholder="請輸入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="身分證字號" prop="uid">
                <el-input disabled v-model="temp.uid" placeholder="請輸入身分證字號"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="手機" prop="phone">
                <el-input disabled v-model="temp.phone" placeholder="請輸入手機"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="性別" prop="sex">
                <el-select disabled v-model="temp.sex" placeholder="請選擇性別" style="width: 100%">
                  <el-option :value="1" :label="'男'">男</el-option>
                  <el-option :value="0" :label="'女'">女</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="可否派發" prop="status">
                <el-select disabled v-model="temp.status" placeholder="請選擇可否派發" style="width: 100%">
                  <el-option :value="1" :label="'可派發'">可派發</el-option>
                  <el-option :value="0" :label="'不可派發'">不可派發</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <SubTitle title="司機證照"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">證照類型</div>
              <div class="expireDate">證照到期日</div>
            </div>
            <el-checkbox-group v-model="temp.driverLicenses">
              <div v-for="license in driverLicensesList" :key="license.categoryId" style="border-bottom: 1px solid #ddd; display: flex">
                <el-checkbox disabled :label="license.categoryId" name="type" style="width: 50%; text-align: center; padding: 1rem">
                  {{ license.categoryName }}
                </el-checkbox>
                <div class="expireDateBox">
                  <el-date-picker disabled style="width: 70%" v-model="license.expireDate" value-format="yyyy-MM-dd" type="date" size="mini" placeholder="選擇日期"></el-date-picker>
                </div>
              </div>
            </el-checkbox-group>
          </div>

          <SubTitle title="保險"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">保險類型</div>
              <div class="expireDate">保險到期日</div>
            </div>
            <el-checkbox-group v-model="temp.driverInsurance">
              <div v-for="insurance in driverInsurancesList" :key="insurance.categoryId" style="border-bottom: 1px solid #ddd; display: flex">
                <el-checkbox disabled :label="insurance.categoryId" style="width: 50%; text-align: center; padding: 1rem">
                  {{ insurance.categoryName }}
                </el-checkbox>
                <div class="expireDateBox">
                  <el-date-picker disabled style="width: 70%" value-format="yyyy-MM-dd" v-model="insurance.expireDate" type="date" size="mini" placeholder="選擇日期"></el-date-picker>
                </div>
              </div>
            </el-checkbox-group>
          </div>

          <!-- <SubTitle title="證照"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">持有證照</div>
              <div class="expireDate">證照到期日</div>
            </div>
            <el-checkbox-group v-model="temp.Type">
              <div
                v-for="item in 2"
                :key="item"
                style="border-bottom: 1px solid #ddd; display: flex"
              >
                <el-checkbox
                  label="計程車執業登記證"
                  name="type"
                  style="width: 50%; text-align: center; padding: 1rem"
                ></el-checkbox>
                <div class="expireDateBox">
                  <el-date-picker
                    style="width: 70%"
                    v-model="temp.Id"
                    type="date"
                    size="mini"
                    placeholder="選擇日期"
                  ></el-date-picker>
                </div>
              </div>
            </el-checkbox-group>
          </div> -->

          <SubTitle title="備註"></SubTitle>
          <el-input type="textarea" :rows="2" disabled placeholder="請输入内容" v-model="temp.remark"></el-input>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import { mapGetters } from "vuex";
import * as categorys from "@/api/categorys";
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
      // 司機證照
      driverLicensesList: [],
      // 司機保險
      driverInsurancesList: [],
      assignObj: "",
      temp: {
        id: "",
        userId: "",
        account: "",
        password: "",
        uid: "",
        name: "",
        pic: "",
        orgId: "",
        sex: null,
        status: 1,
        phone: "",
        remark: "",
        driverLicenses: [],
        driverInsurance: [],
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
    driverInsurancesChecked() {
      return this.driverInsurancesList.filter((option) =>
        this.temp.driverInsurance.some(
          (checked) => checked === option.categoryId
        )
      );
    },
    driverLicensesChecked() {
      return this.driverLicensesList.filter((option) =>
        this.temp.driverLicenses.some(
          (checked) => checked === option.categoryId
        )
      );
    },
  },
  methods: {
    // 獲取司機
    async getList() {
      const vm = this;
      await drivers.get({ id: vm.$route.params.id }).then((res) => {
        console.log(res.result);
        vm.assignObj = JSON.parse(JSON.stringify(res.result));

        let resClone = JSON.parse(JSON.stringify(res.result));
        let replaceKey = ["driverLicenses", "driverInsurance"];

        replaceKey.forEach((item, index, arr) => {
          resClone[arr[index]] = resClone[arr[index]].map(
            (item1) => item1?.categoryId
          );
        });
        vm.temp = resClone;
        // console.log(vm.temp);
      });
    },
    // 獲取司機證照
    getDriverLicenses() {
      const vm = this;
      let query = {
        page: 1,
        limit: 20,
        TypeId: "SYS_DRIVER_LICENSE",
      };
      categorys.getList(query).then((res) => {
        res.data.forEach((license) => {
          let obj = {};
          obj.categoryId = license.dtValue;
          obj.categoryName = license.name;
          obj.expireDate = "";
          vm.driverLicensesList.push(obj);
        });
        vm.driverLicensesList.forEach((i) => {
          let arr = vm.assignObj.driverLicenses.filter((d) => {
            return d.categoryId === i.categoryId;
          });
          i.expireDate = arr[0]?.expireDate;
        });
      });
    },
    //獲取所有保險項目
    getDriverInsurances() {
      const vm = this;
      let query = {
        page: 1,
        limit: 20,
        TypeId: "SYS_DRIVER_INSURANCE",
      };
      categorys.getList(query).then((res) => {
        res.data.forEach((insurances) => {
          let obj = {};
          obj.categoryId = insurances.dtValue;
          obj.categoryName = insurances.name;
          obj.expireDate = "";
          vm.driverInsurancesList.push(obj);
        });
        vm.driverInsurancesList.forEach((i) => {
          console.log("aaaa");
          let arr = vm.assignObj.driverInsurance.filter((d) => {
            return d.categoryId === i.categoryId;
          });
          i.expireDate = arr[0]?.expireDate;
        });
      });
    },

    // 確認編輯司機
    handleSave() {
      const vm = this;
      vm.temp.account = vm.temp.uid;
      vm.temp.password = vm.temp.phone;
      console.log(vm.temp);
      let obj = JSON.parse(JSON.stringify(vm.temp));
      obj.driverLicenses = vm.driverLicensesChecked;
      obj.driverInsurance = vm.driverInsurancesChecked;
      console.log(obj);
      drivers.update(obj).then((res) => {
        console.log(res);
        // vm.$router.push("/car/index");
      });
    },

    // 檢查是否勾選
    hasChecked(id) {
      return !this.temp.driverLicenses.includes(id);
    },
    hasCheckedI(id) {
      return !this.temp.driverInsurance.includes(id);
    },
  },
  async mounted() {
    await this.getList();
    this.getDriverLicenses();
    this.getDriverInsurances();
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
