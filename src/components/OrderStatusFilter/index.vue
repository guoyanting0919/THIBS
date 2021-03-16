<template>
  <div class="orderFilterContainer">
    <OrderStatusTag :active=activeStatus(-1) @handleSort="handleSort('-1')" size="big" type="default"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(1) @handleSort="handleSort('1')" size="big" type="newOrder"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(2) @handleSort="handleSort('2')" size="big" type="ready"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(3) @handleSort="handleSort('3')" size="big" type="arrival"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(4) @handleSort="handleSort('4')" size="big" type="boarding"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(5) @handleSort="handleSort('5')" size="big" type="complete"></OrderStatusTag>
    <OrderStatusTag :active=activeStatus(9) @handleSort="handleSort('9')" size="big" type="cancel"></OrderStatusTag>
  </div>
</template>

<script>
import OrderStatusTag from "@/components/OrderStatusTag";
export default {
  name: "orderStatusFilter",
  components: {
    OrderStatusTag,
  },
  data() {
    return {
      isActive: -1,
    };
  },
  computed: {},
  methods: {
    handleSort(type) {
      this.isActive = type * 1;
      this.$emit("handleSort", type);
    },
    activeStatus(type) {
      return type === this.isActive;
    },
  },
};
</script>

<style lang='scss' scoped>
.orderFilterContainer {
  display: flex;
  flex-wrap: wrap;

  .orderStatusTag {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  span {
    // margin: 1rem;
    margin-left: 0;
    margin-top: 0;
    cursor: pointer;
  }
}
</style>