<template>
  <div class="flex-column allOrderDetail">
    <sticky :className="'sub-navbar'">
      <el-button type="info" plain size="mini" @click="$router.push('/orderselfpayuser')">回列表</el-button>
    </sticky>
    <div class="app-container flex-item" style="display: flex; flex-wrap: wrap">
      <Title title="查看訂單" style="width: 100%"></Title>

      <!-- 訂單資訊卡片 -->
      <div class="formContainer bg-white customScrollBar" style="height: calc(100% - 80px); width: 49%; margin-right: 2%">
        <div class="userInfo">
          <SubTitle title="訂單資訊"></SubTitle>
          <el-row :gutter="16" v-if="order">
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">訂單編號</div>
                <div class="inputValue">{{ order.orderNo }}</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">訂單狀態</div>
                <div class="inputValue">
                  <OrderStatusTag size="normal" :type="orderStatusMapping[order.status - 1]"></OrderStatusTag>
                </div>
              </div>
            </el-col>

            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">建單者</div>
                <div class="inputValue">
                  <div class="inputValue">{{ order.createUserName }}</div>
                </div>
              </div>
            </el-col>

            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">承接車行</div>
                <div class="inputValue">
                  <div class="inputValue">{{ order.orgName }}</div>
                </div>
              </div>
            </el-col>

            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">訂車人姓名</div>
                <div class="inputValue">{{ order.userName }}</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">訂車人聯絡電話</div>
                <div class="inputValue">{{ order.userPhone }}</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">預約乘車時間</div>
                <div class="inputValue">
                  {{ order.reserveDate | globalDateFilter('yyyy-MM-DD') }}
                  {{ order.reserveDate | globalDateFilter('HH:mm') }}
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">乘車人數</div>
                <div class="inputValue">{{ order.passengerNum }}</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">司機</div>
                <div class="inputValue">
                  {{ order.driverInfoName || "尚未排班" }}
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="inputBox">
                <div class="inputLable">車輛(車號/車種)</div>
                <div v-if="order.carNo" class="inputValue">
                  {{ order.carNo }} / {{ order.carCategoryName }}
                </div>
                <div class="inputValue" v-else>尚未排班</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="24">
              <div class="inputBox" style="margin-bottom: 8px">
                <div class="inputLable">起迄點</div>
                <div class="inputValue">
                  <div class="cardBody" style="width: 100%">
                    <p class="fromAddr" style="margin: 8px 0; width: 100%">
                      <i class="iconfont icon-circle"></i>
                      {{ order.fromAddr }}
                    </p>
                    <p class="toAddr">
                      <i class="iconfont icon-Vector10"></i>
                      {{ order.toAddr }}
                    </p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :md="24">
              <div class="inputBox">
                <div class="inputLable">乘車名單</div>
                <div class="passengerList">
                  <p v-for="item in passengerList" :key="item.key">
                    {{ item.name }} {{ item.birth | globalDateFilter('yyyy-MM-DD') }} {{ item.phone }}
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 訂單歷程卡片 -->
      <div class="formContainer bg-white" style="height: calc(100% - 80px); width: 49%">
        <div class="userInfo">
          <SubTitle title="訂單歷程"></SubTitle>
          <div style="height: calc(100% - 80px)">
            <el-table ref="mainTable" height="100%" :data="order.orderStatusLogs" border fit style="width: 100%">
              <el-table-column label="變更時間" align="center">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.createDate }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="變更者" align="center">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.createUserName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="狀態" align="center">
                <template slot-scope="scope">
                  <OrderStatusTag :type="orderStatusMapping[scope.row.status - 1]"></OrderStatusTag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import OrderStatusTag from "@/components/OrderStatusTag";

import * as orderSelfPayUser from "@/api/orderSelfPayUser";
export default {
  name: "allOrderDetail",
  components: {
    Sticky,
    Title,
    SubTitle,
    OrderStatusTag,
  },
  data() {
    return {
      /* user 資訊 */
      selfPayUserId: "",

      /* 訂單資訊 */
      order: "",

      // order status mapping
      orderStatusMapping: [
        "newOrder",
        "ready",
        "arrival",
        "boarding",
        "complete",
        "cancel",
        "cancel",
        "cancel",
        "cancel",
      ],
    };
  },
  computed: {
    passengerList() {
      return JSON.parse(this.order.remark);
    },
  },
  methods: {
    /* 獲取訂單 */
    getOrderList() {
      const vm = this;
      orderSelfPayUser.getDetail({ id: vm.$route.params.id }).then((res) => {
        vm.order = res.result;
        vm.selfPayUserId = res.result.selfPayUserId;
        console.log(res);
      });
    },
  },
  mounted() {
    const vm = this;
    vm.getOrderList();
  },
};
</script>

<style lang="scss" scoped>
.userInfo {
  height: 95%;
}
.inputBox {
  width: 100%;
  height: 84px;
}
.inputLable {
  height: 30%;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.85);
}
.inputValue {
  min-height: 50%;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
}
.passengerList {
  color: rgba(0, 0, 0, 0.5);
  p {
    margin: 0 0 4px 0;
  }
}
</style>
