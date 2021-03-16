<template>
  <div class="flex-column allUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input style="width: 200px; margin-right: 0.5rem" size="mini" v-model="listQuery.key" @keydown.native.enter="getList" clearable placeholder="請輸入關鍵字"></el-input>
        <!-- 權限按鈕 -->
        <permission-btn moduleName="builderTables" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- ㄒ資料 -->
      <Title title="全部用戶"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <LoadingWord :active='loadingActive' typing :text='"LOADING..."'></LoadingWord>

        <el-table ref="mainTable" height="calc(100% - 52px)" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">

          <el-table-column label="預約" width="100" align="center" fixed="left">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDespatch(scope.row)" type="info" v-if="
                  (hasButton('dispatchCaseUser') ||
                    hasButton('dispatchSelfPayUser') ||
                    hasButton('dispatchBusUser')) &&
                  scope.row.caseList.length != 0
                ">預約</el-button>
            </template>
          </el-table-column>

          <el-table-column property="name" label="姓名" width="200">
            <template slot-scope="scope">
              <div class="buttomColum">
                <p style="margin-right: auto">
                  {{ scope.row.name }}
                </p>
                <el-button size="mini" class="xsBtn" @click="handleUnlock(scope.row)" type="danger" v-if="hasButton('unlock') && !isLock(scope.row.unLockDate)">
                  <i class="iconfont icon-Vector21"></i>
                </el-button>
                <el-button size="mini" class="xsBtn" @click="handleAddOrEdit('edit', scope.row)" type="warning" v-if="hasButton('editBasic')">
                  <i class="iconfont icon-edit"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="setting" label="身份" width="250px">
            <template slot-scope="scope">
              <div class="roleButtomColum">
                <el-tag v-for="(item, idx) in scope.row.userTypes" :key="idx" type="primary">
                  {{ userRoleMap[item] }}
                </el-tag>
                <el-button style="margin-left: auto" size="mini" class="xsBtn" @click="
                    handleCheckRoles(scope.row);
                    rolesDialog = true;
                  " type="primary" v-if="hasButton('addRole')">
                  <i class="iconfont icon-xinzeng"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="uid" label="身分證字號" min-width="160" align="center">
            <template slot-scope="scope">
              {{ scope.row.uid | hideFilter }}
            </template>
          </el-table-column>

          <el-table-column property="phone" label="手機" min-width="170" align="center"></el-table-column>

          <el-table-column property="setting" label="操作" :fixed="isMobile()" width="400">
            <template slot-scope="scope">
              <div class="buttonFlexBox">
                <el-select style="margin: 0 0.5rem; width: 100px" size="mini" no-data-text="該用戶尚未新增身份" v-model="roles[scope.row.id]" placeholder="選擇身份" clearable>
                  <el-option v-for="item in scope.row.userTypeOption" :key="item.caseId" :label="userRoleMap[item.userType]" :value="`${item.userType}-${item.caseId}`">
                    {{ userRoleMap[item.userType] }}
                    <span v-if="item.caseUserNo">({{ item.caseUserNo }})</span>
                  </el-option>
                </el-select>
                <!-- 基本編輯 -->
                <el-button size="mini" @click="handleAddOrEdit('edit', scope.row)" type="warning" v-if="hasButton('editBasic') && !roles[scope.row.id]">編輯</el-button>
                <!-- 編輯長照 -->
                <el-button size="mini" @click="handleEditCaseUser(scope.row)" type="warning" v-if="
                    hasButton('editCaseUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'caseuser'
                  ">編輯</el-button>
                <!-- 編輯白牌 -->
                <el-button size="mini" @click="handleEditSelfPayUser(scope.row)" type="warning" v-if="
                    hasButton('editSelfPayUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'selfpayuser'
                  ">編輯</el-button>
                <!-- 編輯巴士 -->
                <el-button size="mini" @click="handleEditBusUser(scope.row)" type="warning" v-if="
                    hasButton('editBusUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'bususer'
                  ">編輯</el-button>
                <!-- 檢視長照個案 -->
                <el-button size="mini" @click="handleCheckCaseUser(scope.row)" type="success" v-if="
                    hasButton('checkCaseUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'caseuser'
                  ">檢視</el-button>
                <!-- 檢視白牌個案 -->
                <el-button size="mini" @click="handleCheckSelfPayUser(scope.row)" type="success" v-if="
                    hasButton('checkSelfPayUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'selfpayuser'
                  ">檢視</el-button>
                <!-- 檢視巴士個案 -->
                <el-button size="mini" @click="handleCheckBusUser(scope.row)" type="success" v-if="
                    hasButton('checkBusUser') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'bususer'
                  ">檢視</el-button>
                <el-button size="mini" @click="handleUnitB(scope.row)" type="primary" v-if="
                    hasButton('unitB') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'caseuser'
                  ">B單位</el-button>
                <el-button size="mini" @click="handleQuota(scope.row)" type="primary" v-if="
                    hasButton('quota') &&
                    roles[scope.row.id] &&
                    roles[scope.row.id].split('-')[0] == 'caseuser'
                  ">額度</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-if="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>
    </div>

    <!-- addOrUpdateDialog 新增/修改用戶基本資料-->
    <el-dialog :title="userDialogMap[userDialogTitle]" :visible.sync="addOrUpdateDialog" width="50%" style="min-width: 375px">
      <el-form :label-position="labelPosition" label-width="200px" :model="userTemp" :rules="userRules" ref="userForm">
        <el-row :gutter="16">
          <el-col :sm="24" :md="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userTemp.name" placeholder="請輸入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="出生年月日" prop="birthday">
              <el-date-picker v-model="userTemp.birthday" type="date" placeholder="請選擇生日" value-format="yyyy-MM-dd" style="width: 100%" :picker-options="{
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  },
                }" :disabled="userDialogTitle == 'edit'"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="身分證字號" prop="uid">
              <el-input v-model="userTemp.uid" :disabled="userDialogTitle == 'edit'" placeholder="請輸入身分證字號"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="性別" prop="sex">
              <el-select clearable v-model="userTemp.sex" placeholder="請選擇性別" style="width: 100%">
                <el-option :value="1" :label="'男'">男</el-option>
                <el-option :value="0" :label="'女'">女</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="手機" prop="phone">
              <span slot="label">手機</span>
              <el-input placeholder="格式:0987654321" v-model="userTemp.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="市話" prop="tel">
              <span slot="label">市話</span>
              <el-input placeholder="格式:0232134232" v-model="userTemp.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdate()">確 定</el-button>
      </span>
    </el-dialog>

    <!-- despatchDialog -->
    <el-dialog title="請選擇預約身份" :visible.sync="despatchDialog" width="500px">

      <div style="display: flex">
        <div style="margin-right: 8px" v-for="item in despatchOptions.caseList" :key="item.caseId">
          <!-- 長照派車 -->
          <el-button size="mini" @click="dispatchCaseUser(item)" type="info" v-if="hasButton('dispatchCaseUser') && item.userType == 'caseuser'">長照預約</el-button>
          <!-- 白牌派車 -->
          <el-button size="mini" @click="dispatchSelfPayUser(item)" type="info" v-if="
              hasButton('dispatchSelfPayUser') && item.userType == 'selfpayuser'
            ">白牌預約</el-button>
          <!-- 巴士派車 -->
          <el-button size="mini" @click="dispatchBusUser(item)" type="info" v-if="hasButton('dispatchBusUser') && item.userType == 'bususer'">巴士預約</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- rolesDialog -->
    <el-dialog title="請選擇欲新增的身份" :visible.sync="rolesDialog" width="500px">
      <div class="rolesBox">
        <p v-if="canUseRoles.length == 0">該用戶已擁有所有身份</p>
        <el-button v-if="hasButton('addCaseUser') && canUseRoles.includes('caseuser')" type="primary" plain @click="handleRole('1')">長照身份</el-button>
        <el-button v-if="
            hasButton('addSelfPayUser') && canUseRoles.includes('selfpayuser')
          " type="primary" plain @click="handleRole('2')">白牌身份</el-button>
        <el-button v-if="hasButton('addBusUser') && canUseRoles.includes('bususer')" type="primary" plain @click="handleRole('3')">幸福巴士身份</el-button>
      </div>
    </el-dialog>

    <!-- quotaDialog -->
    <el-dialog title="可用額度" :visible.sync="quotaDialog" width="600px">
      <div class="quotaBody">
        <div class="quotaData">
          <div class="quotaDataItem">
            <p>使用額度</p>
            <h1>${{ discountTemp.useDiscount }}</h1>
          </div>
          <div class="quotaDataItem">
            <p>剩餘額度</p>
            <h1>${{ discountTemp.lastDiscount }}</h1>
          </div>
          <div class="quotaDataItem">
            <p>本月可用額度</p>
            <h1>${{ discountTemp.totalDiscount }}</h1>
          </div>
        </div>
        <div class="addQuota">
          <p>新增額度</p>
          <div class="flex alignCeter">
            <el-input style="width: 200px; margin-right: 1rem" :disabled="!hasButton('editQuota')" v-model="amt"></el-input>
            <el-button type="primary" plain size="mini" @click="amt = 0">清空</el-button>
            <el-button type="primary" size="mini" @click="confirmQuota">確定</el-button>
          </div>
        </div>
        <div class="quotaHistory">
          <p class="quotaHistoryTitle">修改記錄</p>
          <p class="noQuotaHistory" v-if="discountList.length == 0">
            無修改記錄
          </p>
          <template v-else>
            <p class="quotaHistoryData" v-for="item in discountList" :key="item.id">
              {{ item.typeName }} ${{ item.amt }}
              {{ item.createDate | globalDateFilter("yyyy-MM-DD") }}
            </p>
          </template>
        </div>
      </div>
    </el-dialog>

    <!-- unitBDialog -->
    <el-dialog :title="unitBDialogTitle" :visible.sync="unitBDialog" width="50%">
      <el-checkbox-group v-model="checkedUnitBs" :min="0" :max="3">
        <el-checkbox v-for="unitB in unitBs" :label="unitB.id" :key="unitB.id">{{ unitB.name }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitBDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUnitB">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

import pbMixins from "@/mixins/permissionBtn.js";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import elDragDialog from "@/directive/el-dragDialog";
import LoadingWord from "@/components/LoadingWord";
import Pagination from "@/components/Pagination";

import * as users from "@/api/users";
import * as orgs from "@/api/orgs";
import * as caseUsers from "@/api/caseUsers";
import * as caseUserDiscounts from "@/api/caseUserDiscounts";
export default {
  name: "allUser",
  mixins: [pbMixins],
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
    LoadingWord,
  },
  directives: {
    elDragDialog,
  },
  data() {
    // 身份證字號驗證
    // let checkUid = (rule, value, callback) => {
    //   // 依照字母的編號排列，存入陣列備用。
    //   let letters = new Array(
    //     "A",
    //     "B",
    //     "C",
    //     "D",
    //     "E",
    //     "F",
    //     "G",
    //     "H",
    //     "J",
    //     "K",
    //     "L",
    //     "M",
    //     "N",
    //     "P",
    //     "Q",
    //     "R",
    //     "S",
    //     "T",
    //     "U",
    //     "V",
    //     "X",
    //     "Y",
    //     "W",
    //     "Z",
    //     "I",
    //     "O"
    //   );
    //   // 儲存各個乘數
    //   let multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    //   let nums = new Array(2);
    //   let firstChar;
    //   let firstNum;
    //   let lastNum;
    //   let total = 0;
    //   if (!value) {
    //     return callback(new Error("請輸入分證字號"));
    //   } else {
    //     let regExpID = /^[a-z](1|2)\d{8}$/i;
    //     if (value.search(regExpID) == -1) {
    //       return callback(new Error("格式錯誤"));
    //     } else {
    //       // 取出第一個字元和最後一個數字。
    //       firstChar = value.charAt(0).toUpperCase();
    //       lastNum = value.charAt(9);
    //     }
    //     for (let i = 0; i < 26; i++) {
    //       if (firstChar == letters[i]) {
    //         firstNum = i + 10;
    //         nums[0] = Math.floor(firstNum / 10);
    //         nums[1] = firstNum - nums[0] * 10;
    //         break;
    //       }
    //     }
    //     // 執行加總計算
    //     for (let i = 0; i < multiply.length; i++) {
    //       if (i < 2) {
    //         total += nums[i] * multiply[i];
    //       } else {
    //         total += parseInt(value.charAt(i - 1)) * multiply[i];
    //       }
    //     }
    //     // 和最後一個數字比對
    //     if (10 - (total % 10) != lastNum && 10 - (total % 10) != 10) {
    //       // console.log(10 - (total % 10), lastNum);
    //       return callback(new Error("格式錯誤"));
    //     } else {
    //       // console.log(10 - (total % 10), lastNum);
    //       callback();
    //     }
    //   }
    // };
    return {
      /* loading */
      loadingActive: false,
      // B單位相關
      unitBId: "802cdce7-1474-438f-b616-777cff9db321",
      unitBs: "",
      checkedUnitBs: [],

      roles: {},
      despatchRole: "",

      // dialog
      addOrUpdateDialog: false,
      userDialogTitle: "add",
      userDialogMap: {
        add: "新增用戶",
        edit: "編輯用戶",
      },
      quotaDialog: false,
      unitBDialog: false,
      rolesDialog: false,
      despatchDialog: false,
      despatchOptions: [],

      // table相關
      list: [],
      listLoading: false,
      listQuery: {
        // 查詢條件
        page: 1,
        limit: 20,
        orgId: "",
        key: undefined,
      },
      total: 0,
      multipleSelection: [], // 列表checkbox選中的值

      // 表單相關
      labelPosition: "top",
      userTemp: {
        id: undefined,
        account: "",
        password: "",
        name: "",
        birthday: "",
        uid: "",
        phone: "",
        tel: "",
        sex: "",
        status: 1,
        organizationIds: "",
      },
      caseUserTemp: {
        userId: "", //用戶id
        id: "", //身份id
        caseUserNo: "", //個案編號
        orgAId: "", //Ａ單位(管理單位)
        orgBId1: null, //B單位1
        orgBId2: null, //B單位2
        orgBId3: null, //B單位3
        disabilityLevel: "", //失能等級
        county: "", //居住縣市
        district: "", //居住區域
        addr: "", //居住地址
        lat: 0, //經度
        lon: 0, //緯度
        urgentName: "", //聯絡人姓名
        urgentRelationship: "", //聯絡人關係
        urgentPhone: "", //聯絡人手機
        urgentTel: "", //聯絡人市話
        remark: "", //備註
        caseUserStatus: "1", //可否派發
        statusReason: "", //不可派發原因
        reviewDate: "", //額度控管留用首月,
        wealTypeId: "", //社會福利身份
        wealTypeName: "", //社會福利身份
        isEffectNow: true, //是否生效
      },

      /* 額度相關 */
      discountList: [],
      discountTemp: {
        caseUserId: "",
        lastDiscount: "",
        totalDiscount: "",
        useDiscount: "",
      },
      amt: 0,

      /* 表單驗證 */
      userRules: {
        name: [
          { required: true, message: "請輸入姓名", trigger: "blur" },
          {
            min: 2,
            max: 99,
            message: "姓名長度最少兩字",
            trigger: "blur",
          },
        ],
        birthday: [
          { required: true, message: "請選擇出生日期", trigger: "blur" },
        ],
        uid: [
          { required: true, message: "請輸入身分證字號", trigger: "blur" },
          // { validator: checkUid, trigger: "blur" },
        ],
        sex: [{ required: true, message: "請選擇性別", trigger: "change" }],
        phone: [
          { required: true, message: "請輸入手機號碼", trigger: "blur" },
          {
            min: 8,
            max: 13,
            message: "號碼長度應為 8 ~ 13 碼",
            trigger: "blur",
          },
        ],
      },

      canUseRoles: [],
      roleSelect: "",

      value: "",
      value1: "",

      userRoleMap: {
        caseuser: "長照",
        selfpayuser: "白牌",
        bususer: "幸福巴士",
      },
    };
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
    unitBDialogTitle() {
      return `編輯長照個案 ${this.multipleSelection[0]?.name} B單位 ( ${this.checkedUnitBs.length}/3 )`;
    },
  },
  filters: {
    dateFilter(date, format) {
      let res = moment(date).format(format);
      return res;
    },
  },
  methods: {
    // 是否為移動端
    isMobile() {
      const vm = this;
      if (vm.$store.state.app.device === "mobile") {
        return null;
      } else {
        return "right";
      }
    },

    // 獲取用戶資料
    async getList() {
      const vm = this;
      vm.loadingActive = true;
      let ex = vm.buttons.join("").toLowerCase();
      await users.getClientList(vm.listQuery).then((res) => {
        // console.log(res.data, ex);
        let users = res.data.map((user) => {
          user.userTypeOption = [];
          user.userTypes = [];
          if (user.caseList.length > 0) {
            user.caseList.forEach((type) => {
              if (ex.includes(type.userType)) {
                user.userTypeOption.push(type);
              }
              if (!user.userTypes.includes(type.userType)) {
                user.userTypes.push(type.userType);
              }
            });
          } else {
            user.userTypeOption = [];
          }
          return user;
        });

        vm.list = users;
        vm.setDefaultRole();
        vm.total = res.count;
        vm.loadingActive = false;
      });
      // console.log("ss", vm.list);
    },
    // 換頁
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    // 獲取所有B單位
    getUnitBs() {
      const vm = this;
      orgs.getOrgB().then((res) => {
        vm.unitBs = res.result;
      });
    },
    // 獲取用戶基本資料
    getUserBasic(id) {
      const vm = this;
      users.getClient({ id }).then((res) => {
        console.log(res);
        vm.userTemp = Object.assign({}, res.result); // copy obj
      });
    },
    // 新增/編輯用戶基本資料
    handleAddOrEdit(act, user) {
      const vm = this;
      vm.userDialogTitle = act;
      if (act == "add") {
        vm.handleResetUserTemp();
        vm.addOrUpdateDialog = true;
      } else {
        this.handleEditBasic(user.id);
      }
    },
    // 預約訂車
    handleDespatch(data) {
      const vm = this;
      vm.despatchDialog = true;
      vm.despatchOptions = data;
      console.log(data);
    },
    // 編輯用戶基本資料
    handleEditBasic(id) {
      const vm = this;
      vm.getUserBasic(id);
      vm.addOrUpdateDialog = true;
      vm.userDialogTitle = "edit";
    },
    // 確認新增/修改用戶基本資料
    confirmAddOrUpdate() {
      const vm = this;
      let act = vm.userDialogTitle;
      if (act == "add") {
        vm.$refs.userForm.validate((valid) => {
          if (valid) {
            vm.userTemp.organizationIds = vm.defaultorgid;
            vm.userTemp.password = moment(vm.userTemp.birthday).format(
              "YYYYMMDD"
            );
            vm.userTemp.account = vm.userTemp.uid;
            users.addClient(vm.userTemp).then((res) => {
              vm.getList();
              console.log(res.result);
              let arr = [
                {
                  id: res.result,
                  fast: true,
                },
              ];
              console.log(arr);
              vm.multipleSelection = arr;
              vm.addOrUpdateDialog = false;
              vm.canUseRoles = ["selfpayuser", "bususer", "caseuser"];
              vm.$nextTick(() => {
                vm.rolesDialog = true;
              });
            });
          } else {
            console.log("error submit!!", vm.defaultorgid);
            return false;
          }
        });
      } else {
        vm.$refs.userForm.validate((valid) => {
          if (valid) {
            console.log(vm.userTemp);
            vm.userTemp.password = moment(vm.userTemp.birthday).format(
              "YYYYMMDD"
            );
            vm.userTemp.account = vm.userTemp.uid;
            users.addClient(vm.userTemp).then((res) => {
              vm.$alertT.fire({
                icon: "success",
                title: res.message,
              });
              vm.addOrUpdateDialog = false;
              vm.getList();
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 替用戶添加身份
    handleRole(role) {
      console.log(role);
      switch (role) {
        case "1":
          this.rolesDialog = false;
          this.$router.push(
            `/alluser/addCaseUser/${this.multipleSelection[0].id}?fast=${this.multipleSelection[0].fast}`
          );
          break;
        case "2":
          this.rolesDialog = false;
          this.$router.push(
            `/alluser/addSelfPayUser/${this.multipleSelection[0].id}?fast=${this.multipleSelection[0].fast}`
          );
          break;
        case "3":
          this.rolesDialog = false;
          this.$router.push(
            `/alluser/addBusUser/${this.multipleSelection[0].id}?fast=${this.multipleSelection[0].fast}`
          );
          break;
        default:
          break;
      }
    },

    // 帳號解鎖
    handleUnlock(user) {
      const vm = this;
      vm.$swal({
        title: "解鎖提示",
        text: `確認解鎖用戶 ${user.name} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          users.unlock({ id: user.id }).then((res) => {
            console.log(res);
            vm.$alertT.fire({
              icon: "success",
              title: `用戶${user.name} 解鎖成功`,
            });
            vm.getList();
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消解鎖`,
          });
        }
      });
    },

    // 獲取長照B單位
    handleUnitB(user) {
      const vm = this;
      vm.checkedUnitBs = [];
      vm.rowClick(user);
      let id = vm.roles[user.id].split("-")[1];
      caseUsers.get({ id }).then((res) => {
        // console.log(res);
        vm.caseUserTemp = Object.assign({}, res.result); // copy obj
        let str = `${vm.caseUserTemp.orgBId1},${vm.caseUserTemp.orgBId2},${vm.caseUserTemp.orgBId3}`;
        let arr = str.split(",");
        vm.checkedUnitBs = arr.filter((id) => {
          return id !== "null" && id !== "";
        });

        vm.unitBDialog = true;
      });
    },

    // 確認修改B單位
    confirmUnitB() {
      const vm = this;
      vm.caseUserTemp.orgBId1 = vm.checkedUnitBs[0] || null;
      vm.caseUserTemp.orgBId2 = vm.checkedUnitBs[1] || null;
      vm.caseUserTemp.orgBId3 = vm.checkedUnitBs[2] || null;
      console.log(vm.caseUserTemp);
      caseUsers.updateUnitB(vm.caseUserTemp).then((res) => {
        vm.$alertT.fire({
          icon: "success",
          title: res.message,
        });
        vm.unitBDialog = false;
      });
    },

    /* 獲取額度資料 */
    handleQuota(user) {
      const vm = this;
      vm.amt = 0;
      vm.rowClick(user);
      let caseUserId = vm.roles[user.id].split("-")[1];
      caseUserDiscounts.get({ caseUserId }).then((res) => {
        vm.discountTemp = Object.assign({}, res.result); // copy obj
        this.quotaDialog = true;
      });
      caseUserDiscounts
        .load({ caseUserId, page: 1, limit: 9999 })
        .then((res) => {
          vm.discountList = res.data;
          this.$cl(vm.discountList);
        });
    },

    /* 確認新增額度 */
    confirmQuota() {
      const vm = this;
      let temp = {
        caseUserId: vm.discountTemp.caseUserId,
        amt: vm.amt,
      };
      caseUserDiscounts.add(temp).then((res) => {
        vm.$alertT.fire({
          icon: "success",
          title: res.message,
        });
        this.quotaDialog = false;
      });
    },
    // 編輯長照資料
    handleEditCaseUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/editCaseUser/${user.id}-${caseId}`);
    },
    // 檢視長照資料
    handleCheckCaseUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/checkCaseUser/${user.id}-${caseId}`);
    },
    // 長照派車
    dispatchCaseUser(user) {
      this.despatchDialog = false;
      let caseId = user.caseId;
      let userId = user.userId;
      this.$router.push(`/alluser/dispatchCaseUser/${userId}-${caseId}`);
    },
    // 編輯白牌資料
    handleEditSelfPayUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/editSelfPayUser/${user.id}-${caseId}`);
    },
    // 檢視白牌資料
    handleCheckSelfPayUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/checkSelfPayUser/${user.id}-${caseId}`);
    },
    // 白牌派車
    dispatchSelfPayUser(user) {
      this.despatchDialog = false;
      let caseId = user.caseId;
      let userId = user.userId;
      this.$router.push(`/alluser/dispatchSelfPayUser/${userId}-${caseId}`);
    },

    // 編輯巴士資料
    handleEditBusUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/editBusUser/${user.id}-${caseId}`);
    },
    // 檢視巴士資料
    handleCheckBusUser(user) {
      let caseId = this.roles[user.id].split("-")[1];
      this.$router.push(`/alluser/checkBusUser/${user.id}-${caseId}`);
    },
    // 巴士派車
    dispatchBusUser(user) {
      this.despatchDialog = false;
      let caseId = user.caseId;
      let userId = user.userId;
      this.$router.push(`/alluser/dispatchBusUser/${userId}-${caseId}`);
    },
    //檢查用戶身份
    handleCheckRoles(user) {
      const vm = this;
      let params = {
        userId: user.id,
      };
      vm.rowClick(user);
      users.CheckRole(params).then((res) => {
        let map = ["selfpayuser", "bususer", "caseuser"];
        let arr = res.data.map((item) => {
          return item.userType;
        });
        vm.canUseRoles = map.filter(function (v) {
          return arr.indexOf(v) == -1;
        });
        console.log(vm.canUseRoles);
      });
    },

    handleResetUserTemp() {
      // this.$refs.userForm.resetFields();
      this.userTemp = {
        id: undefined,
        account: "",
        password: "",
        name: "",
        birthday: "",
        uid: "",
        phone: "",
        sex: "",
        status: 1,
        organizationIds: "",
      };
      if (this.$refs.userForm) {
        this.$refs.userForm.resetFields();
      }
    },
    // table 功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      // console.log(row);
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },

    onBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "search":
          this.getList();
          break;
        case "unitB":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleUnitB(this.multipleSelection[0]);
          break;
        case "add":
          // this.$router.push("/alluser/add/1");
          this.handleAddOrEdit("add");
          break;
        case "editBasic":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleAddOrEdit("edit", this.multipleSelection[0]);
          break;
        case "addRole":
          if (this.multipleSelection.length == 0) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
          } else if (this.multipleSelection.length > 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          } else {
            this.rolesDialog = true;
          }

          break;
        case "unlock":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleUnlock(this.multipleSelection[0]);
          break;
        default:
          break;
      }
    },

    // 功能內是否包含caseuser selfpayuser bususer
    canISelect(str) {
      let ex = this.buttons.join("").toLowerCase();
      return !ex.includes(str);
    },
    // 身份預設
    setDefaultRole() {
      const vm = this;
      vm.list.forEach((user) => {
        let defaultVal;
        if (user.userTypeOption.length > 0) {
          defaultVal = `${user.userTypeOption[0].userType}-${user.userTypeOption[0].caseId}`;
        } else {
          defaultVal = null;
        }
        vm.$set(vm.roles, `${user.id}`, defaultVal);
      });
    },
    // 鎖定狀態
    isLock(date) {
      if (date != null) {
        let today = moment().format();
        let flag = !moment(date).isAfter(today);
        return flag;
      } else {
        return true;
      }
    },
  },
  async mounted() {
    const vm = this;
    vm.getUnitBs();
    await vm.getList();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tag {
  margin-right: 8px;
}

.allUser {
  .el-checkbox {
    width: 50%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .rolesBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .quotaBody {
    width: 100%;
  }
  .quotaData {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  .quotaDataItem {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 16px;
      margin-bottom: 0.75rem;
    }
  }
  .addQuota {
    margin-bottom: 1.25rem;
    p {
      font-size: 16px;
      margin-bottom: 0.5rem;
    }
  }
  .quotaHistoryTitle {
    font-size: 1rem;
    background: $--color-primary-light-8;
    padding: 0.5rem 0;
  }

  .quotaHistoryData {
    padding: 0.25rem 0;
    border-bottom: 1px solid $--color-primary-light-8;

    &:nth-child(2n + 1) {
      background: $--color-primary-light-9;
    }
  }

  .noQuotaHistory {
    text-align: center;
    color: red;
  }

  .buttomColum {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
  }

  .roleButtomColum {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .xsBtn {
    padding: 0.25rem;
  }

  // .quotaHistory {
  //   p
  // }
}
</style>
