<template>
  <div class="dispatch" @click="clearMenu">
    <div class="dispatchOrder" v-if="showOrderList">
      <div
        class="dispatchOrderItem"
        v-for="(item, index) in orderList"
        :key="index"
        @dragstart="dragStart($event, item)"
        draggable="true"
        @dblclick="getOrderMore(item)"
      >
        {{ item.Id }}
      </div>
    </div>
    <div
      class="dispatchList"
      @mousedown.prevent="mouseDownHandler"
      @mouseup.prevent="mouseUpHandler"
      @mouseleave.prevent="mouseUpHandler"
      @mousemove.prevent="ToScroll"
      :style="{ width: showOrderList ? 'calc(100% - 300px)' : '100%' }"
    >
      <div class="dispatchListTime">
        <!--時間列表-->
        <div class="dispatchListTimeD"></div>
        <div
          class="dispatchListTimeD"
          v-for="(item, index) in timelist"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="dispatchListCar">
        <!--司機車輛 列表-->
        <div
          class="dispatchListCarD"
          v-for="(item, index) in GetCarsWithCarTypeNoPage"
          @dragover.prevent
          :key="index"
        >
          <div class="dispatchListCarDH">
            <div>{{ item.CarNo }} ({{ item.DriverInfo.DriverName }})</div>
          </div>
          <div
            class="dispatchListCarDD"
            @dragover="changeShadow"
            @drop="getDropData($event, item, item2)"
            @dragleave="clearShadow"
            @dragend="clearShadow"
            v-for="(item2, index2) in timelist"
            :key="index2"
          >
            <div
              class="dispatchListCarDDOrder"
              v-for="(item3, index3) in filterDispatch(item, item2)"
              :style="{
                height: getHeight(
                  item3.DespatchDetails[0].OrderDetails.ExpectedMinute
                ),
              }"
              :key="index3"
            >
              <!--v-if="ShowDispatch(item,item2,item3)"-->
              <div
                class="dispatchListCarDDOrderMask"
                @contextmenu.prevent="showMenu"
                @dblclick="getDispatchMore(item3)"
                @dragover.prevent.stop="changeShadow"
                @drop.prevent.stop="getDropData($event, item, item2, item3)"
              ></div>
              <div class="dispatchListCarDDOrderMenu">
                <div
                  class="dispatchListCarDDOrderMenuItem"
                  @click="getOrderMore(item4)"
                  v-for="(item4, index4) in item3.DespatchDetails"
                  :key="index4"
                >
                  {{ item4.OrderDetails.CaseUserName }}
                </div>
              </div>
              <div>
                {{ item3.DespatchDetails[0].OrderDetails.CaseUserName }}
              </div>
              <div>
                {{ item3.DespatchDetails[0].OrderDetails.ExpectedMinute }}分鐘
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

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
      default: 15,
    },
    showOrderList: {
      //是否顯示訂單列
      type: Boolean,
      default: true,
    },
    driverList: {
      //司機列表
      type: Array,
      default: () => [],
    },
    orderList: {
      //訂單列表
      type: Array,
      default: () => [],
    },
    dispatchList: {
      //調度單列表
      type: Array,
      default: () => [],
    },
    onlyRead: {
      //是否只讀，是的話調度單右鍵將失效
      type: Boolean,
      default: false,
    },
    sensitivity: {
      //拖曳靈敏度，已倍率計算
      type: Number,
      default: 1,
    },
    dropTarget: {
      //拖入目標，是司機還是時間 (driver,time)
      type: String,
      default: "driver",
    },
  },
  computed: {
    GetCarsWithCarTypeNoPage() {
      var arr = this.driverList;
      arr.sort(function (a, b) {
        return a.CarNo > b.CarNo ? 1 : -1;
      });
      return arr;
    },
    timelist() {
      var ctime = moment().format("YYYY-MM-DD") + " " + this.start;
      var arr = [moment(ctime).format("HH:mm")];
      while (
        moment(ctime).isBefore(moment().format("YYYY-MM-DD") + " " + this.end)
      ) {
        ctime = moment(ctime).add(this.step, "minutes");
        arr.push(moment(ctime).format("HH:mm"));
      }
      return arr;
    },
  },
  data() {
    return {
      ele: document.querySelectorAll(".dispatchList")[0],
      pos: { top: 0, left: 0, x: 0, y: 0 },
      isDown: false,
      realDispatchList: [],
    };
  },
  methods: {
    mouseDownHandler(e) {
      let ele = document.querySelectorAll(".dispatchList")[0];
      this.pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      };
      this.isDown = true;
    },
    mouseUpHandler() {
      //console.log(e.which)
      this.isDown = false;
    },
    ToScroll(e) {
      /*if(this.isDown) {
        document.querySelectorAll(".contentD")[0].scrollTo({
          top: 0,
          left: document.querySelectorAll(".contentD")[0].scrollLeft-=event.movementX,
          behavior: 'smooth'
        });
      }*/
      //console.log(e)
      if (!this.isDown) return 0;
      let ele = document.querySelectorAll(".dispatchList")[0];
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;

      // Scroll the element
      ele.scrollTop = this.pos.top - dy * this.sensitivity;
      ele.scrollLeft = this.pos.left - dx * this.sensitivity;
    },
    filterDispatch(driver, time) {
      return this.dispatchList.filter(
        (res) =>
          res.DespatchDetails[0].Despatch.DriverInfoId ==
            driver.DriverInfo.Id &&
          this.HHmm(res.DespatchDetails[0].OrderDetails.ReservationDate) == time
      );
    },
    ShowDispatch(x, y, z) {
      var flag = false;
      if (
        z.DespatchDetails[0].Despatch.DriverInfoId == x.DriverInfo.Id &&
        this.HHmm(z.DespatchDetails[0].OrderDetails.ReservationDate) == y
      ) {
        flag = true;
      }
      return flag;
    },
    getHeight(x) {
      var step = 100 / this.step;
      return x * step + "px";
    },
    clearMenu() {
      let ele = document.querySelectorAll(".dispatchListCarDDOrderMenu");
      for (let item of ele) {
        item.style.display = "none";
      }
    },
    showMenu(e) {
      if (this.onlyRead) return 0;
      console.log(e);
      this.clearMenu();
      e.target.parentElement.querySelectorAll(
        ".dispatchListCarDDOrderMenu"
      )[0].style.display = "block";
    },
    getOrderMore(data) {
      this.$emit("getOrderMore", data);
    },
    getDispatchMore(data) {
      this.$emit("getDispatchMore", data);
    },
    dragStart(e, data) {
      e.dataTransfer.setData("data", JSON.stringify(data));
    },
    getDropData(e, driver, time, dropOrder = null) {
      let order = JSON.parse(e.dataTransfer.getData("data"));
      this.$emit("getDropData", { order, driver, time, dropOrder });
      e.target.style.boxShadow = "none";
    },
    showTest(x) {
      console.log(x);
    },
    changeShadow(e) {
      e.target.style.boxShadow = "inset 0px 0px 20px #888";
    },
    clearShadow(e) {
      e.target.style.boxShadow = "none";
    },
  },
};
</script>

