<template>
  <div id="login">
    <div class="loginContainer">
      <div class="filterBox">
        <!-- loginTitle -->
        <div class="loginTitle">
          <h1 class="cityTitle">新北市政府</h1>
          <h5 class="cityDescrip">長照交通接送統一預約服務及管理系統</h5>
        </div>
        <!-- adminLogin -->
        <div class="adminLogin" v-if="isForget==1">
          <h2 class="adminLoginTitle">管理者Login</h2>
          <h5 class="adminLoginDescrip">為了保障您的帳號安全，建議您最少於三個月變更一次密碼</h5>
        </div>
        <!-- loginBox -->
        <div class="loginBox" v-if="isForget==1">
          <el-input placeholder="請輸入您的帳號" v-model="accountInput" clearable></el-input>
          <el-input
            placeholder="請輸入您的密碼"
            @keyup.enter.native="handleLogin"
            v-model="passwordInput"
            show-password
          ></el-input>
          <el-button type="success" :loading="btnLoading" @click="handleLogin" round>登入</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // input
      isForget: 1,
      accountInput: "System",
      passwordInput: "123456",
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
        minLength: false,
        lowerCase: false,
        upperCase: false,
        number: false,
        mark: false,
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
      this.num = 0;
      this.auth.minLength = this.checkMinLength(val);
      this.auth.lowerCase = this.checkLowerCase(val);
      this.auth.upperCase = this.checkUpperCase(val);
      this.auth.number = this.checkNumber(val);
      this.auth.mark = this.checkMark(val);
      if (this.auth.lowerCase) this.num++;
      if (this.auth.upperCase) this.num++;
      if (this.auth.number) this.num++;
      if (this.auth.mark) this.num++;
      if (this.auth.minLength && this.num >= 3) this.passwordOK = true;
      else this.passwordOK = false;
    },
  },
  methods: {
    // 獲取用戶信息
    getUserInfoByToken() {
      const vm = this;
      vm.$api
        .GetUserInfo()
        .then((res) => {
          if (res.code == 200) {
            vm.getRouterTree(res.token);
          } else {
            vm.$alertM.fire({
              icon: "error",
              title: res.message,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          //   vm.$store.dispatch("loadingHandler", false);
        });
    },

    // 透過token獲取路由
    getRouterTree() {
      const vm = this;
      vm.$api.GetRouterTree().then((res) => {
        // console.log(res);
        let routerTree = JSON.stringify(res.result);
        window.localStorage.setItem("NTPC__Router", routerTree);
        vm.$router.push("/");
      });
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
          vm.$router.push({
            path: "/",
          });
          // vm.btnLoading = false;
        })
        .catch(() => {
          vm.btnLoading = false;
        });
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
  },
};
</script>

<style lang='scss'>
</style>