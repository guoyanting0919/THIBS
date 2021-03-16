<template>
  <div class="flex-column carAdd">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini" @click="handleBack">回列表</el-button>
        <el-button @click="handleSave" type="success" size="mini">儲存</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="新增車輛"></Title>
      <div class="bg-white formContainer customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="車輛基本資料編輯"></SubTitle>
          <el-row :gutter="16">

            <el-col :sm="12" :md="6">
              <el-form-item label="車輛狀態" prop="status">
                <el-select v-model="temp.status" placeholder="請選擇車輛狀態" style="width: 100%">
                  <el-option :value="'Y'" :label="'可派發'">可派發</el-option>
                  <el-option :value="'N'" :label="'不可派發'">不可派發</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="鄉鎮" prop="township">
                <el-select v-model="temp.township" placeholder="請選擇鄉鎮" style="width: 100%">
                  <el-option :value="'SSTW'" :label="'尖石鄉'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="車牌號碼" prop="carNo">
                <el-input v-model="temp.carNo" placeholder="請輸入車牌號碼"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="廠牌" prop="brand">
                <el-input v-model="temp.brand" placeholder="請輸入廠牌"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="形式" prop="carType">
                <el-select v-model="temp.carType" placeholder="請選擇形式" style="width: 100%">
                  <el-option :value="'一般車'" :label="'一般車'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="車輛類別" prop="carCategoryName">
                <el-select v-model="temp.carCategoryName" placeholder="請選擇車輛類別" style="width: 100%">
                  <el-option :value="'一般車'" :label="'一般車'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="載客人數" prop="seatNum">
                <el-input-number style="width: 100%" v-model="temp.seatNum" :min="1" :max="10"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="車輛產權" prop="carOwner">
                <el-input v-model="temp.carOwner" placeholder="請輸入車輛產權"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="發照日期" prop="releaseDate">
                <el-date-picker v-model="temp.releaseDate" type="date" placeholder="請選擇發照日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="排氣量" prop="displacement">
                <el-input v-model="temp.displacement" placeholder="請輸入排氣量"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="出廠日期" prop="makeDate">
                <el-date-picker v-model="temp.makeDate" type="date" placeholder="請選擇出廠日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="保險證號" prop="insuranceNo">
                <el-input v-model="temp.insuranceNo" placeholder="請輸入保險證號"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="投保項目與金額" prop="insuranceItem">
                <el-input v-model="temp.insuranceItem" placeholder="請輸入投保項目與金額"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="檢驗合格日期" prop="checkDate">
                <el-date-picker v-model="temp.checkDate" type="date" placeholder="請選擇檢驗合格日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="下次檢定日期" prop="nextCheckDate">
                <el-date-picker v-model="temp.nextCheckDate" type="date" placeholder="請選擇檢驗下次檢定日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="上次保養日期" prop="maintainDate">
                <el-date-picker v-model="temp.maintainDate" type="date" placeholder="請選擇檢驗上次保養日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="下次定保日期" prop="nextMaintainDate">
                <el-date-picker v-model="temp.nextMaintainDate" type="date" placeholder="請選擇檢驗下次定保日期" style="width: 100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :md="6">
              <el-form-item label="定期保養項目" prop="maintainItems">
                <el-input v-model="temp.maintainItems" placeholder="請輸入定期保養項目"></el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <!-- <SubTitle title="車輛設備"></SubTitle>
          <el-form-item label="" prop="carDevices">
            <el-checkbox-group v-model="temp.carDevices">
              <el-checkbox v-for="device in carDevicesList" :key="device.categoryId" :label="device.categoryId">{{ device.categoryName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <SubTitle title="所需證照"></SubTitle>
          <el-form-item label="" prop="carLicenses">
            <el-checkbox-group v-model="temp.carLicenses">
              <el-checkbox v-for="license in carLicensesList" :key="license.categoryId" :label="license.categoryId">{{ license.categoryName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <SubTitle title="保險"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">保險類型</div>
              <div class="expireDate">保險到期日</div>
            </div>
            <el-checkbox-group v-model="temp.carInsurances">
              <div v-for="insurance in carInsurancesList" :key="insurance.categoryId" style="border-bottom: 1px solid #ddd; display: flex">
                <el-checkbox :label="insurance.categoryId" style="width: 50%; text-align: center; padding: 1rem">
                  {{ insurance.categoryName }}
                </el-checkbox>
                <div class="expireDateBox">
                  <el-date-picker :disabled="hasChecked(insurance.categoryId)" style="width: 70%" v-model="insurance.expireDate" type="date" value-format="yyyy-MM-dd" size="mini" placeholder="選擇日期"></el-date-picker>
                </div>
              </div>
            </el-checkbox-group>
          </div>

          <SubTitle title="備註"></SubTitle>
          <el-input type="textarea" :rows="2" placeholder="請輸入內容" v-model="temp.remark"></el-input> -->
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
// import * as categorys from "@/api/categorys";
import * as cars from "@/api/cars";
export default {
  name: "carAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      labelPosition: "top",
      temp: {
        id: "",
        status: "Y", //車輛狀態(N:不可派發，Y:可派發)
        township: "", //鄉鎮
        carNo: "", //車牌號碼
        brand: "", //廠牌
        carCategoryName: "", //車輛類型
        carType: "", //型式
        seatNum: 1, //載客人數
        carOwner: "", //車輛產權
        releaseDate: "", //發照日期
        displacement: 0, //排氣量
        makeDate: "", //出廠日期
        insuranceNo: "", //保險證號
        insuranceItem: "", //投保項目與金額
        checkDate: "", //檢驗合格日期
        nextCheckDate: "", //下次檢定日期
        maintainDate: "", //上次保養日期
        nextMaintainDate: "", //下次定保日期
        maintainItems: "", //定期保養項目

        // orgId: "",
        // driverInfoId: "",
        // carCategoryId: "",
        // carPic: "",
        // carTop: "",
        // factoryType: "",
        // carFrom: "",
        // donationUnit: "",
        // carColor: "",
        // wheelchairNum: 0,
        // lastCheckDate: "",
        // remark: "",
        // carLicenses: [],
        // carInsurances: [],
        // carDevices: [],
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
    carDevicesChecked() {
      return this.carDevicesList.filter((option) =>
        this.temp.carDevices.some((checked) => checked === option.categoryId)
      );
    },
    carInsurancesChecked() {
      return this.carInsurancesList.filter((option) =>
        this.temp.carInsurances.some((checked) => checked === option.categoryId)
      );
    },
    carLicensesChecked() {
      return this.carLicensesList.filter((option) =>
        this.temp.carLicenses.some((checked) => checked === option.categoryId)
      );
    },
  },
  methods: {
    // 確認新增車輛
    handleSave() {
      const vm = this;
      console.log(vm.temp);
      // vm.temp.orgId = vm.defaultorgid;
      // vm.temp.carCategoryName = vm.carCategorysList.filter((c) => {
      //   return c.dtValue == vm.temp.carCategoryId;
      // })[0].name;

      // let obj = JSON.parse(JSON.stringify(vm.temp));
      // console.log(vm.carDevicesChecked);
      // obj.carDevices = vm.carDevicesChecked;
      // obj.carInsurances = vm.carInsurancesChecked;
      // obj.carLicenses = vm.carLicensesChecked;

      console.log(cars);
      cars.add(vm.temp).then(() => {
        vm.$alertT.fire({
          icon: "success",
          title: `車輛 ${vm.temp.carNo} 已新增`,
        });
        vm.$router.push("/car/index");
      });
    },

    // back
    handleBack() {
      const vm = this;
      vm.$router.push("/car/index");
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
