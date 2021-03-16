<template>
  <div class="flex-column allOrderDetail">
    <sticky :className="'sub-navbar'">
      <el-button type="info" plain size="mini" @click="$router.push('/orderCaseuser')">回列表</el-button>
    </sticky>
    <el-row :gutter="16" class="app-container flex-item flexStretch">
      <Title title="查看訂單" style="width: 100%"></Title>

      <!-- 訂單資訊卡片 -->
      <el-col :sm="24" :md="12">
        <div class="stretchItem bg-white">
          <div class="userInfo">
            <SubTitle title="訂單資訊"></SubTitle>
            <el-row :gutter="16" v-if="order">
              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">訂單編號</div>
                  <div class="inputValue">{{ order.orderNo }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">預約乘車時間</div>
                  <div class="inputValue">
                    {{ order.reserveDate | globalDateFilter('yyyy-MM-DD') }}
                    {{ order.reserveDate | globalDateFilter('HH:mm') }}
                  </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">訂單狀態</div>
                  <div class="inputValue">
                    <!-- FIXME:({{order.cancelRemark}}) -->
                    <OrderStatusTag size="normal" :type="orderStatusMapping[order.status - 1]"></OrderStatusTag>
                  </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">個案姓名</div>
                  <div class="inputValue">{{ order.userName }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">身分證字號</div>
                  <div class="inputValue">{{ order.userUID }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">個案編號</div>
                  <div class="inputValue">{{ order.caseUserNo }}</div>
                </div>
              </el-col>

              <el-col :sm="24" :md="24">
                <div class="dashLine"></div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">訂車人身份</div>
                  <div class="inputValue">{{order.createdIdentity}}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">接收簡訊電話</div>
                  <div class="inputValue">{{order.noticePhone}}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">陪同人數</div>
                  <div class="inputValue">{{ order.familyWith }} 人</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">共乘</div>
                  <div class="inputValue">{{ order.canShared ?'可共乘':'不可共乘' }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">車種</div>
                  <div class="inputValue">{{ order.carCategoryName }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">輪椅類型</div>
                  <div class="inputValue">{{ order.wheelchairType }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">預估車資</div>
                  <div class="inputValue">${{ order.etTotalAmt }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">政府補助</div>
                  <div class="inputValue">${{ order.etDiscountAmt }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">個案負擔</div>
                  <div class="inputValue">${{ order.etSelfPay }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">陪同金額</div>
                  <div class="inputValue">${{ order.etWithAmt }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="12">
                <div class="inputBox">
                  <div class="inputLable">預估應收</div>
                  <div class="inputValue">${{ order.etSelfPay + order.etWithAmt }}</div>
                </div>
              </el-col>

              <!-- 緊急聯絡人資訊 -->
              <el-col :sm="12" :md="6" class="colorBlock">
                <div class="inputBox flexInputBox">
                  <div class="inputLable">緊急聯絡人</div>
                  <div class="inputValue">{{caseUser.urgentName }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6" class="colorBlock">
                <div class="inputBox flexInputBox">
                  <div class="inputLable">關係</div>
                  <div class="inputValue">{{caseUser.urgentRelationship }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6" class="colorBlock">
                <div class="inputBox flexInputBox">
                  <div class="inputLable">手機</div>
                  <div class="inputValue">{{caseUser.urgentPhone }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6" class="colorBlock">
                <div class="inputBox flexInputBox">
                  <div class="inputLable">市話</div>
                  <div class="inputValue">{{caseUser.urgentTel }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <!-- 乘車資訊卡片 -->
      <el-col :sm="24" :md="12">
        <div class="stretchItem bg-white">
          <div class="userInfo">
            <SubTitle title="乘車資訊"></SubTitle>
            <el-row :gutter="16" v-if="order">
              <el-col :sm="12" :md="12">
                <div class="inputBox">
                  <div class="inputLable">承接車行</div>
                  <div class="inputValue">{{ order.orgName }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6">
                <div class="inputBox">
                  <div class="inputLable">司機</div>
                  <div class="inputValue">{{despatch.driverName || '尚未排班'}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6">
                <div class="inputBox">
                  <div class="inputLable">車輛</div>
                  <div class="inputValue">{{despatch.carNo || '尚未排班'}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="12">
                <div class="inputBox ">
                  <div class="inputLable">行程</div>
                  <div class="inputValue">{{order.isBack ? '回程' : '去程'}}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6">
                <div class="inputBox ">
                  <div class="inputLable">預估里程數</div>
                  <div class="inputValue">{{order.totalMileage / 1000}} 公里</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="6">
                <div class="inputBox ">
                  <div class="inputLable">預估行車時間</div>
                  <div class="inputValue">{{order.expectedMinute}} 分鐘</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="24" class="colorBlock">
                <div class="inputBox" style="height:auto;margin-bottom:1rem">
                  <div class="inputLable"><i class="iconfont icon-circle"></i>起點 ({{order.fromAddrRemark}})</div>
                  <div class="inputValue" style="margin:0.75rem 0">{{order.fromAddr}}</div>
                  <div class="inputValue" style="margin:0.75rem 0">緯度:{{order.fromLat}} 經度:{{order.fromLon}}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="24" class="colorBlock">
                <div class="inputBox" style="height:auto;margin-bottom:1rem">
                  <div class="inputLable"><i class="iconfont icon-Vector10"></i>迄點 ({{order.toAddrRemark}})</div>
                  <div class="inputValue" style="margin:0.75rem 0">{{order.toAddr}}</div>
                  <div class="inputValue" style="margin:0.75rem 0">緯度:{{order.toLat}} 經度:{{order.toLon}}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="24">
                <div class="inputBox" style="margin-top:1rem">
                  <div class="inputLable">共乘訂單編號</div>
                  <div class="inputValue" style="flex-direction: column;align-items: flex-start;">
                    <p style="margin:.25rem 0" v-for="item in despatch.orderNos" :key="item">{{item}}</p>
                  </div>
                </div>
              </el-col>

            </el-row>
          </div>
        </div>
      </el-col>

      <!-- 收款資訊卡片 -->
      <el-col :sm="24" :md="24" style="margin-top:1rem">
        <div class="stretchItem bg-white">
          <div class="userInfo">
            <SubTitle title="收款資訊"></SubTitle>

            <!-- FIXME:不確定欄位名稱是否正缺 -->
            <el-row :gutter="16" v-if="pay">
              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">車資總額</div>
                  <div class="inputValue">{{ pay.realSelfPay + pay.realWithAmt }}</div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">政府補助</div>
                  <div class="inputValue">{{pay.realDiscountAmt}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">個案負擔</div>
                  <div class="inputValue">{{pay.realSelfPay}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">陪同金額</div>
                  <div class="inputValue">{{pay.realWithAmt}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">實際應收</div>
                  <div class="inputValue">{{pay.receivePay}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="8">
                <div class="inputBox">
                  <div class="inputLable">實際實收</div>
                  <div class="inputValue">{{pay.receivePay}} </div>
                </div>
              </el-col>

              <el-col :sm="12" :md="24" style="height:220px">
                <div class="inputBox">
                  <div class="inputLable">乘客或家屬簽名</div>
                  <div class="inputValue" style="height:200px">
                    <img style="height:100%" :src='`data:image/png;base64,${pay.signPic}`'>
                  </div>
                </div>
              </el-col>

            </el-row>
            <p class="noPay" v-else>訂單尚未完成 暫無收款資訊</p>
          </div>
        </div>
      </el-col>

      <!-- 訂單歷程卡片 -->
      <el-col :sm="24" :md="24" style="margin-top:1rem">
        <div class="stretchItem bg-white">
          <div class="userInfo">
            <SubTitle title="訂單歷程"></SubTitle>
            <div v-if="history" style="height:calc(100vh - 190px)">
              <el-table ref="mainTable" height="100%" :data="history" border fit style="width: 100%">
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
      </el-col>

    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import OrderStatusTag from "@/components/OrderStatusTag";

import * as orderCaseUser from "@/api/orderCaseUser";
import * as despatch from "@/api/dispatchs";
export default {
  name: "caseUserOrderDetail",
  components: {
    Sticky,
    Title,
    SubTitle,
    OrderStatusTag,
  },
  filters: {
    dateFilter(date) {
      let day = moment(date).format("yyyy-MM-DD");
      let time = moment(date).format("HH:mm");
      return `${day} ${time}`;
    },
  },
  data() {
    return {
      /* user 資訊 */
      user: "",

      /* caseuser 資訊 */
      caseUser: "",

      /* 訂單資訊 */
      order: "",

      /* 乘車資訊 */
      despatch: "",

      /* 訂單歷程 */
      history: [],

      /* 收款 */
      pay: "",

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
    /* 獲取訂單資訊 */
    getOrderList() {
      const vm = this;
      orderCaseUser.getDetail({ orderId: vm.$route.params.id }).then((res) => {
        vm.order = res.result;
      });
    },

    /* 獲取乘車資訊 */
    getDespatch() {
      const vm = this;
      despatch.getDespatch({ orderId: vm.$route.params.id }).then((res) => {
        vm.despatch = res.result;
      });
    },

    /* 獲取付款資訊 */
    getPay() {
      const vm = this;
      orderCaseUser.getPay({ orderId: vm.$route.params.id }).then((res) => {
        vm.pay = res.result;
      });
    },

    /* 獲取訂單歷程 */
    getHistory() {
      const vm = this;
      orderCaseUser.getHistory({ orderId: vm.$route.params.id }).then((res) => {
        vm.history = res.result;
      });
    },

    /* 獲取user資訊 */
    getUser() {
      const vm = this;
      orderCaseUser.getUser({ id: vm.$route.query.userId }).then((res) => {
        vm.user = res.result;
      });
    },

    /* 獲取CaseUser資訊 */
    getCaseUser() {
      const vm = this;
      orderCaseUser
        .getCaseUser({ id: vm.$route.query.caseUserId })
        .then((res) => {
          vm.caseUser = res.result;
        });
    },
  },
  mounted() {
    const vm = this;
    vm.getOrderList();
    vm.getDespatch();
    vm.getPay();
    vm.getHistory();
    vm.getUser();
    vm.getCaseUser();
  },
};
</script>

<style lang="scss" scoped>
.flexStretch {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
}
.userInfo {
  height: 100%;
}
.stretchItem {
  padding: 8px 16px;
  height: 100%;
}
.inputBox {
  width: 100%;
  height: 84px;
}
.inputLable {
  height: 30%;
  display: flex;
  align-items: center;
  font-weight: 700;
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
.noPay {
  text-align: center;
  color: red;
  margin-bottom: 0.5rem;
}
.flexInputBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.colorBlock {
  background: $--color-primary-light-9;
  padding: 1rem;

  .iconfont {
    color: $--color-primary;
    margin-right: 0.25rem;
  }
}

.dashLine {
  width: 100%;
  height: 1px;
  border-top: 2px dashed #aaaaaa;
  margin-bottom: 1rem;
}
</style>
