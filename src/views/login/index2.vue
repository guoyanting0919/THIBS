<template>
  <div id="login">
    <div class="loginContainer">
      <!-- loginTitle -->
      <div class="loginTitle">
        <h1 class="cityTitle" @click="handleSuperLogin">
          尖石鄉公所
        </h1>
        <h5 class="cityDescrip">
          長照交通接送統一預約服務及管理系統
        </h5>
      </div>
      <!-- adminLogin -->
      <div class="adminLogin" v-if="isForget == 1">
        <h2 class="adminLoginTitle">管理者Login</h2>
        <h5 class="adminLoginDescrip">
          為了保障您的帳號安全，建議您最少於三個月變更一次密碼
        </h5>
      </div>
      <!-- forgetBox -->
      <div class="forgetBox" v-if="isForget == 2">
        <h2 class="forgetTitle">忘記密碼</h2>
        <h5 class="forgetDescrip">請準備好您的手機</h5>
      </div>
      <!-- letterBox -->
      <div class="letterBox" v-if="isForget == 3">
        <h2 class="letterTitle">已發送簡訊驗證碼到您的手機</h2>
        <h5 class="letterDescrip">手機號碼：0987-087-334</h5>
      </div>
      <!-- newPwBox -->
      <div class="newPwBox" v-if="isForget == 4">
        <h2 class="newPwTitle">設定登入密碼<span v-if="passwordOK">OK</span></h2>
        <div class="pwRoles">
          <p :class="{ OkRole: auth.MinLength }" class="pwRole">
            <i class="fas fa-check"></i>8碼以上(必要)
          </p>
          <p :class="{ OkRole: auth.UpperCase }" class="pwRole">
            <i class="fas fa-check"></i>大寫英文
          </p>
          <p :class="{ OkRole: auth.LowerCase }" class="pwRole">
            <i class="fas fa-check"></i>小寫英文
          </p>
          <p :class="{ OkRole: auth.Number }" class="pwRole">
            <i class="fas fa-check"></i>數字
          </p>
          <el-tooltip class="item" effect="dark" content="特殊符號包含 ~!@#$%^&*()" placement="bottom-end">
            <p :class="{ OkRole: auth.Mark }" class="pwRole">
              <i class="fas fa-check"></i>特殊符號
            </p>
          </el-tooltip>
          <p :class="{ OkRole: num >= 3 }" class="pwRole">
            <i class="fas fa-check"></i>4選3
          </p>
        </div>
      </div>
      <!-- loginBox -->
      <div class="loginBox" v-if="isForget == 1">
        <el-input placeholder="請輸入您的帳號" v-model="accountInput" clearable></el-input>
        <el-input placeholder="請輸入您的密碼" @keyup.enter.native="handleLogin" v-model="passwordInput" show-password></el-input>
        <el-button type="warning" :loading="btnLoading" @click="handleLogin" round>登入</el-button>
        <div @click="isForget = 2" class="forgetPw">忘記密碼?</div>
        <p style="color:white;text-align:center;margin-top:1rem">
          客服專線：02-8953-2253｜服務時間：週一至週五 09:00-12:00，13:30-19:00
          <br />©小驢行股份有限公司版權所有｜系統維護：小驢行股份有限公司
        </p>
      </div>
      <!-- forgetInput -->
      <div class="forgetInput" v-if="isForget == 2">
        <el-input placeholder="請輸入您的帳號" v-model="accountForgetInput" clearable></el-input>
        <el-button :loading="btnLoading" @click="sendCode" type="warning" round>下一步</el-button>
        <p class="fogetPwDesc">點選下一步，發送簡訊驗證碼到您的手機</p>
        <div @click="isForget = 1" class="backToLogin">返回登入</div>
      </div>
      <!-- letterInput -->
      <div class="letterInput" v-if="isForget == 3">
        <div class="codeBox">
          <el-input class="codeBoxInput" placeholder="請輸入驗證碼" v-model="codeInput" clearable></el-input>
          <el-button :loading="btnLoading" :disabled="resendCount !== 0" class="resendBtn" @click="sendCode" type="warning" round>
            重新送出
            <span v-if="resendCount !== 0">({{ resendCount }})</span>
          </el-button>
        </div>
        <el-button :loading="btnLoading" @click="valiCode" type="warning" round>下一步</el-button>
        <p class="fogetPwDesc">驗證碼輸入完成後點選下一步並設定新密碼</p>
        <div @click="isForget = 1" class="backToLogin">返回登入</div>
      </div>
      <!-- newPwInput -->
      <div class="newPwInput" v-if="isForget == 4">
        <el-input placeholder="請輸入您的新密碼" v-model="newPwInput" show-password></el-input>
        <el-input placeholder="請確認您的新密碼" v-model="newPwInputCheck" show-password></el-input>
        <el-button :loading="btnLoading" @click="newPwConfirm" type="warning" round>完成</el-button>
        <p class="fogetPwDesc">請依照步驟完成新密碼認證</p>
        <div @click="isForget = 1" class="backToLogin">返回登入</div>
      </div>
    </div>

    <!-- announcement -->
    <el-dialog v-if="annDataFilter" custom-class="annDialog" title="公告" :visible.sync="dialogAnnVisible" center>
      <div class="annCategory">
        <button @click="annCategory = '行車公告'" :class="{ activeAnn: annCategory === '行車公告' }" class="annCategoryBtn">
          行車公告
        </button>
        <button @click="annCategory = 'A單位公告'" :class="{ activeAnn: annCategory === 'A單位公告' }" class="annCategoryBtn">
          A單位公告
        </button>
      </div>
      <el-table :data="annDataFilter" style="margin-top: 1rem">
        <el-table-column property="title" label="公告事項"></el-table-column>
        <el-table-column property="date" label="公告日期" width="120"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- super login container -->
    <transition name="fade">
      <div v-if="superLogin" class="superLoginContainer">
        <div @click="loginBy(item.account,item.password)" v-for="item in accountData" :key="item.account" class="superLoginAccount">{{ item.name }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      /* account data */
      superLogin: false,
      accountData: [
        {
          name: "最高權限管理員",
          account: "System",
          password: "123456",
        },
        {
          name: "中邦管理員",
          account: "CBSD_ADMIN",
          password: "CBSD_ADMIN",
        },
        {
          name: "太豐",
          account: "df2233",
          password: "Df12345678",
        },
        {
          name: "卡通A單位",
          account: "CartoonsA",
          password: "CartoonsA",
        },
        {
          name: "蠟筆小新車行",
          account: "CrayonChanShin",
          password: "CrayonChanShin",
        },
        {
          name: "多拉A夢車行",
          account: "Doraemon",
          password: "Doraemon",
        },
      ],
      // announcement
      dialogAnnVisible: false,
      annCategory: "行車公告",
      annData: [
        {
          date: "2020-07-10",
          title: "109-07-10【額度控管留用首月】及【轉單功能啟用】",
          category: "A單位公告",
        },
        {
          date: "2020-04-30",
          title: "網頁及APP清除快取步驟說明",
          category: "行車公告",
        },
        {
          date: "2020-07-10",
          title: "109-07-10【轉單功能啟用】",
          category: "行車公告",
        },
        {
          date: "2020-07-13",
          title: "系統進行資安升級，調整期間(7/13 22:30-23:00)暫停使用",
          category: "行車公告",
        },
      ],

      // input
      isForget: 1,
      accountInput: "CBSD_ADMIN",
      passwordInput: "CBSD_ADMIN",
      accountForgetInput: "test",
      codeInput: "",
      newPwInput: "",
      newPwInputCheck: "",
      resendCount: 60,
      timmer: null,
      btnLoading: false,

      // 密碼驗證
      passwordOK: false,
      num: 0,
      auth: {
        MinLength: false,
        LowerCase: false,
        UpperCase: false,
        Number: false,
        Mark: false,
      },
    };
  },
  computed: {
    annDataFilter() {
      const vm = this;
      return vm.annData.filter((data) => {
        return data.category === vm.annCategory;
      });
    },
  },
  watch: {
    newPwInput(val) {
      this.num = Object.keys(this.auth).filter((key) => {
        this.auth[key] = this[`check${key}`](val);
        return key !== "MinLength" && this.auth[key];
      }).length;
      this.passwordOK = this.num >= 3 && this.auth.MinLength;
    },
  },
  methods: {
    // 密碼格式REG驗證
    checkMinLength(val) {
      //8碼以上
      return val.length >= 8;
    },
    checkLowerCase(val) {
      //小寫英文
      return /[a-z]/.test(val);
    },
    checkUpperCase(val) {
      //大寫英文
      return /[A-Z]/.test(val);
    },
    checkNumber(val) {
      //數字
      return /[0-9]/.test(val);
    },
    checkMark(val) {
      //特殊符號
      return /[~!@#$%^&*()]/.test(val);
    },

    loginBy(str, pas) {
      pas ? (this.passwordInput = pas) : (this.passwordInput = str);
      this.accountInput = str;
      this.handleLogin();
    },

    handleLogin() {
      const vm = this;
      vm.btnLoading = true;
      vm.$store
        .dispatch("Login", {
          username: vm.accountInput,
          password: vm.passwordInput,
        })
        .then(() => {
          vm.btnLoading = false;
          vm.$router.push({
            path: "/",
          });
        })
        .catch(() => {
          vm.btnLoading = false;
        });
    },

    /* 超級登入 */
    handleSuperLogin() {
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV === "development") this.superLogin = true;
    },

    // 傳送驗證碼
    sendCode() {
      clearInterval(this.timmer);
      const vm = this;
      //   vm.$store.dispatch("loadingHandler", true);
      vm.btnLoading = true;
      vm.$api
        .ForgetPw({
          step: 1,
          account: vm.accountForgetInput,
        })
        .then(() => {
          vm.isForget = 3;
          vm.resendCount = 60;
          vm.timmer = setInterval(() => {
            vm.resendCount--;
            if (vm.resendCount == 0) {
              clearInterval(vm.timmer);
            }
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          vm.btnLoading = false;
        });
    },

    //認證驗證碼是否正確
    valiCode() {
      const vm = this;
      vm.btnLoading = true;
      vm.$api
        .ForgetPw({
          step: 2,
          account: vm.accountForgetInput,
          checkCode: vm.codeInput,
        })
        .then(() => {
          this.isForget = 4;
          clearInterval(this.timmer);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          vm.btnLoading = false;
        });
    },

    // 修改密碼
    newPwConfirm() {
      const vm = this;
      if (vm.passwordOK && vm.newPwInput === vm.newPwInputCheck) {
        vm.btnLoading = true;
        vm.$api
          .ForgetPw({
            step: 3,
            account: vm.accountForgetInput,
            checkCode: vm.codeInput,
            newPassword: vm.newPwInput,
          })
          .then(() => {
            vm.$alertM.fire({
              icon: "success",
              title: `修改密碼成功!請重新登入!`,
            });
            vm.reset();
            vm.isForget = 1;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            vm.btnLoading = false;
          });
      } else if (!vm.passwordOK) {
        vm.$alertM.fire({
          icon: "error",
          title: `請確認密碼格式是否正確`,
        });
      } else {
        vm.$alertM.fire({
          icon: "error",
          title: `密碼欄位不相等`,
        });
      }
    },

    // 欄位清空
    reset() {
      const vm = this;
      vm.accountInput = "";
      vm.passwordInput = "";
      vm.accountForgetInput = "";
      vm.codeInput = "";
      vm.newPwInput = "";
      vm.newPwInputCheck = "";
    },
  },
};
</script>

<style lang="scss">
.superLoginContainer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: transparent;
  height: 50px;
  display: flex;
  padding: 0.25rem 2rem;
  align-items: center;
  transition: 0.5s;
}

.superLoginAccount {
  transition: 0.5s;
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: #dddddd;
  letter-spacing: 0.15rem;
  border: 1px dashed #dddddd;
  border-radius: 0.5rem;
  margin-right: 0.75rem;

  &:hover {
    box-shadow: 0 0 8px $--color-primary;
    text-shadow: 0 0 4px $--color-primary;
    border: 1px solid $--color-primary;
    transform: translateY(-4px);
  }
}
</style>
