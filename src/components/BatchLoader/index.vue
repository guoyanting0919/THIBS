<template>

  <div v-if="isShow" class="batchLoader container">
    <div class="counter" :class="counterClass">
      <count-to class="card-panel-num" :startVal="startVal" :endVal="endVal" :duration="duration"></count-to>
      <span class="persent">%</span>
      <p v-if="totalDataCount===currentDataIndex" @click="handleClose" class="confirmCompleteBtn">確認</p>
    </div>
    <transition name="fade">
      <div class="dataTemp" v-if="temp">
        <h4 class="textCenter" style="margin-bottom:.5rem">訂單資訊</h4>
        <p>訂單編號：{{temp.orderNosOrDespatchNos[0]}}</p>
        <p>預約司機：{{temp.driverInfoName}}</p>
        <p>訂單車輛：{{temp.carNo}}</p>
        <p>錯誤原因：{{temp.errorRemark}}</p>
      </div>
    </transition>
    <div class="dataContainer">
      <i @click="handleClick(index)" slot="reference" v-for="(item,index) in totalDataCount" :key="index" :class="btnClass(index)" class="iconfont icon-car"></i>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  name: "batchLoader",
  components: { CountTo },
  data() {
    return {
      startVal: 0,
      duration: 1000,
      temp: "",
    };
  },
  props: {
    /* 是否顯現 */
    isShow: {
      type: Boolean,
      required: true,
      default: false,
    },

    /* 資料總筆數 */
    totalDataCount: {
      type: Number,
      required: false,
      default: 20,
    },

    /* 當前資料筆數 */
    currentDataIndex: {
      type: Number,
      required: false,
      default: 3,
    },

    /* 失敗資料Array */
    errorDataArray: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  computed: {
    /* 失敗資料筆數索引 */
    errorIndexArray() {
      return this.errorDataArray.map((o) => {
        if (o.code === 500) {
          return o.index;
        }
      });
    },

    /* 百分比 */
    endVal() {
      return Math.ceil((this.currentDataIndex / this.totalDataCount) * 100);
    },

    /* 百分比顏色 */
    counterClass() {
      const classes = [];
      if (this.endVal < 20) {
        classes.push(`smallThen20`);
      } else if (this.endVal < 40) {
        classes.push(`smallThen40`);
      } else if (this.endVal < 60) {
        classes.push(`smallThen60`);
      } else if (this.endVal < 80) {
        classes.push(`smallThen80`);
      } else if (this.endVal < 85) {
        classes.push(`smallThen85`);
      } else if (this.endVal < 100) {
        classes.push(`smallThen100`);
      } else if (this.endVal == 100) {
        classes.push(`isComplete`);
      }
      return classes;
    },
  },

  watch: {
    endVal(n, o) {
      if (o == 0) {
        this.startVal = 0;
      } else {
        this.startVal = o || 0;
      }
      this.duration = Math.floor(Math.random() * 1000 + 500);
    },
  },

  methods: {
    /* 關閉loader */
    handleClose() {
      this.temp = null;
      this.$emit("handleClose");
    },

    /* 點擊預約失敗訂單 */
    handleClick(index) {
      if (this.btnClass(index).includes("isError")) {
        this.temp = this.errorDataArray.filter(
          (data) => data.index === index + 1
        )[0];
        this.$forceUpdate();
      } else {
        this.temp = null;
        // this.$forceUpdate();
      }
    },

    /* icon class  */
    btnClass(index) {
      const classes = [];
      if (index < this.currentDataIndex) {
        classes.push(`isComplete`);
      }

      if (this.errorIndexArray.includes(index + 1)) {
        classes.push(`isError`);
      }

      return classes;
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #000000;
  opacity: 0.876;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15vh 10%;
  position: fixed;
  top: 0;
  right: 0;
}

.dataContainer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.iconfont {
  font-size: 4rem;
  color: white;
  margin: 0.5rem 1rem;
  transition: 0.15s;

  &.isComplete {
    color: $--color-success;
  }

  &.isError {
    color: $--color-danger;
    cursor: pointer;
  }
}

.counter {
  width: 250px;
  height: 250px;
  // line-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 6rem;
  font-weight: 700;
  transition: 0.5s;
  border-radius: 400px;
  border: 6px solid $--color-success;
  color: $--color-success;

  &.smallThen20 {
    border: 6px solid #bb2f2f;
    color: #bb2f2f;
  }

  &.smallThen40 {
    border: 6px solid #e27922;
    color: #e27922;
  }

  &.smallThen60 {
    border: 6px solid #d3d033;
    color: #d3d033;
  }

  &.smallThen80 {
    border: 6px solid #7db632;
    color: #7db632;
  }
  &.smallThen85 {
    border: 6px solid #37b448;
    color: #37b448;
  }
  &.smallThen100 {
    border: 6px solid #409167;
    color: #409167;
  }
  &.isComplete {
    color: #000000;
    background: #409167;
  }
}

.persent {
  font-size: 2.5rem;
  font-weight: 500;
}

.confirmCompleteBtn {
  font-size: 1.5rem;
  position: absolute;
  bottom: 16px;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  color: #409167;
  border: 4px solid #000000;
  background: #000000;
  border-radius: 0.5rem;
  transition: 0.25s;
  cursor: pointer;

  &:hover {
    color: #000;
    background: #409167;
    // border: 4px solid #409167;
  }
}
.dataTemp {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: $--color-danger;
  // height: 250px;
  width: 350px;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  border: 3px solid $--color-danger;
  margin-left: 1rem;

  p {
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 1rem;
    letter-spacing: 2px;
  }
}
</style>
<style lang="scss">
.customLoaderPopover {
  background: #0000007e;
  border: $--color-danger;
  box-shadow: 0 0 4px $--color-danger;
  color: $--color-danger;
}
</style>