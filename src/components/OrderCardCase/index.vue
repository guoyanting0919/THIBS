<template>
  <div class="orderCard">
    <div class="orderCardTitle">
      <p>{{ order.carCategoryName }} / {{order.wheelchairType }}</p>
      <!-- <p>普通輪椅(可收拆)</p> -->
      <p v-if="order.canShared">可共乘</p>
      <p v-else>不可共乘</p>
      <el-button @click="handleReceive(order.id)" size="mini" type="success" style="padding: 3px 8px; margin-left: auto">接收</el-button>
      <el-button v-if="order.hasNext" @click="handleTrans(order.id)" size="mini" type="info" style="padding: 3px 8px; margin-left: auto">轉單</el-button>
      <el-button v-if="!order.hasNext" @click="handleCancle(order.id)" size="mini" type="danger" style="padding: 3px 8px; margin-left: auto">取消</el-button>
    </div>
    <div class="orderCardMain">
      <div class="orderInfo">
        <p class="orderInfoName">{{ order.userName }}</p>
        <p>身分證字號 : {{ order.userUid }}</p>

        <el-tooltip v-if="isToday" class="item" effect="dark" content="今日訂單" placement="top-start">
          <p class="todayOrder">!</p>
        </el-tooltip>
      </div>
      <p>個案編號 : {{ order.caseUserNo }}</p>
      <p>陪同人數：{{ order.familyWith + order.maidWith}}人</p>
      <p>是否下家：{{ order.hasNext ? '是' : "否" }}</p>
      <p class="orderTime">
        預約日期 : {{ order.reserveDate | dateFilter }}
      </p>
      <div class="orderAddr">
        <i class="iconfont icon-circle"></i>
        <i class="iconfont icon-Vector10"></i>
        <p class="startAddr">
          {{ order.fromAddr }}
        </p>
        <p class="endAddr">{{ order.toAddr }}</p>
      </div>
    </div>

    <!-- <div>!</div> -->
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "OrderCardCase",
  data() {
    return {
      today: moment().format("yyyy-MM-DD"),
    };
  },
  props: {
    order: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  filters: {
    dateFilter(date) {
      let day = moment(date).format("yyyy-MM-DD");
      let time = moment(date).format("HH:mm");
      return `${day} ${time}`;
    },
  },
  computed: {
    isToday() {
      return moment(this.order.reserveDate).format("yyyy-MM-DD") === this.today;
    },
  },
  methods: {
    /* 接收訂單 */
    handleReceive(id) {
      this.$emit("handleReceive", id);
    },

    /* 轉單 */
    handleTrans(id) {
      this.$emit("handleTrans", id);
    },

    /* 取消訂單 */
    handleCancle(id) {
      this.$emit("handleCancle", id);
    },
  },
};
</script>

<style lang='scss' scoped>
.orderCard {
  width: 360px;
  margin-right: 0.5rem;
  height: auto;
  background: #fff;
  border: 2px solid $--color-primary;
  border-top: 5px solid $--color-primary;
  border-radius: 0px 0px 8px 8px;
  margin-bottom: 1rem;
}
.orderCardTitle {
  height: 38px;
  color: #fff;
  background: $--color-primary;
  padding: 0.5rem;
  display: flex;
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
  color: $--color-primary;
  display: flex;
  margin-bottom: 0.5rem;

  p {
    margin-right: 0.5rem;
  }
}
.orderInfoName {
  color: #000;
  font-size: 1rem;
  margin-right: auto !important;
}
.todayOrder {
  color: #ffffff;
  background: red;
  border-radius: 200px;
  width: 1rem;
  height: 1rem;
  font-weight: 700;
  text-align: center;
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
  border-left: 3px dotted $--color-primary;
  position: relative;

  .icon-circle {
    font-weight: 500;
    color: $--color-primary;
    position: absolute;
    left: -9px;
    top: -1px;
    background: #fff;
  }

  .icon-Vector10 {
    font-weight: 500;
    color: $--color-primary;
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
</style>