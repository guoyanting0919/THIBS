<template>
  <div class="orderCard">
    <div class="orderCardTitle">
      <p>{{ order.carCategoryName }}</p>
      <!-- <p>普通輪椅(可收拆)</p> -->
      <p v-if="order.canShared">可共乘</p>
      <p v-else>不可共乘</p>
      <p>{{ order.passengerNum }}人搭乘</p>
      <el-button @click="handleReceive(order.id)" size="mini" type="success" style="padding: 3px 8px; margin-left: auto">接收</el-button>
    </div>
    <div class="orderCardMain">
      <div class="orderInfo">
        <p class="orderInfoName">{{ order.userName }}</p>
        <p>聯絡電話 : {{ order.noticePhone }}</p>
      </div>
      <p class="orderTime">
        {{ order.reserveDate | dateFilter }}
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
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "OrderCardSelfPay",
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
  methods: {
    handleReceive(id) {
      this.$emit("handleReceive", id);
    },
  },
};
</script>

<style lang='scss' scoped>
.orderCard {
  width: 330px;
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