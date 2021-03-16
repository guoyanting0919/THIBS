<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="logo" style="height: 50px">
      <!-- <img class="user-avatar" :src="logo" /> -->
      <div class="user-avatar-text">LOGO</div>
    </div>
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <div class="breads">
      <!-- breads -->
      <el-breadcrumb separator="/" class="breadItems">
        <el-breadcrumb-item
          class="breadLink"
          :class="{ dark: !themeStatus }"
          v-for="(item, index) in $route.matched"
          :key="index"
        >
          <router-link
            :class="{ dark: !themeStatus }"
            :to="item.path"
            class="breadLink"
            >{{ item.meta.title || item.name }}</router-link
          >
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown
      class="avatar-container"
      @command="handleCommand"
      trigger="click"
    >
      <div class="avatar-wrapper">
        歡迎您，{{ name }}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item command="handleGoProfile">
          <span>個人中心</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="state">
          <span>
            CBSD_ADMIN
            <el-switch
              @change="hadleChange"
              style="margin-left: 5px"
              v-model="cbsdAdmin"
            />
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span>
            切換主題
            <el-switch
              :active-value="1"
              :inactive-value="0"
              style="margin-left: 5px"
              v-model="theme"
            />
          </span>
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided>
          <span>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Hamburger from "@/components/Hamburger";
import logo from "@/assets/images/尖石logo.png";

export default {
  data: function () {
    return {
      logo: logo,
      theme: 1,
      cbsdAdmin: true,
      state: window.localStorage.getItem("CBSD_ADMIN"),
    };
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "isIdentityAuth", "name", "themeStatus"]),
  },
  watch: {
    theme() {
      this.toggleClass(document.body, "custom-theme");
    },
  },
  mounted() {
    this.theme = Number(this.themeStatus);
    this.toggleClass(document.body, "custom-theme");
    // console.log(this.$route.matched);
  },
  methods: {
    ...mapActions(["signOutOidc", "saveTheme"]),
    toggleClass(element, className) {
      if (!element || !className) {
        return;
      }
      let classString = element.className;
      const nameIndex = classString.indexOf(className);
      if (nameIndex === -1) {
        classString += "" + className;
      } else {
        classString =
          classString.substr(0, nameIndex) +
          classString.substr(nameIndex + className.length);
      }
      element.className = this.theme === 1 ? classString : "";
      this.saveTheme(this.theme);
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      if (this.isIdentityAuth) {
        this.signOutOidc();
      } else {
        this.$store.dispatch("LogOut").then(() => {
          location.reload(); // 為了重新實例化vue-router對象 避免bug
        });
      }
    },
    handleGoProfile() {
      this.$router.push("/profile");
    },
    handleCommand(name) {
      if (!name) return;
      this[name]();
    },
    hadleChange() {
      if (window.localStorage.getItem("CBSD_ADMIN")) {
        window.localStorage.removeItem("CBSD_ADMIN");
        location.reload();
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.breadLink.dark {
  color: #ffffff;

  .el-breadcrumb__inner {
    color: #ffffff !important;

    a {
      color: #ffffff !important;
    }
  }
}
</style>
<style lang="scss">
@import "~@/assets/css/basic/_mixin.scss";
.navbar {
  background: $--color-primary;
  .hamburger-container {
    line-height: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  .avatar-container {
    height: 50px;
    display: block;
    line-height: 50px;
    margin-left: auto;
    margin-right: 4px;
    order: 10;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      .el-icon-caret-bottom {
        font-size: 16px;
      }
    }
  }
  .logo {
    width: 200px;
    text-align: center;

    @include rwd($md) {
      order: 1;
      width: 200px;
      margin-left: auto;
    }
    .user-avatar {
      width: 200px;
      height: 50px;
    }

    .user-avatar-text {
      width: 200px;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .hamburger-container {
    color: white;
  }
  .avatar-container {
    color: white;
  }
  .logo {
    color: white;
  }
}

/* 淺色navbar */
.custom-theme {
  #app {
    .sidebar-container .nest-menu .el-submenu > .el-submenu__title,
    .sidebar-container .el-submenu .el-menu-item {
      background-color: $--color-primary-light-9 !important;
      &:hover {
        background-color: $--color-primary-light-8 !important;
      }
    }
  }
  .el-submenu__title,
  .submenu-title-noDropdown {
    font-size: 0.95rem;
    // font-weight: 700;
  }
  .el-submenu__title:hover,
  .el-menu-item:hover {
    background-color: $--color-primary-light-8 !important;
  }
  .navbar {
    border-bottom: 0 !important;
    display: flex;
    // justify-content: center;
    background-color: #fff;
    box-shadow: 0 0 5px #222;

    .hamburger-container {
      color: #6b655c;
    }
    .avatar-container {
      color: $--color-primary;
    }
    .logo {
      color: $--color-primary;
    }
  }
}
</style>
