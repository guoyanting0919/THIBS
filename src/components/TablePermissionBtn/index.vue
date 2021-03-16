<template>
  <div class="filter-items" style="display:flex;">
    <template v-for="btn of buttons">
      <el-button
        v-if="btn.attr == 'true'"
        :type="btn.class"
        :size="size"
        v-bind:key="btn.Id"
        class="filter-item"
        @click="$emit('btn-event', btn.domId)"
      >
        <!-- <i :class="`iconfont icon-${btn.icon}`"></i> -->
        {{ btn.name }}
      </el-button>
    </template>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波紋指令
// import JsonExcel from "vue-json-excel";
export default {
  name: "permission-btn",
  components: {},
  props: {
    moduleName: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "",
    },
  },
  data() {
    // todo:兼容layui的樣式、圖標
    return {
      excelInfo: {
        json_fields: {},
        excelName: "",
        data: [],
      },
      excelLoading: false,
      buttons: [],
    };
  },
  computed: {},
  directives: {
    waves,
  },
  mounted() {
    var route = this.$route;
    // console.log(route);
    var elements = route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    // console.log(this.buttons);
  },
  methods: {
    fetchData() {
      if (this.excelLoading) return;
      this.excelLoading = true;
      this.$emit("btn-event", "btnExport", (val) => {
        this.excelInfo = { ...val };
      });
      return this.excelInfo.data;
    },
    finishDownload() {
      this.excelLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
