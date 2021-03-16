<template>
  <div class="flex-column addCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="$router.go(-1)" type="success" plain
          >回列表</el-button
        >
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="檢視幸福巴士個案基本資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          ref="form"
        >
          <SubTitle title="基本資料"></SubTitle>
          <DisabledUserInfo :temp="basicTemp"></DisabledUserInfo>

          <SubTitle title="巴士資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="卡號" prop="cardNo">
                <el-input
                  disabled
                  v-model="temp.cardNo"
                  placeholder="請輸入卡號"
                ></el-input>
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
import * as users from "@/api/users";
import * as busUsers from "@/api/busUsers";
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
      // 表單相關
      labelPosition: "top",
      basicTemp: {
        name: "",
        birthday: "",
        uid: "",
        sex: "",
      },
      temp: {
        id: "",
        userId: "",
        cardNo: "",
      },
      rules: {
        cardNo: [{ required: true, message: "必填欄位", tigger: "blur" }],
      },
    };
  },
  methods: {
    // 獲取用戶基本資料
    getUserBasic() {
      const vm = this;

      users.getClient({ id: vm.$route.params.id.split("-")[0] }).then((res) => {
        vm.basicTemp = Object.assign({}, res.result); // copy obj
        console.log(res);
      });
    },

    // 獲取白牌資料
    getBusUser() {
      const vm = this;
      busUsers.get({ id: vm.$route.params.id.split("-")[1] }).then((res) => {
        vm.temp = Object.assign({}, res.result); // copy obj
        // console.log(res);
      });
    },

    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.temp.userId = vm.$route.params.id;
          busUsers.update(vm.temp).then(() => {
            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 成功編輯巴士身份`,
            });
            vm.$router.push("/alluser/index");
          });
        } else {
          console.log("submit error");
        }
      });
    },
  },
  mounted() {
    this.getUserBasic();
    this.getBusUser();
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
</style>
