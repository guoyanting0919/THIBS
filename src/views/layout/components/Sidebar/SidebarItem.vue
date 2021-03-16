<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="!item.children || item.children.length <= 0 || item.alwaysShow">
      <el-menu-item :index="item.path" :class="{ 'submenu-title-noDropdown': !isNest, dark: !themeStatus,'is-active': customActiveRoute(item), }">
        <i :class="`iconfont icon-${item.meta.icon}`" :style="{ color: themeStatus ? '' : '#fff' }"></i>
        <span v-if="item.meta && item.meta.title" slot="title">{{
          item.meta.title
        }}</span>
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.path" :class="{ dark: !themeStatus }">
      <template slot="title">
        <i :class="`iconfont icon-${item.meta.icon}`" :style="{ color: themeStatus ? '' : '#fff' }"></i>
        <span :style="{ color: themeStatus ? '' : '#fff' }" v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
      </template>

      <template v-for="child in routes">
        <template v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length > 0" :item="child" :key="child.path"></sidebar-item>
          <el-menu-item :class="{
              dark: !themeStatus,
              'is-active': customActiveRoute(child),
            }" v-else :key="child.name" :index="child.path">
            <i :class="{
                dark: !themeStatus,
                [`iconfont icon-${child.meta.icon}`]: true,
              }" :style="{ color: themeStatus ? '' : '#fff' }"></i>
            <span :style="{ color: themeStatus ? '' : '#fff' }" v-if="child.meta && child.meta.title" slot="title">{{ child.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",
  props: {
    // route配置json
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      routes: [],
    };
  },

  computed: {
    ...mapGetters(["themeStatus"]),
  },
  watch: {
    item() {
      this.groupRouters();
    },
  },
  created() {
    this.groupRouters();
  },
  methods: {
    /* custom active route */
    customActiveRoute(child) {
      const vm = this;
      return vm.$route.path?.split("/")[1] === child.path?.split("/")[1];
    },
    groupRouters() {
      this.routes =
        this.item.children &&
        this.item.children.length > 0 &&
        this.item.children.sort((a, b) => a.meta.sortNo - b.meta.sortNo);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-wrapper .iconfont {
  margin-right: 5px;
  font-size: 16px;
  vertical-align: middle;
}
.el-menu-item:focus.dark {
  background: $--color-primary-dark-1;
}
.el-menu-item:hover.dark {
  background: $--color-primary-dark-2;
}
.dark.el-menu-item {
  color: #ffffff;
  background: $--color-primary-dark-2;

  &:hover {
    background: $--color-primary-dark-2;
  }

  &:focus {
    background: $--color-primary-dark-3;
  }
}

.submenu-title-noDropdown.dark {
  background: $--color-primary;
}

::v-deep .dark .el-submenu__title:hover {
  background: $--color-primary-dark-2 !important;
}

::v-deep .dark .is-active {
  background: $--color-primary-dark-3 !important;
}

::v-deep .dark .el-submenu__title {
  background: $--color-primary !important;
}
</style>
