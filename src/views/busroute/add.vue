<template>
  <div class="flex-column addCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleAdd" type="success" plain
          >確認新增</el-button
        >
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="新增巴士路線"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="路線設定"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="8">
              <el-form-item label="路線名稱" prop="name">
                <el-input
                  placeholder="請輸入路線名稱"
                  v-model="temp.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="路線名稱(英文)">
                <el-input
                  placeholder="請輸入路線名稱(英文)"
                  v-model="temp.lineCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="排序">
                <el-input-number
                  style="width: 100%"
                  v-model="temp.sort"
                  :min="0"
                  :max="999"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="24">
              <el-form-item label="行駛日">
                <el-checkbox-group v-model="checkedWeek">
                  <el-checkbox
                    v-for="day in dayList"
                    :label="day.value"
                    :key="day.value"
                    >{{ day.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <SubTitle title="站點設定"></SubTitle>
        <div class="sortContainer">
          <el-transfer
            filter-placeholder="請輸入站牌名"
            filterable
            style="width: 100%"
            :target-order="'push'"
            v-model="checkesStops"
            :data="list"
            @change="handleChange"
            :titles="['可用站牌', '已使用站牌']"
            :button-texts="['刪除', '新增']"
          ></el-transfer>
        </div>
        <div style="margin-top: 2rem">
          <SubTitle title="站點排序設定"></SubTitle>
          <draggable
            :list="sortData"
            v-if="sortData"
            class="draggableContainer"
            group="stop"
            :options="{
              animation: 300,
              group: 'people',
              scroll: true,
              scrollSpeed: 2000,
              scrollSensitivity: 10,
            }"
          >
            <transition-group>
              <div
                v-for="(stop, index) in sortData"
                :key="stop.key"
                class="graggableItem"
                :index="index"
              >
                <span class="stopIndex">
                  {{ index + 1 }}
                </span>
                <span class="stopName">
                  {{ stop.label }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import { mapGetters } from "vuex";
import * as busStations from "@/api/busStations";
import * as busStationLines from "@/api/busStationLines";
import draggable from "vuedraggable";
// import draggable from "@/vuedraggable";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
    draggable,
  },
  data() {
    return {
      checkesStops: [],
      myArray: [],
      sortData: [],
      dayList: [
        {
          value: 0,
          label: "星期日",
        },
        {
          value: 1,
          label: "星期一",
        },
        {
          value: 2,
          label: "星期二",
        },
        {
          value: 3,
          label: "星期三",
        },
        {
          value: 4,
          label: "星期四",
        },
        {
          value: 5,
          label: "星期五",
        },
        {
          value: 6,
          label: "星期六",
        },
      ],

      // 表單相關
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 999,
        key: undefined,
      },
      labelPosition: "top",
      checkedWeek: [],
      temp: {
        id: "",
        orgId: "",
        name: "",
        lineCode: "",
        sort: 0,
        workWeek: "",
        assignLineStations: [],
      },
      rules: {
        stationName: [{ required: true, message: "必填欄位", tigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
    sortList() {
      const vm = this;
      return vm.checkesStops.map((id) => {
        return vm.list.filter((s) => {
          return s.key === id;
        })[0];
      });
    },
  },
  methods: {
    // 獲取巴士站牌資料
    getList() {
      const vm = this;
      vm.listLoading = true;
      busStations.load(vm.listQuery).then((res) => {
        console.log(res.data);
        res.data.forEach((s) => {
          vm.list.push({
            key: s.id,
            label: s.stationName,
          });
        });
        vm.total = res.count;
        vm.listLoading = false;
      });
    },
    handleChange() {
      this.sortData = this.sortList;
    },
    handleAdd() {
      const vm = this;
      vm.temp.workWeek = vm.checkedWeek.join(",");
      vm.temp.orgId = vm.defaultorgid;
      vm.temp.assignLineStations = [];
      vm.sortData.forEach((stop) => {
        vm.temp.assignLineStations.push(stop.key);
      });
      console.log(vm.temp);
      busStationLines.add(vm.temp).then(() => {
        vm.$alertT.fire({
          icon: "success",
          title: `路線${vm.temp.name} 新增成功`,
        });
        vm.$router.push("/busroute/index");
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.sortContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  //   background: lightblue;
  width: 100%;
}

.draggableContainer {
  // overflow: auto;
  // overflow-y: hidden;
  // // height: 200px;
  // width: 100%;

  span {
    height: 200px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}
.graggableItem {
  cursor: move;
  display: flex;
  height: 95%;
  box-sizing: border-box;
  flex-direction: column;
  background: $--color-primary;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 50px;
  justify-content: center;
  align-items: center;
  position: relative;

  &:first-child::before {
    position: absolute;
    content: "起";
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 200px;
    background: #000;
    top: -8px;
    left: -8px;
  }
  &:last-child::before {
    position: absolute;
    content: "終";
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 200px;
    background: #000;
    top: -8px;
    left: -8px;
  }
}
.stopIndex {
  height: 20% !important;
  display: block;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.stopName {
  -webkit-writing-mode: vertical-lr;
  writing-mode: vertical-lr;
  display: block;
  justify-content: flex-start;
  align-items: center;
}
</style>
