<template>
  <div class="flex-column allUserDispatch">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <!-- <el-button size="mini" type="primary">立即預約</el-button>
        <el-button size="mini" type="info">新增下個地點</el-button>-->
        <el-button size="mini" type="info" @click="handleCheckAmt">可用補助額查詢</el-button>
        <el-button size="mini" type="info" @click="handleChangeAddr">起迄點互換</el-button>
      </div>
    </sticky>

    <!-- main -->
    <div class="app-container flex-item">
      <div class="mainContainer">
        <!-- google map -->
        <div class="mapContainer">
          <div id="map" ref="map" style="width: 100%; height: 100%"></div>
        </div>

        <!-- 預估金額 -->
        <div class="discountContainer">
          <!-- 本日行程一覽 -->
          <div class="directionContainer">
            <h3 class="directionTitle">
              本日行程一覽
              <div class="tableToggle" :class="{'close':!tableToggle}">
                <i class="iconfont icon-down" @click="tableToggle = !tableToggle"></i>
              </div>
            </h3>
            <div class="orderAddr">
              <i class="iconfont icon-circle"></i>
              <i class="iconfont icon-Vector10"></i>
              <p class="startAddr">
                {{ fromAddr }}
              </p>
              <p class="endAddr">{{ toAddr }}</p>
            </div>
          </div>
          <el-table v-if="tableToggle" height="103px" :data="discountData" style="width: 100%">
            <el-table-column align="center" prop="direction" label="行程" width="50" fixed="left">
            </el-table-column>
            <el-table-column align="center" prop="distance" label="預估距離" width="100">
              <template slot-scope="scope">
                {{ scope.row.distance | distanceFilter }}公里
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" prop="duration" label="預估時間">
              <template slot-scope="scope">
                {{ scope.row.duration | durationFilter }}分鐘
              </template>
            </el-table-column>
            <el-table-column align="center" prop="totalAmt" label="車資總額">
              <template slot-scope="scope">
                $ {{ scope.row.totalAmt }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="subsidyAmt" label="政府補助">
              <template slot-scope="scope">
                $ {{ scope.row.subsidyAmt }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="selfPayAmt" label="自付額">
              <template slot-scope="scope">
                $ {{ scope.row.selfPayAmt }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="陪同總額">
              <template slot-scope="scope">
                $ {{ scope.row.withAmt }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" prop="withAmt" label="個案負擔">
              <template slot-scope="scope">
                $ {{ scope.row.withAmt + scope.row.selfPayAmt }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- dispatch -->
        <div class="dispatchContainer">
          <div class="caseUserName">{{ userInfo.name }}</div>
          <div class="dispatchDetail customScrollBar">
            <el-form :label-position="labelPosition" label-width="200px" :model="temp" ref="form" :rules="rules">
              <el-row :gutter="8">
                <el-col :sm="24" :md="15">
                  <el-form-item label="乘車日期" prop="date">
                    <el-date-picker v-model="temp.date" type="date" placeholder="請選擇乘車日期" value-format="yyyy-MM-dd" style="width: 100%" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < Date.now() - 8.64e7;
                        },
                      }" @change="getDiscount"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="9" v-if="temp.date">
                  <el-form-item label="乘車時間" prop="time">
                    <el-time-select @change="getDiscount" v-model="temp.time" :picker-options="{
                        start: timeStartTime,
                        step: '00:10',
                        end: '20:00',
                      }" placeholder="請選擇乘車時間" style="width: 100%">
                    </el-time-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="24">
                  <div>
                    <span class="unitBTitle">優先搭乘車行排序 (請依序點擊完成排序)</span>
                    <div class="unitBContainer" v-if="roleOrgB">
                      <div @click="handleOrgBSelect(item.id)" v-for="item in roleOrgB" :key="item.id" class="unitBBox">
                        {{ item.name }}
                        <div class="orgBIndex" v-if="orgBIndex(item.id) !== -1">
                          {{ orgBIndex(item.id) + 1 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>

                <!-- <el-col :sm="24" :md="24">
                  <el-form-item label="訂車人身份" prop="createdIdentity">
                    <el-select clearable v-model="temp.createdIdentity" placeholder="請選擇訂車人身份" style="width: 100%">
                      <el-option value="本人" label="本人">本人</el-option>
                      <el-option value="家屬" label="家屬">家屬</el-option>
                      <el-option value="A單位" label="A單位">A單位</el-option>
                      <el-option value="B單位" label="B單位">B單位</el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->

                <el-col :sm="24" :md="18">
                  <el-form-item label="起點" prop="fromAddr">
                    <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodFrom" @change="handleChange('from')" @visible-change="handleVisibleChangeFrom" ref="atc" :trigger-on-focus="false" v-model="temp.fromAddr" placeholder="請輸入起點" style="width: 100%">
                      <el-option v-for="item in searchResultsFrom" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="6">
                  <el-form-item label="起點備註" prop="fromAddrRemark">
                    <el-select clearable v-model="temp.fromAddrRemark" placeholder="請選擇備註" style="width: 100%">
                      <el-option value="醫院診所" label="醫院診所">醫院診所</el-option>
                      <el-option value="洗腎中心" label="洗腎中心">洗腎中心</el-option>
                      <el-option value="復健診所" label="復健診所">復健診所</el-option>
                      <el-option value="住家" label="住家">住家</el-option>
                      <el-option value="其他" label="其他">其他</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col v-if="
                    !['醫院診所', '洗腎中心', '復健診所', '住家', ''].includes(
                      temp.fromAddrRemark
                    )
                  " :sm="24" :md="24">
                  <el-form-item label="起點備註-其他">
                    <el-input v-model="temp.fromRemark" placeholder="請輸入起點備註"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="18">
                  <el-form-item label="迄點" prop="toAddr">
                    <el-select filterable :default-first-option="false" remote :remote-method="remoteMethodTo" @change="handleChange('to')" @visible-change="handleVisibleChangeTo" ref="atc" :trigger-on-focus="false" v-model="temp.toAddr" placeholder="請輸入迄點" style="width: 100%">
                      <el-option v-for="item in searchResultsTo" :key="item.place_id" :value="item.place_id" :label="item.description"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="6">
                  <el-form-item label="訖點備註" prop="toAddrRemark">
                    <el-select clearable v-model="temp.toAddrRemark" placeholder="請選擇備註" style="width: 100%">
                      <el-option value="醫院診所" label="醫院診所">醫院診所</el-option>
                      <el-option value="洗腎中心" label="洗腎中心">洗腎中心</el-option>
                      <el-option value="復健診所" label="復健診所">復健診所</el-option>
                      <el-option value="住家" label="住家">住家</el-option>
                      <el-option value="其他" label="其他">其他</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col v-if="
                    !['醫院診所', '洗腎中心', '復健診所', '住家', ''].includes(
                      temp.toAddrRemark
                    )
                  " :sm="24" :md="24">
                  <el-form-item label="訖點備註-其他">
                    <el-input v-model="temp.toRemark" placeholder="請輸入訖點備註"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12">
                  <el-form-item label="預約回程(回居住地址)">
                    <el-radio-group v-model="temp.isBackTemp">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12">
                  <el-form-item label="回程乘車時間">
                    <el-time-select :disabled="!temp.isBackTemp" v-model="temp.reTime" :picker-options="{
                        start: temp.time,
                        step: '00:10',
                        end: '20:00',
                      }" placeholder="請選擇回程乘車時間" style="width: 100%">
                    </el-time-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12">
                  <el-form-item label="願意共乘">
                    <el-radio-group v-model="temp.canShared">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="6">
                  <el-form-item label="車種" prop="carCategoryId">
                    <el-select clearable v-model="temp.carCategoryId" placeholder="請選擇車種" style="width: 100%" @change="temp.wheelchairType = ''">
                      <el-option v-for="item in carCategorysList" :value="item.dtValue" :label="item.name" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="6">
                  <el-form-item label="輪椅" prop="wheelchairType">
                    <el-select clearable v-model="temp.wheelchairType" placeholder="請選擇輪椅" style="width: 100%">
                      <el-option v-if="temp.carCategoryId === 'SYS_CAR_GENERAL'" value="無" label="無">無</el-option>
                      <el-option v-if="temp.carCategoryId === 'SYS_CAR_GENERAL'" value="普通輪椅(可收折)" label="普通輪椅(可收折)">普通輪椅(可收折)</el-option>
                      <el-option v-if="temp.carCategoryId === 'SYS_CAR_WEAL'" value="普通輪椅" label="普通輪椅">普通輪椅</el-option>
                      <el-option value="高背輪椅" label="高背輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">高背輪椅</el-option>
                      <el-option value="電動輪椅" label="電動輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">電動輪椅</el-option>
                      <el-option value="電動高背輪椅" label="電動高背輪椅" v-if="temp.carCategoryId === 'SYS_CAR_WEAL'">電動高背輪椅</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12">
                  <el-form-item label="陪同人數" prop="familyWith">
                    <el-select clearable @change="getDiscount" v-model.number="temp.familyWith" placeholder="請選擇陪同人數" style="width: 100%">
                      <el-option v-for="num in 8" :key="num - 1" :value="num - 1" :label="`${num - 1}人`"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12">
                  <el-form-item label="簡訊號碼" prop="noticePhone">
                    <el-input v-model="temp.noticePhone" placeholder="請輸入簡訊號碼"></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </div>
          <div class="dispatchFooter">
            <el-button style="height: 40px" type="info" @click="handleSubmit">立即預約</el-button>
            <el-button style="height: 40px" type="info">新增下個地點</el-button>
          </div>
        </div>

        <!-- 歷史訂單 -->
        <div class="bg-white historyContainer">
          <SubTitle title="歷史訂單"></SubTitle>
          <el-table ref="mainTable" :data="list" border fit v-loading="listLoading" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
            <el-table-column property="reserveDate" label="預約日期" width="150" align="center">
              <template slot-scope="scope">
                <span>{{
                scope.row.reserveDate | globalDateFilter("yyyy-MM-DD")
              }}</span>
              </template>
            </el-table-column>
            <el-table-column property="reserveDate" label="預約時間" width="100" align="center">
              <template slot-scope="scope">
                <span>{{
                scope.row.reserveDate | globalDateFilter("HH:mm")
              }}</span>
              </template>
            </el-table-column>
            <el-table-column property="carCategoryName" label="車輛類型" width="200" align="center"></el-table-column>
            <el-table-column property="noticePhone" label="聯絡電話" width="150" align="center">
            </el-table-column>
            <el-table-column property="canShared" label="是否共乘">
              <template slot-scope="scope">
                <span v-if="scope.row.canShared">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column property="passengerNum" label="搭乘人數"></el-table-column>
            <el-table-column property="fromAddr" label="起點"></el-table-column>
            <el-table-column property="toAddr" label="訖點"></el-table-column>

            <el-table-column property="setting" label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <div class="buttonFlexBox">
                  <el-button size="mini" @click="handleCopy(scope.row)" type="success">複製訂單</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- amt dialog -->
    <el-dialog title="補助餘額" :visible.sync="amtDialog" width="400px">
      <div class="amtDialogBody">
        <p>總額度：$0</p>
        <p>使用額度：$0</p>
        <p>剩餘額度：$0</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="amtDialog = false">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template> 

<script>
import { mapGetters } from "vuex";
import moment from "moment";

import acMixins from "@/mixins/autoComplete.js";

import Sticky from "@/components/Sticky";
import SubTitle from "@/components/SubTitle";

import * as org from "@/api/orgs";
import * as user from "@/api/users";
import * as caseUser from "@/api/caseUsers";
import * as orderCaseUser from "@/api/orderCaseUser";
import * as category from "@/api/categorys";
import * as mapss from "@/api/map";
export default {
  mixins: [acMixins],
  components: {
    Sticky,
    SubTitle,
  },
  data() {
    return {
      /* 今天日期 */
      today: "",

      /* user unit b */
      useBunit: [],

      /* 歷史訂單 */
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        orgId: "",
        key: undefined,
      },
      total: "",

      /* 全域資料 */
      userInfo: "",
      roleInfo: "",
      orgBList: [],
      carCategorysList: [],
      roleOrgB: [], //身份擁有的B單位
      discountData: [], //預估金額資料

      /* 表單相關 */
      labelPosition: "top",
      temp: {
        //未整理資料
        date: "", //預約日期
        time: "", //預約時間
        haveNextOrderFlag: false, //是否預約回程
        reTime: null, //預約回程時間

        /* 主要資料 */
        id: "",
        userId: "",
        caseUserId: "",
        orgId: "",
        reserveDate: "",
        transOrgs: [],
        // createdIdentity: "",
        fromAddr: "",
        fromAddrRemark: "",
        toAddr: "",
        toAddrRemark: "",
        remark: "",
        fromRemark: "",
        toRemark: "",
        isBack: false,
        isBackTemp: false,
        canShared: false,
        carCategoryId: "",
        carCategoryName: "",
        wheelchairType: "",
        familyWith: "",
        noticePhone: "",
      },
      rules: {
        date: [{ required: true, message: "必填欄位", tigger: "change" }],
        time: [{ required: true, message: "必填欄位", tigger: "change" }],
        // createdIdentity: [
        //   { required: true, message: "必填欄位", tigger: "change" },
        // ],
        fromAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        fromAddrRemark: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        toAddr: [{ required: true, message: "必填欄位", tigger: "change" }],
        toAddrRemark: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        carCategoryId: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        wheelchairType: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        familyWith: [{ required: true, message: "必填欄位" }],
        noticePhone: [{ required: true, message: "必填欄位", tigger: "blur" }],
      },

      /* 補助餘額 */
      amtDialog: false,
    };
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
    timeStartTime() {
      let time;
      if (this.temp.date !== this.today) {
        time = "06:00";
      } else {
        let nowHr = moment().format("HH");
        this.$cl(nowHr);
        let nowMin =
          (Math.floor(moment().format("hh:mm").split(":")[1] / 10) + 1) * 10;

        if (nowMin == 60) {
          nowMin = "00";
          nowHr++;
        }

        time = `${nowHr}:${nowMin}`;
      }
      return time;
    },
    /* 判斷當前登入用戶組織是否為orgB且判斷是否為快速預約訂單 */
    isOrgB() {
      const vm = this;
      return vm.useBunit.includes(vm.defaultorgid);
    },
  },
  filters: {
    distanceFilter(val) {
      return (
        Math.round(Math.round(val * Math.pow(10, (2 || 0) + 1)) / 10000) /
        Math.pow(10, 2 || 0)
      );
    },
    durationFilter(val) {
      return Math.round(val / 60);
    },
  },
  methods: {
    /* 獲取用戶資料 */
    getUser() {
      user
        .getClient({ id: this.$route.params.id.split("-")[0] })
        .then((res) => {
          this.userInfo = res.result;
        });
    },

    /* 獲取長照資料 */
    getCaseUser() {
      const vm = this;
      caseUser.get({ id: this.$route.params.id.split("-")[1] }).then((res) => {
        console.log(res.result);
        let caseUserTemp = res.result;
        // 判定是否有經緯度
        if (!res.result.lat) {
          console.log("個案資料無經緯度");
          let _addr = `${res.result.county}${res.result.district}${res.result.addr}`;

          mapss.geocode({ _addr }).then((place) => {
            console.log(place);
            let data = {
              lat: place.result.lat,
              lon: place.result.lon,
            };
            vm.setMarker(data, "from");
            vm.temp.fromAddr = `${caseUserTemp.county}${caseUserTemp.district}${caseUserTemp.addr}`;
            vm.temp.fromAddrRemark = "住家";
            vm.fromAddr = `${caseUserTemp.county}${caseUserTemp.district}${caseUserTemp.addr}`;
          });
        } else {
          let data = {
            lat: res.result.lat,
            lon: res.result.lon,
          };
          vm.setMarker(data, "from");
          vm.temp.fromAddr = `${caseUserTemp.county}${caseUserTemp.district}${caseUserTemp.addr}`;
          vm.temp.fromAddrRemark = "住家";
          vm.fromAddr = `${caseUserTemp.county}${caseUserTemp.district}${caseUserTemp.addr}`;
        }
      });
    },

    /* 獲取歷史訂單 */
    getList() {
      const vm = this;
      orderCaseUser
        .loadHistory({ userId: vm.$route.params.id.split("-")[0] })
        .then((res) => {
          vm.list = res.result;
        });
    },

    /* 複製訂單 */
    handleCopy(order) {
      const vm = this;
      console.log(order);
      vm.temp = Object.assign({}, order); // copy obj
      vm.$set(this.temp, "transOrgs", []);
      // vm.temp.isBackTemp = false;
      vm.$set(this.temp, "isBackTemp", false);
      vm.$set(this.temp, "reTime", null);
      vm.fromAddr = order.fromAddr;
      vm.toAddr = order.toAddr;
      // vm.handleOrgBSelect(order.orgId * 1);
      vm.$nextTick(() => {
        vm.setOldMarker({ lat: vm.temp.fromLat, lon: vm.temp.fromLon }, "from");
        vm.setOldMarker({ lat: vm.temp.toLat, lon: vm.temp.toLon }, "to");
      });
    },

    /* 獲取身份資料 */
    getRole() {
      const vm = this;
      caseUser.get({ id: this.$route.params.id.split("-")[1] }).then((res) => {
        this.roleInfo = res.result;
        console.log(this.roleInfo);

        vm.useBunit = [
          res.result.orgBId1,
          res.result.orgBId2,
          res.result.orgBId3,
        ];

        // 判定是否為B單位
        if (vm.useBunit.includes(vm.defaultorgid)) {
          //若登入單位包含用戶所選B單位(B單位訂車)
          this.roleOrgB = this.orgBList.filter((i) => i.id === vm.defaultorgid);
          vm.handleOrgBSelect(vm.defaultorgid);
        } else {
          this.roleOrgB = this.orgBList.filter((i) =>
            vm.useBunit.includes(i.id)
          );
        }
      });
    },

    /* 獲取所有B單位 */
    async getOrgB() {
      await org.getOrgB().then((res) => {
        this.orgBList = res.result;
      });
    },

    /* 排序B單位 */
    handleOrgBSelect(id) {
      console.log(id);
      const vm = this;
      !vm.temp.transOrgs.includes(id)
        ? vm.temp.transOrgs.push(id)
        : (vm.temp.transOrgs = vm.temp.transOrgs.filter((i) => i !== id));
    },

    /* B單位index */
    orgBIndex(val) {
      const vm = this;
      return vm.temp.transOrgs.indexOf(val);
    },

    /* 獲取車種 */
    getCarCategorys() {
      const vm = this;
      let query = {
        page: 1,
        limit: 20,
        TypeId: "SYS_CAR",
      };
      category.getList(query).then((res) => {
        vm.carCategorysList = res.data.filter((car) => {
          return (
            car.dtValue === "SYS_CAR_GENERAL" || car.dtValue === "SYS_CAR_WEAL"
          );
        });
      });
    },

    /* 獲取預估金額 */
    getDiscount() {
      const vm = this;
      let params = {
        CaseUserId: vm.$route.params.id.split("-")[1],
        FromAddr: vm.fromAddr, //桃園市龜山區復興街林口長庚紀念醫院
        ToAddr: vm.toAddr, //桃園市龜山區頂湖路桃園長庚醫院
        FamilyWith: vm.temp.familyWith, //2
        ReservationDate: `${vm.temp.date} ${vm.temp.time}`, //2020-12-22 00:05
      };
      if (
        vm.temp.date &&
        vm.temp.time &&
        vm.toAddr &&
        vm.fromAddr &&
        vm.temp.familyWith !== ""
      ) {
        orderCaseUser.getDiscount(params).then((res) => {
          vm.$cl(res);
          // vm.discountData = [res.result];
          let back = JSON.parse(JSON.stringify(res.result));

          vm.$set(vm.discountData, 0, res.result);
          vm.$set(vm.discountData, 1, back);

          // vm.discountData[0] = res.result;
          vm.discountData[0].direction = "去程";
          // vm.discountData[1] = res.result;
          vm.discountData[1].direction = "回程";
          // vm.$forceUpdate();
        });
      } else {
        vm.$cl("資料不全 無法計算金額");
      }
    },

    /* 起迄點互換 */
    handleChangeAddr() {
      const vm = this;
      [vm.toAddr, vm.fromAddr] = [vm.fromAddr, vm.toAddr];
      [vm.searchResultsFrom, vm.searchResultsTo] = [
        vm.searchResultsTo,
        vm.searchResultsFrom,
      ];
      [vm.temp.fromAddr, vm.temp.toAddr] = [vm.temp.toAddr, vm.temp.fromAddr];
    },

    /* 立即預約 */
    handleSubmit() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (vm.specialValidate(vm.temp)) {
            vm.temp.reserveDate = `${vm.temp.date} ${vm.temp.time}`;
            vm.temp.carCategoryName = vm.carCategorysList.filter((i) => {
              return i.dtValue === vm.temp.carCategoryId;
            })[0].name;
            vm.temp.fromAddr = vm.fromAddr;
            vm.temp.toAddr = vm.toAddr;
            vm.temp.userId = vm.$route.params.id.split("-")[0];
            vm.temp.caseUserId = vm.$route.params.id.split("-")[1];
            vm.temp.toAddrRemark =
              vm.temp.toAddrRemark === "其他"
                ? vm.temp.toRemark
                : vm.temp.toAddrRemark;
            vm.temp.fromAddrRemark =
              vm.temp.fromAddrRemark === "其他"
                ? vm.temp.fromRemark
                : vm.temp.fromAddrRemark;
            vm.temp.orgId = vm.isOrgB ? vm.defaultorgid : "";
            vm.$cl(vm.temp);
            orderCaseUser.add(vm.temp).then((res) => {
              vm.$cl(res);
              //有預約回程時
              if (vm.temp.isBackTemp) {
                //變更isback:FIXME:
                vm.temp.isBack = true;
                //起迄點背著互換
                vm.fromAddrRemark = vm.toAddrRemark;
                //複製temp
                let backTemp = Object.assign({}, vm.temp);
                //修改時間
                backTemp.reserveDate = `${backTemp.date} ${backTemp.reTime}`;
                //修改起點 (去程迄點)
                backTemp.fromAddr = backTemp.toAddr;
                //修改迄點 (身份居住地址)
                backTemp.toAddr = `${vm.roleInfo.county}${vm.roleInfo.district}${vm.roleInfo.addr}`;
                vm.$cl(backTemp);
                orderCaseUser.add(backTemp).then(() => {
                  this.$router.go(-1);
                });
              } else {
                this.$router.go(-1);
              }
            });
          } else {
            this.$cl("submit error");
          }
        } else {
          console.log("submit error");
        }
      });
    },

    /* 特殊欄位驗證 B單位順序 起點背著（其他） 迄點背著（其他） 回程時間 */
    specialValidate(data) {
      const vm = this;
      let validateTemp = [
        //驗證B單位是否排序
        () => {
          if (data.transOrgs.length <= 0) {
            return "請確實排序優先搭乘車行";
          } else {
            return true;
          }
        },

        //起點備註若是選擇其他
        () => {
          if (data.fromAddrRemark === "其他" && data.fromRemark === "") {
            return "請確實填寫起點備註";
          } else {
            return true;
          }
        },

        //迄點備註若是選擇其他
        () => {
          if (data.toAddrRemark === "其他" && data.toRemark === "") {
            return "請確實填寫迄點備註";
          } else {
            return true;
          }
        },

        //預約回程
        () => {
          if (data.isBackTemp && data.reTime === null) {
            return "請確實填寫回程乘車時間";
          } else {
            return true;
          }
        },
      ].map((fn) => {
        return fn();
      });
      this.$cl(validateTemp);

      if (validateTemp.every((result) => result === true)) {
        this.$cl("pass");
        return true;
      } else {
        this.$cl("NoPass");
        let alertMsg = validateTemp
          .filter((res) => {
            return res !== true;
          })
          .join(",");
        vm.$alertM.fire({
          icon: "error",
          title: alertMsg,
        });
        this.$cl(alertMsg);
        return false;
      }
    },

    /* 補助餘額查詢 */
    handleCheckAmt() {
      const vm = this;
      vm.amtDialog = true;
    },

    /* 若有query 有 orderId 則複製該筆order資料 反之將caseuser居住地址帶入起點*/
    getOrder() {
      const vm = this;
      if (this.$route.query.orderId) {
        orderCaseUser.get({ id: this.$route.query.orderId }).then((res) => {
          console.log(res);
          this.temp = res.result;
          vm.$set(this.temp, "transOrgs", []);
          vm.$set(this.temp, "isBackTemp", false);
          vm.$set(this.temp, "reTime", null);
          vm.$set(this.temp, "date", "");
          vm.$set(this.temp, "time", "");
          vm.$set(this.temp, "toRemark", this.temp.toAddrRemark);
          vm.$set(this.temp, "fromRemark", this.temp.fromAddrRemark);
          this.temp.toAddrRemark = [
            "醫院診所",
            "洗腎中心",
            "復健診所",
            "住家",
          ].includes(this.temp.toAddrRemark)
            ? this.temp.toAddrRemark
            : "其他";
          this.temp.fromAddrRemark = [
            "醫院診所",
            "洗腎中心",
            "復健診所",
            "住家",
          ].includes(this.temp.fromAddrRemark)
            ? this.temp.fromAddrRemark
            : "其他";
          vm.toAddr = vm.temp.toAddr;
          vm.fromAddr = vm.temp.fromAddr;
          vm.$nextTick(() => {
            vm.setOldMarker(
              { lat: vm.temp.fromLat, lon: vm.temp.fromLon },
              "from"
            );
            vm.setOldMarker({ lat: vm.temp.toLat, lon: vm.temp.toLon }, "to");
          });
        });
      } else {
        vm.getCaseUser();
      }
    },

    /* 換頁 */
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
  },
  async mounted() {
    this.today = moment().format("yyyy-MM-DD");
    this.getUser();
    this.getCarCategorys();
    await this.getOrgB();
    // this.getCaseUser();
    this.getRole(); //獲取case user B單位
    this.getOrder();
    this.getList(); //歷史訂單
  },
};
</script>

<style lang="scss" scoped>
.mainContainer {
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.mapContainer {
  width: 49%;
  height: 100%;
  background: lightcoral;
}

.discountContainer {
  position: absolute;
  width: 45%;
  left: 2%;
  bottom: 1rem;
  // height: 300px;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0px 0px 1rem #a1a0a0;
  z-index: 9;
  opacity: 0.9;
  transition: 0.5s;

  &:hover {
    opacity: 1;
  }
}

.directionContainer {
  height: calc(100% - 103px);
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.directionTitle {
  text-align: center;
  padding: 0.5rem 0;
  background: $--color-primary-light-8;
  position: relative;
}

.tableToggle {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  cursor: pointer;
  transition: 0.5s;

  &.close {
    transform: rotate(180deg);
  }
}

.orderAddr {
  padding-left: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100px;
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
    background: #fff;
    bottom: -1px;
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

.dispatchContainer {
  width: 50%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 24px;
  padding-top: 12px;
}

.caseUserName {
  height: 7%;
  // background: lightseagreen;
  border-bottom: 1px dashed #aaaaaa;
  display: flex;
  font-weight: 700;
  align-items: center;
  font-size: 2rem;
  color: $--color-primary;
}

.dispatchDetail {
  height: 86%;
  // background: lightsteelblue;
  border-bottom: 1px dashed #aaaaaa;
  overflow: auto;
  overflow-x: hidden;
}

.dispatchFooter {
  height: 7%;
  display: flex;
  // background: lightpink;
  justify-content: flex-end;
  align-items: center;
}

.unitBTitle {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}

.unitBContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  justify-content: space-between;
  position: relative;
}

.unitBBox {
  width: 49%;
  cursor: pointer;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: $--color-primary-light-8;
  border: 1px solid #ddd;
  text-align: center;
}

.orgBIndex {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $--color-primary;
  opacity: 0.7;
}

.historyContainer {
  width: 100%;
  padding: 1rem 1.5rem;
}
</style>
