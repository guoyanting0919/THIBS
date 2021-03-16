<template>
  <div class="consoleTableTitle">
    <h2 class="h2Title" style="font-size: 22px">{{ title }}

    </h2>
    <div class="baseline"></div>
  </div>
</template>

<script>
export default {
  name: "consoleTableTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.consoleTableTitle {
  margin-bottom: 1rem;

  .baseline {
    width: 100%;
    height: 1px;
    background: #979797;
    margin-top: 0.5rem;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 100px;
      height: 3px;
      background: $--color-primary;
      top: -1.5px;
    }
  }
}
</style>
