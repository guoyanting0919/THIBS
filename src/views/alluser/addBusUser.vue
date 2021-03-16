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
      <Title title="新增幸福巴士用戶基本資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form :label-position="labelPosition" label-width="200px" :model="temp" :rules="rules" ref="form">
          <SubTitle title="基本資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="3">
              <el-form-item label="姓名">
                <el-input disabled placeholder="請輸入用戶姓名" v-model="basicTemp.name"></el-input>
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
                <el-input disabled v-model="basicTemp.uid" placeholder="請輸入用戶身分證字號"></el-input>
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

          <SubTitle title="巴士資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="卡號" prop="cardNo">
                <el-input v-model="temp.cardNo" placeholder="請輸入卡號"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- rolesDialog -->
    <el-dialog title="請選擇欲新增的身份" :visible.sync="rolesDialog" width="500px">
      <div class="rolesBox">
        <el-button v-if="hasButton('addCaseUser')" type="primary" plain @click="handleRole('1')">長照身份</el-button>
        <el-button v-if="hasButton('addSelfPayUser')" type="primary" plain @click="handleRole('2')">白牌身份</el-button>
        <!-- <el-button
          v-if="hasButton('addBusUser')"
          type="primary"
          plain
          @click="handleRole('3')"
          >幸福巴士身份</el-button
        > -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import * as users from "@/api/users";
import * as busUsers from "@/api/busUsers";
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
    },
    // 是否擁有按鈕功能權限
    hasButton(domId) {
      return this.buttons.includes(domId);
    },
    // 獲取用戶基本資料
    getUserBasic() {
      const vm = this;
      users.getClient({ id: vm.$route.params.id }).then((res) => {
        vm.basicTemp = Object.assign({}, res.result); // copy obj
      });
    },

    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.temp.userId = vm.$route.params.id;
          busUsers.add(vm.temp).then(() => {
            vm.$alertT.fire({
              icon: "success",
              title: `用戶${vm.basicTemp.name} 成功新增巴士身份`,
            });
            vm.$router.push("/alluser/index");
          });
        } else {
          console.log("submit error");
        }
      });
    },
    handleFastSave(myRoute) {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.temp.userId = vm.$route.params.id;
          // vm.temp.reviewDate = moment(vm.temp.reviewDate).format('yyyy')
          console.log(vm.temp);
          busUsers.add(vm.temp).then(() => {
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
    // 替用戶添加身份
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
    this.getSpecialButtons();
    this.getUserBasic();
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
</style>
