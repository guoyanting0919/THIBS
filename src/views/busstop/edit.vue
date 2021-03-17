<template>
  <div class="flex-column addCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleSave" type="success" plain
          >儲存</el-button
        >
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="新增巴士站牌"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="站點設定"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="站點名稱(中文)" prop="stationName">
                <el-input
                  placeholder="請輸入站點名稱(中文)"
                  v-model="temp.stationName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="站點名稱(英文)">
                <el-input
                  placeholder="請輸入站點名稱(英文)"
                  v-model="temp.stationCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="站牌經度">
                <el-input
                  v-model="temp.lon"
                  placeholder="請輸入站牌經度"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="站牌緯度">
                <el-input
                  v-model="temp.lat"
                  placeholder="請輸入站牌緯度"
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
import * as busStations from "@/api/busStations";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      // 表單相關
      labelPosition: "top",
      temp: {
        id: "",
        stationName: "",
        stationCode: "",
        lon: null,
        lat: null,
      },
      rules: {
        stationName: [{ required: true, message: "必填欄位", tigger: "blur" }],
      },
    };
  },
  methods: {
    getList() {
      const vm = this;
      busStations.get({ id: vm.$route.params.id }).then((res) => {
        vm.temp = Object.assign({}, res.result); // copy obj
      });
    },
    handleSave() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          busStations.update(vm.temp).then(() => {
            vm.$alertT.fire({
              icon: "success",
              title: `站牌${vm.temp.stationName} 修改成功`,
            });
            vm.$router.push("/busstop/index");
          });
        } else {
          console.log("submit error");
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
</style>
