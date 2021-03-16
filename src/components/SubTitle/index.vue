<template>
  <div class="subTitle">{{ title }} <slot class='btn' name='btn'></slot>
  </div>
</template>

<script>
export default {
  name: "subTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.subTitle {
  font-size: 18px;
  color: $--color-primary;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 2.5rem;
  // transform: translateX(-8px);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid $--color-primary;
  display: flex;
  align-items: center;

  &:nth-child(1) {
    margin-top: 1rem;
  }
}
</style>