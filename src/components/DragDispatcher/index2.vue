<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <i style="margin-left:.5rem;font-size:14px" :style="`color:${statusMapping[2]}`" class="iconfont icon-member">已排班</i>
        <i style="margin-left:.5rem;font-size:14px" :style="`color:${statusMapping[3]}`" class="iconfont icon-member">已抵達</i>
        <i style="margin-left:.5rem;font-size:14px" :style="`color:${statusMapping[4]}`" class="iconfont icon-member">客上</i>
        <i style="margin-left:.5rem;font-size:14px" :style="`color:${statusMapping[5]}`" class="iconfont icon-member">完成</i>

        <!-- 條件篩選 -->
        <el-date-picker value-format="yyyy-MM-dd" @change="getList" placeholder="選擇日期" size="mini" style="width: 200px; margin: 0 " v-model="listQuery.StartDate" type="date">
        </el-date-picker>
        <!-- <el-button size="mini">123</el-button> -->
        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>

      </div>
    </sticky>
    <div class="dragDispatcherContainer">
      <!-- <div id="map" ref="map" style="width: 0%; height: 0%"></div> -->
      <div class="orderContainer customScrollBar" v-if="list.length!=0">
        <div v-for="item in list" :key="item.despatchNo" draggable="true" class="orderCardL" @dragstart="handleDargOrder(item)">
          <div class="orderCardTitle" v-if="list">
            <p>{{ item.data[0].carCategoryName }}</p>
            <p v-if="item.canShared">可共乘</p>
            <p v-else>不可共乘</p>
            <p style="margin-right:auto">{{ item.data[0].familyWith }}人陪同</p>
            <el-button @click="getOrder(item)" type="success" size="mini" style="padding:4px">編輯</el-button>
          </div>
          <div class="orderCardMain">
            <div class="orderInfo">
              <p class="orderInfoName">{{ item.data[0].name }}</p>
              <!-- <p style="margin: 0">聯絡電話 : {{ item.data[0].noticePhone }}</p> -->
            </div>
            <p class="orderTime">
              {{ item.data[0].reserveDate | dateFilter }}
            </p>
            <div class="orderAddr">
              <i class="iconfont icon-circle"></i>
              <i class="iconfont icon-Vector10"></i>
              <p class="startAddr">
                {{ item.data[0].fromAddr }}
              </p>
              <p class="endAddr">{{ item.data[0].toAddr }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="outsideContainer" :style='dragContainerWidth'>
        <div class="driverTimeCard">
          <p>車輛 <i class="iconfont icon-right1"></i></p>
          <p style="margin-top: 0.5rem">
            時間 <i class="iconfont icon-right1 iconRoate"></i>
          </p>
        </div>

        <!-- driver fake box -->
        <div class="driverFakeBox">
          <div class="driverCard" v-for="(car) in carList" :key="car.id">
            <div class="driverCardTitle">
              <div class="driverImg"></div>
              <p class="driverName">{{ car.carNo }}({{ car.driverName }})</p>
            </div>
            <p class="carInfo">座位:{{ car.seatNum }} | 輪椅:{{ car.wheelchairNum }} | {{ car.carCategoryName }}</p>
          </div>
        </div>

        <!-- time fake box -->
        <div class="timeFakeBox">
          <div class="timeCard" v-for="item in timelist" :key="item">
            {{ item }}
          </div>
        </div>

        <div class="distatchContainer" @dragover.prevent>
          <div class="driverBox">
            <!-- 司機迴圈 -->
            <div @mouseenter="driverMouseUp" @dragend="driverDragleave" :class="{ active: isActive }" class="driver" draggable="false" v-for="car in carList" :key="car.id">
              <!-- <div class="driverCard">司機</div> -->
              <!-- 時間迴圈 -->
              <div @mouseenter="driverMouseUp" @dragover.self="showShadow" @dragleave.self="clearShadow" @dragend.self="clearShadow" @drop="handleRoster($event, car)" v-for="(time,key2) in car.timeList" :key="key2" class="timeBox">

                <div v-if="car.readyTime.includes(key2)" class="dispatchCardContainer">
                  <div v-for="(item, index) in car.timeList[key2]" :key="index" @mouseenter.stop="test2(item)" @dragend="test2()" @mouseleave="test2()" @drop.stop="handleCarPool(item)" class="dispatchCard" draggable="false" :style="`height:${item.totalTime * 9 }px;margin-left:${(item.flag-1) * 33}%`">
                    <p class="cardHeader">
                      <span class="totalTime">
                        {{item.totalTime}}分鐘
                      </span>
                      <i v-if="checkOrderStatus(item)" @click="handleChangeDC(item)" class='iconfont icon-driver'></i>
                      <i v-if="checkOrderStatus(item)" @click="handleCancelDispatch(item)" class='iconfont icon-Cross'></i>
                    </p>
                    <div class="dispatchPassengers">
                      <p @click="getOrder(item,idx)" class="passengerName" v-for="(o,idx) in item.data" :key='o.id'>
                        <i :style="`color:${statusMapping[o.status]}`" class="iconfont icon-member"></i> {{o.name}}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog -->
      <!-- eidt dialog -->
      <EditDialog :tempObj="temp" :editDialogProp="editDialog" :carCategorysList="carCategorysList" @handleEdit="handleEdit" @handleClose="handleClose"></EditDialog>

      <!-- change dialog -->
      <el-dialog title="變更司機車輛" :visible.sync="changeDialog" width="800px">
        <div class="changeDialogBody">
          <el-form :label-position="labelPosition" label-width="200px" :model="orderTemp" ref="form">
            <el-row :gutter="16">
              <el-col :sm="12" :md="12">
                <el-form-item label="司機">
                  <el-select v-model="orderTemp.driverInfoId" filterable placeholder="選擇司機" style="width: 100%">
                    <el-option v-for="driver in driverList" :key="driver.id" :label="driver.name" :value="driver.id">
                      {{ driver.name }} / {{ driver.phone }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :sm="12" :md="12">
                <el-form-item label="車輛">
                  <el-select v-model="orderTemp.carId" filterable placeholder="選擇車輛" style="width: 100%">
                    <el-option v-for="car in changeCarFilter()" :key="car.id" :label="`${car.carCategoryName || '一般車'} / ${
                      car.seatNum
                    }人座 / ${car.carNo}`" :value="car.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmChange()">確 定</el-button>
        </span>
      </el-dialog>

      <!-- dispatch dialog -->
      <el-dialog title="請選擇預約乘車個案" :visible.sync="coDialog" width="400px">
        <div class="coDialogBody">
          <el-select style="width: 300px" v-model="dispatchCaseUser" filterable size="mini" placeholder="選擇預約乘車個案">
            <el-option v-for="user in caseUserList" :key="user.caseUserId" :label="`${user.name}/${user.caseUserNo}`" :value="user.userId">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="coDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleDispatch">確 定</el-button>
        </span>
      </el-dialog>

      <!-- noOrgDialog dialog -->
      <el-dialog title="新訂單(尚未接單)" :visible.sync="noOrgDialog" width="910px">
        <div class="noOrgDialogBody">
          <p style="color: red; font-size: 14px; width: 100%; text-align: center" v-if="newOrderList.length == 0">
            暫無新訂單
          </p>
          <transition-group name="fade-transform" mode="out-in" class="cardContainer">
            <OrderCard v-for="item in newOrderList" :key="item.id" :order="item" @handleReceive='handleReceive' @handleTrans='handleTrans' @handleCancle='handleCancle'></OrderCard>
          </transition-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="noOrgDialog = false">確 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import IScroll from "iscroll/build/iscroll-probe";

import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import OrderCard from "@/components/OrderCardCase";
import EditDialog from "@/components/Dialog/editCaseUserDespatch";

import * as orderCaseUser from "@/api/orderCaseUser";
import * as cars from "@/api/cars";
import * as drivers from "@/api/drivers";
import * as category from "@/api/categorys";
import * as dispatchs from "@/api/dispatchs";
import * as caseUsers from "@/api/caseUsers";

export default {
  props: {
    start: {
      //開始時間
      type: String,
      default: "05:00",
    },
    end: {
      //結束時間
      type: String,
      default: "23:45",
    },
    step: {
      //間隔時間(分)
      type: Number,
      default: 10,
    },
  },
  components: {
    EditDialog,
    Sticky,
    permissionBtn,
    OrderCard,
  },
  data() {
    return {
      /* 無組織訂單 */
      newOrderList: [],
      noOrgDialog: false,

      /* 司機列表 */
      driverList: [],

      /* 車輛列表 */
      carList: [],

      /* 車輛類別 */
      carCategorysList: [],

      /* 表單相關 */
      labelPosition: "top",

      /* order temp */
      orderTemp: "",
      changeOrder: "",
      changeDialog: false,

      /* edit temp */
      temp: {},
      editDialog: false,

      /* 預約訂單 */
      coDialog: false,
      caseUserList: [],
      dispatchCaseUser: "",

      /* statusMapping */
      statusMapping: [
        "",
        "",
        "#47c791",
        "#2f54eb",
        "#7653c7",
        "#7b8382",
        "#f5222d",
      ],
      canDrag: true,
      scroll: null,
      dragData: "",
      dispatchData: "",
      isActive: false,
      ele: document.querySelectorAll(".distatchContainer")[0],
      pos: { top: 0, left: 0, x: 0, y: 0 },
      isDown: false,
      realDispatchList: [],
      sensitivity: 1,

      //派遣訂單
      list: [],
      readyList: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 999,
        key: undefined,
        StartDate: null,
        EndDate: null,
      },
    };
  },
  filters: {
    dateFilter(date) {
      let day = moment(date).format("yyyy-MM-DD");
      let time = moment(date).format("HH:mm");
      return `${day} ${time}`;
    },
  },
  computed: {
    timelist() {
      let ctime = moment().format("YYYY-MM-DD") + " " + this.start;
      let arr = [moment(ctime).format("HH:mm")];
      while (
        moment(ctime).isBefore(moment().format("YYYY-MM-DD") + " " + this.end)
      ) {
        ctime = moment(ctime).add(this.step, "minutes");
        arr.push(moment(ctime).format("HH:mm"));
      }
      return arr;
    },

    dragContainerWidth() {
      return {
        width: this.list.length == 0 ? "100%" : "calc(100% - 286px - 16px)",
      };
    },
  },
  methods: {
    /* 獲取派遣訂單 */
    async getList() {
      const vm = this;
      vm.listQuery.EndDate = vm.listQuery.StartDate;
      await orderCaseUser.loadDespatch(vm.listQuery).then((res) => {
        vm.list = res.data.filter((d) => {
          return d.data[0].status == 1;
        });

        vm.readyList = res.data.filter((d) => {
          return d.data[0].status !== 1;
        });

        vm.readyList = vm.readyList.map((l) => {
          if (l.data.length > 1) {
            let startTime = l.data[0].reserveDate;
            for (let index = 1; index < l.data.length; index++) {
              if (moment(l.data[index].reserveDate).isAfter(startTime)) {
                console.log("a");
              } else {
                startTime = l.data[index].reserveDate;
              }
            }
            l.time = moment(startTime).format("HH:mm");
            return l;
            // console.log(arr);
          } else {
            l.time = moment(l.data[0].reserveDate).format("HH:mm");
            return l;
          }
        });
        this.getCarList();
        vm.total = res.count;
      });
    },

    /* 獲取無組織訂單 */
    async getListNoOrg() {
      const vm = this;
      await orderCaseUser.loadNoOrg().then((res) => {
        vm.newOrderList = res.result;
        if (vm.newOrderList.length > 0) {
          vm.noOrgDialog = true;
        } else {
          vm.noOrgDialog = false;
        }
      });
    },

    /* 獲取所有司機 */
    getDriverList() {
      const vm = this;
      drivers.load({ limit: 999, page: 1 }).then((res) => {
        vm.driverList = res.data;
      });
    },

    /* 獲取所有車輛 */
    getCarList() {
      const vm = this;
      //FIXME:車輛太多
      cars.load({ limit: 99, page: 1 }).then((res) => {
        vm.carList = res.data;
        vm.carList.forEach((item) => {
          item.timeList = {};
          vm.timelist.forEach((t) => {
            item.timeList[t] = vm.readyList.filter((rL) => {
              return rL.carId === item.id && rL.time === t;
            });
          });

          item.readyList = vm.readyList.filter((rL) => rL.carId === item.id);

          item.readyTime = [];
          vm.readyList.forEach((rL) => {
            if (rL.carId === item.id) {
              item.readyTime.push(rL.time);
            } else {
              return false;
            }
          });
        });
      });
    },

    /* 獲取所有車輛類型 */
    getCarCategorys() {
      const vm = this;
      let query = {
        page: 1,
        limit: 20,
        TypeId: "SYS_CAR",
      };
      category.getSimpleList(query).then((res) => {
        vm.carCategorysList = res.result.filter((car) => {
          return (
            car.value === "SYS_CAR_GENERAL" || car.value === "SYS_CAR_WEAL"
          );
        });
      });
    },

    /* 獲取長照用戶資料 */
    getCaseUserList() {
      const vm = this;
      caseUsers.load({ limit: 9999, page: 1 }).then((res) => {
        vm.caseUserList = res.data;
      });
    },

    /* 拖曳區塊設置 */
    dragSetting() {
      const vm = this;
      this.scroll = new IScroll(".distatchContainer", {
        mouseWheel: true, // 允许鼠标滚轮
        scrollX: true,
        scrollY: true,
        probeType: 3,
        momentum: false,
      });

      this.scroll.on("scroll", function () {
        if (vm.canDrag) {
          //   console.log(document.querySelectorAll(".timeFakeBox")[0], this.y);
          document.querySelectorAll(".timeFakeBox")[0].style.transform =
            "translate(0px," + this.y + "px) ";
          document.querySelectorAll(".driverFakeBox")[0].style.transform =
            "translate(" + this.x + "px,0px) ";
        } else {
          return;
        }
      });
    },

    /* 預約訂車 */
    handleDispatch() {
      const vm = this;
      if (vm.dispatchCaseUser == "") {
        vm.$alertT.fire({
          icon: "error",
          title: "請選擇預約乘車個案",
        });
      } else {
        let routeParams = vm.caseUserList.filter((u) => {
          return u.userId === vm.dispatchCaseUser;
        })[0];
        vm.coDialog = false;
        vm.$router.push(
          `/dragdispatcher/dispatch/${routeParams.userId}-${routeParams.caseUserId}`
        );
      }
    },

    /* 獲取單筆訂單資料 */
    getOrder(item, idx = 0) {
      const vm = this;
      const id = item.data[idx].id;
      vm.editDialog = true;
      orderCaseUser.get({ id }).then((res) => {
        console.log(res);
        vm.temp = Object.assign({}, res.result); // copy obj
        let fromRemark = ["醫院診所", "洗腎中心", "復健診所", "住家"].includes(
          vm.temp.fromAddrRemark
        )
          ? ""
          : vm.temp.fromAddrRemark;
        this.$set(vm.temp, "fromRemark", fromRemark);

        let toRemark = ["醫院診所", "洗腎中心", "復健診所", "住家"].includes(
          vm.temp.toAddrRemark
        )
          ? ""
          : vm.temp.toAddrRemark;
        this.$set(vm.temp, "toRemark", toRemark);

        vm.temp.toAddrRemark = [
          "醫院診所",
          "洗腎中心",
          "復健診所",
          "住家",
        ].includes(vm.temp.toAddrRemark)
          ? vm.temp.toAddrRemark
          : "其他";
        vm.temp.fromAddrRemark = [
          "醫院診所",
          "洗腎中心",
          "復健診所",
          "住家",
        ].includes(vm.temp.fromAddrRemark)
          ? vm.temp.fromAddrRemark
          : "其他";
        this.$set(vm.temp, "date", res.result.reserveDate.split(" ")[0]);
        this.$set(
          vm.temp,
          "time",
          res.result.reserveDate.split(" ")[1].slice(0, 5)
        );
      });
    },

    /* 編輯訂單 */
    handleEdit(data) {
      console.log(data);
      const vm = this;
      data.toAddrRemark =
        data.toAddrRemark === "其他" ? data.toRemark : data.toAddrRemark;
      data.fromAddrRemark =
        data.fromAddrRemark === "其他" ? data.fromRemark : data.fromAddrRemark;
      data.reserveDate = `${data.date} ${data.time}`;
      data.carCategoryName = vm.carCategorysList.filter((i) => {
        return i.value === data.carCategoryId;
      })[0].label;
      orderCaseUser.update(data).then((res) => {
        vm.editDialog = false;
        vm.$alertT.fire({
          icon: res.code == 200 ? "success" : "error",
          title: res.code == 200 ? `訂單${data.orderNo}編輯成功` : res.message,
        });
        vm.getList();
      });
    },

    /* 關閉編輯燈箱 */
    handleClose(status) {
      this.editDialog = status;
    },

    /* 排班 */
    handleRoster(e, car) {
      const vm = this;
      this.isActive = true;
      e.target.style.background = "#fff";

      let data = {
        orderNosOrDespatchNos: [vm.orderTemp.despatchNo],
        carId: car.id,
        driverInfoName: car.driverName,
        carNo: car.carNo,
        driverInfoId: vm.driverList.filter((d) => d.name === car.driverName)[0]
          .id,
      };

      dispatchs.addOrUpdateShare(data).then((res) => {
        console.log(res);
        if (res.code === 200) {
          vm.$alertT.fire({
            icon: "success",
            title: res.message,
          });
        } else {
          vm.$alertM.fire({
            icon: "error",
            title: res.message,
          });
        }
        vm.getList();
      });
    },

    /* 取消排班 */
    handleCancelDispatch(item) {
      console.log(item);
      const vm = this;

      vm.$swal({
        title: "取消提示",
        text: `確認取消排班?`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d63737",
        confirmButtonColor: "#227294",
        confirmButtonText: "確定取消",
        cancelButtonText: "返回",
      }).then((result) => {
        if (result.value) {
          dispatchs.cancel([item.despatchNo]).then((res) => {
            vm.$alertT.fire({
              icon: "success",
              title: res.message,
            });
            vm.getList();
          });
        } else {
          // vm.$alertT.fire({
          //   icon: "info",
          //   title: `已取消操作`,
          // });
          console.log("d");
        }
      });
    },

    /* 檢查派遣單裡的訂單狀態是否皆為已排班 若是則顯示變更司機車輛與取消訂單 */
    checkOrderStatus(item) {
      return item.data.every((o) => o.status == 2);
    },

    /* 變更司機車輛 */
    handleChangeDC(item) {
      const vm = this;
      console.log(item);
      vm.changeOrder = item.data;
      vm.orderTemp = Object.assign({}, item); // copy obj
      vm.$nextTick(() => {
        vm.changeDialog = true;
      });
    },

    /* 變更司機車輛檢核 */
    changeCarFilter() {
      let data = this.carList;
      let checkedRowsData = this.changeOrder || [];
      return data.filter((item) => {
        return [
          () => {
            // 若 車輛 為 不可派發 (status === 0) ，則不能選
            if (item.status === 0) {
              return false;
            }
            // 若 車輛 為 可派發 (status !== 0) ，則可以選
            else {
              return true;
            }
          },
          () => {
            // 若 有某一張定單 車種 不等於 一般車，那只能是 福祉車
            if (checkedRowsData.some((el) => el.carCategoryName !== "一般車")) {
              return item.carCategoryName !== "一般車";
            }
            // 若 有某一張定單 車種 等於 一般車，那可以是 一般車、福祉車
            else {
              return true; // 車種只有 一般車、福祉車 所以都通過
            }
          },
          () => {
            return (
              item.wheelchairNum >=
              checkedRowsData.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (["無", "普通輪椅(可收折)"].includes(
                    currentValue.wheelchairType
                  )
                    ? 0
                    : 1),
                0
              )
            );
          },
          () => {
            // 座椅數量 必須大於 所有訂單 (一般車訂單的陪同人數 + 1、福祉車訂單的陪同人數) 陪同人數 加總
            return (
              item.seatNum >=
              checkedRowsData.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  (currentValue.carCategoryName === "一般車"
                    ? currentValue.familyWith + 1
                    : currentValue.familyWith),
                0
              )
            );
          },
        ].every((it) => it());
      });
    },

    /* 確認變更司機車輛 */
    handleConfirmChange() {
      const vm = this;
      let data = {
        orderNosOrDespatchNos: [vm.orderTemp.despatchNo],
        driverInfoId: vm.orderTemp.driverInfoId,
        carId: vm.orderTemp.carId,
        driverInfoName: vm.driverList.filter((d) => {
          return d.id == vm.orderTemp.driverInfoId;
        })[0].name,
        carNo: vm.carList.filter((c) => {
          return c.id == vm.orderTemp.carId;
        })[0].carNo,
      };
      dispatchs.addOrUpdateShare(data).then((res) => {
        vm.$alertT.fire({
          icon: "success",
          title: res.message,
        });
        vm.changeDialog = false;
        vm.getList();
      });
    },

    /* 共乘 */
    handleCarPool(item) {
      const vm = this;
      console.log(item, this.orderTemp);

      let data = {
        orderNosOrDespatchNos: [item.despatchNo, vm.orderTemp.despatchNo],
        carId: item.carId,
        driverInfoId: item.driverInfoId,
        driverInfoName: vm.driverList.filter((d) => {
          return d.id === item.driverInfoId;
        })[0].name,
        carNo: vm.carList.filter((c) => c.id === item.carId)[0].carNo,
      };

      dispatchs.addOrUpdateShare(data).then((res) => {
        if (res.code === 200) {
          vm.$alertT.fire({
            icon: "success",
            title: res.message,
          });
        } else {
          vm.$alertM.fire({
            icon: "error",
            title: res.message,
          });
        }
        vm.getList();
      });
    },

    /* 顯示無組織訂單 */
    handleShowNoOrg() {
      const vm = this;
      vm.getListNoOrg();
      vm.$nextTick(() => {
        vm.noOrgDialog = true;
      });
    },

    /* 接收訂單 */
    handleReceive(orderId) {
      const vm = this;
      orderCaseUser.acceptOrder({ id: orderId }).then((res) => {
        console.log(res);

        vm.getList();
        vm.getListNoOrg();
      });
    },

    /* 轉單 */
    handleTrans(orderId) {
      const vm = this;
      orderCaseUser.transOrder({ id: orderId }).then((res) => {
        console.log(res);
        vm.getList();
        vm.getListNoOrg();
      });
    },

    /* 取消 */
    handleCancle(orderId) {
      const vm = this;
      orderCaseUser
        .cancel({
          id: orderId,
          cancelRemark: "SYS_ORDERCANCEL_REMARK_CLIENT_NOORG",
        })
        .then((res) => {
          console.log(res);
          vm.getList();
          vm.getListNoOrg();
        });
    },

    /* 拖曳時記錄該order */
    handleDargOrder(i) {
      this.orderTemp = Object.assign({}, i); // copy obj
      console.log(this.orderTemp);
      this.scroll.enabled = true;
    },

    /*  */
    test2() {
      // console.log(item?.reserveDate);
      // this.canDrag = false;
      this.scroll.enabled = !this.scroll.enabled;
      // console.log(this.scroll.enabled);
      // this.scroll = {};
      // console.log(this.scroll);
    },

    /* 拖曳上去時添加shadow */
    showShadow(e) {
      // e.target.style.boxShadow = "inset 0px 0px 20px #888";
      e.target.style.background = "#ffe5d7";
    },

    /* 移除shadow */
    clearShadow(e) {
      // e.target.style.boxShadow = "none";
      e.target.style.background = "#fff";
    },

    getHeight(x) {
      let step = 100 / this.step;
      return x * step + "px";
    },

    driverDragleave() {
      // console.log("driverDragleave");
    },

    driverMouseUp() {
      // this.$cl("driverMouseUp");
    },

    /* 權限按鈕 */
    onBtnClicked(domId) {
      this.$cl(domId);
      switch (domId) {
        case "dispatch":
          this.coDialog = true;
          break;
        case "showNoOrg":
          this.handleShowNoOrg();
          break;
        default:
          break;
      }
    },
  },
  async created() {
    this.listQuery.StartDate = moment(new Date()).format("yyyy-MM-DD");
    await this.getList();
    this.getCaseUserList();
    this.getCarCategorys();
    this.getDriverList();
    this.getListNoOrg();
  },
  mounted() {
    const vm = this;
    setTimeout(() => {
      vm.dragSetting();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.dragDispatcherContainer {
  display: flex;
  height: calc(100vh - 136px);
  width: 100%;
  // background: #fff;
  padding: 1rem;

  .orderContainer {
    width: 286px;
    min-height: 100%;
    overflow: auto;
    // padding-top: 1rem;
    // background: lightgreen;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1rem;
  }

  .orderCardL {
    width: 280px;
    height: auto;
    background: #fff;
    border: 2px solid #fa8c16;
    border-top: 5px solid #fa8c16;
    border-radius: 0px 0px 8px 8px;
    margin-bottom: 1rem;
  }
  .orderCardTitle {
    height: 38px;
    color: #fff;
    background: #fa8c16;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    p {
      margin-right: 1rem;
    }
  }
  .orderCardMain {
    padding: 0.5rem;
    font-size: 14px;
    font-weight: 700;
  }
  .orderInfo {
    color: #fa8c16;
    display: flex;
    margin-bottom: 0.5rem;

    p {
      margin-right: 1rem;
    }
  }
  .orderInfoName {
    color: #000;
    font-size: 1rem;
  }
  .orderTime {
    margin-bottom: 0.5rem;
  }
  .orderAddr {
    padding-left: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 45px;
    border-left: 3px dotted #fa8c16;
    position: relative;

    .icon-circle {
      font-weight: 500;
      color: #fa8c16;
      position: absolute;
      left: -9px;
      top: -1px;
      background: #fff;
    }

    .icon-Vector10 {
      font-weight: 500;
      color: #fa8c16;
      position: absolute;
      left: -9px;
      bottom: -1px;
      background: #fff;
    }
  }

  .startAddr {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .endAddr {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .outsideContainer {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    width: calc(100% - 286px - 16px);
    transition: 0.5s;
    position: relative;
  }

  .driverTimeCard {
    color: #fa8c16;
    position: absolute;
    width: 100px;
    height: 100px;
    background: #fff;
    z-index: 999;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .iconRoate {
    transform: rotate(90deg);
  }

  .driverFakeBox {
    display: flex;
    // min-width: 100%;
    // background: forestgreen;
  }

  .driverCard {
    background: #fff;
    height: 100px;
    z-index: 999;
    width: 320px;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;

    &:nth-child(1) {
      // background: brown;
      margin-left: 100px;
    }
  }

  .driverCardTitle {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.5rem;
    letter-spacing: 2px;
  }
  .driverImg {
    width: 40px;
    height: 40px;
    background: #ddd;
    border-radius: 200px;
    margin-right: 1rem;
  }
  .driverName {
  }
  .carInfo {
    width: 100%;
    letter-spacing: 2px;
  }

  .timeFakeBox {
    width: 100px;
    background: #fff;
    border-right: 1px solid #ddd;
  }

  .timeCard {
    margin-bottom: 72px;
    text-align: center;
    transform: translateY(-8px);

    &:nth-child(1) {
      transform: translateY(0px);
    }
  }

  .distatchContainer {
    width: calc(100% - 100px);
    height: 100%;
    // background: lightpink;
    overflow: hidden;
    // overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .driver {
    width: 320px;
    background: lightskyblue;
    position: relative;

    &.active {
      background: lime;
    }
  }

  .driverBox {
    // width: 2000px;
    display: flex;
  }

  .timeBox {
    height: 90px;
    width: 320px;
    background: #fff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    transition: 0.3s;
  }

  .dispatchCardContainer {
    display: flex;
    width: 94%;
    margin: auto;
  }

  .dispatchCard {
    position: absolute;
    background: #ffefde;
    padding: 0.25rem;
    border: 2px solid #fa8c16;
    border-top: 5px solid #fa8c16;
    border-radius: 0px 0px 8px 8px;
    width: 33%;
    z-index: 1;
    transition: 0.3s;
    min-height: 90px;
    overflow: hidden;
    box-shadow: 4px 4px 10px #ddd;

    &:hover {
      // transform: scale(1);
      z-index: 3;
    }
  }

  .cardHeader {
    display: flex;
    margin-bottom: 0.25rem;
    align-items: center;
    padding: 0 0.15rem;
  }

  .totalTime {
    text-align: center;
    font-size: 14px;
    margin-right: auto;
  }

  .icon-driver {
    font-size: 16px;
    margin-right: 0.1rem;
    font-weight: 500;
    transition: 0.5s;
    cursor: pointer;

    &:hover {
      color: #18b82d;
    }
  }

  .icon-Cross {
    font-size: 14px;
    font-weight: 700;
    transition: 0.5s;
    cursor: pointer;

    &:hover {
      color: #d41818;
    }
  }

  .dispatchPassengers {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0.25rem;
  }

  .passengerName {
    font-size: 13px;
    cursor: pointer;

    .iconfont {
      font-size: 10px;
    }

    .dispatchStatus-ready {
      color: red;
    }
  }

  .whiteDriverTime {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 2rem;
    line-height: 90px;
    letter-spacing: 2px;
    font-weight: 700;
    color: #fff;
    transition: 0.3s;
    position: absolute;
    width: 100%;
  }
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
