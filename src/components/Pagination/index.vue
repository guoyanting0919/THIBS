<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layoutData"
      :page-sizes="[10, 20, 30, 40, 50, 100, 999]"
      :total="total"
      :small="isSmall"
      :pager-count="5"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scrollTo";
import ResizeMixin from "./ResizeHandler";

export default {
  name: "Pagination",
  mixins: [ResizeMixin],
  data() {
    return {
      isSmall: false,
      layoutData: this.layout,
      defaultLayout: " prev, pager, next ,jumper",
    };
  },
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next,jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    device() {
      return this.$store.state.app.device;
    },
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
  },
  mounted() {
    // console.log(this.device);
    if (this.device === "mobile") {
      this.isSmall = true;
      // console.log(this.$props.layout, this.layoutData);
      // this.$props.layout = "total, sizes, prev, pager, next,";
      this.layoutData = this.defaultLayout;
    }
  },
};
</script> 

<style scoped>
.pagination-container {
  background: #fff;
  padding-left: 15px;
  padding-right: 15px;
}
.pagination-container.hidden {
  display: none;
}
</style>
