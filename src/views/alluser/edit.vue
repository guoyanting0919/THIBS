<template>
  <div class="flex-column allUserAdd">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" type="success">儲存</el-button>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="編輯個案基本資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="基本資料編輯"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="個案照片" prop="Id">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                >
                  <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="個案編號" prop="Id">
                <el-input
                  v-model="temp.Id"
                  placeholder="請輸入個案編號"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="性別">
                <el-select
                  clearable
                  v-model="temp.Id"
                  placeholder="請選擇性別"
                  style="width: 100%"
                >
                  <el-option :value="1" :label="'男'">男</el-option>
                  <el-option :value="2" :label="'女'">女</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="姓名">
                <el-input
                  placeholder="請輸入個案姓名"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="生日">
                <el-date-picker
                  v-model="temp.Id"
                  type="date"
                  placeholder="請選擇生日"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="身份證字號">
                <el-input
                  v-model="temp.Id"
                  placeholder="請輸入個案身分證字號"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="社會福利身份">
                <el-select
                  v-model="temp.Id"
                  placeholder="社會福利身份"
                  style="width: 100%"
                >
                  <el-option :value="1" :label="'低收入戶'">低收入戶</el-option>
                  <el-option :value="2" :label="'中低收入戶'"
                    >中低收入戶</el-option
                  >
                  <el-option :value="3" :label="'一般戶'">一般戶</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="手機">
                <el-input
                  placeholder="格式:0987654321"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="市話">
                <el-input
                  placeholder="格式:0287654321"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="個案身份">
                <el-select
                  v-model="temp.Id"
                  placeholder="請選擇個案身份"
                  style="width: 100%"
                >
                  <el-option :value="1" :label="'公費個案'">公費個案</el-option>
                  <el-option :value="2" :label="'自費個案'">自費個案</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="額度控管留用首月">
                <el-date-picker
                  v-model="temp.Id"
                  type="month"
                  style="width: 100%"
                  placeholder="請選擇額度控管留用首月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="管理單位">
                <el-input
                  placeholder="請選擇管理單位"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="失能等級">
                <el-select
                  v-model="temp.Id"
                  placeholder="請選擇失能等級"
                  style="width: 100%"
                >
                  <el-option :value="1" :label="'1級(無失能)'"
                    >1級(無失能)</el-option
                  >
                  <el-option :value="2" :label="'2級'">2級</el-option>
                  <el-option :value="3" :label="'3級'">3級</el-option>
                  <el-option :value="4" :label="'4級'">4級</el-option>
                  <el-option :value="5" :label="'5級'">5級</el-option>
                  <el-option :value="6" :label="'6級'">6級</el-option>
                  <el-option :value="7" :label="'7級'">7級</el-option>
                  <el-option :value="8" :label="'8級'">8級</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="可否派發">
                <el-select
                  v-model="temp.Id"
                  placeholder="請選擇派發狀態"
                  style="width: 100%"
                >
                  <el-option :value="1" :label="'可派發'">可派發</el-option>
                  <el-option :value="2" :label="'不可派發'">不可派發</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="12">
              <el-form-item label="不可派發原因">
                <el-input v-model="temp.Id"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="24">
              <el-form-item label="居住地">
                <el-row :gutter="16">
                  <el-col :sm="12" :md="6" style="margin-bottom: 1rem">
                    <el-form-item prop="city">
                      <el-select
                        v-model="temp.city"
                        clearable
                        placeholder="請選擇居住縣市"
                        style="width: 100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="6" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-select
                        v-model="temp.Id"
                        placeholder="請選擇居住區域"
                        style="width: 100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="Id">
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="temp.Id"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="24">
              <el-form-item label="輪住地址">
                <el-row
                  :gutter="16"
                  v-for="(item, index) in temp.lun"
                  :key="index"
                  style="margin-bottom: 1rem"
                >
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-select
                        v-model="item.value1"
                        clearable
                        placeholder="居住縣市"
                        style="width: 100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-select
                        v-model="item.value2"
                        clearable
                        placeholder="居住地區"
                        style="width: 100%"
                      >
                        <el-option :value="1" :label="'可派發'"
                          >可派發</el-option
                        >
                        <el-option :value="2" :label="'不可派發'"
                          >不可派發</el-option
                        >
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="8" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value3"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value4"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="3" style="margin-bottom: 1rem">
                    <el-form-item>
                      <el-input
                        placeholder="請輸入居住地址"
                        v-model="item.value5"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :sm="3"
                    :md="2"
                    style="text-align: center; margin-bottom: 1rem"
                  >
                    <el-button type="danger" @click="delLun(item)"
                      >刪除</el-button
                    >
                  </el-col>
                  <el-col
                    :sm="3"
                    :md="2"
                    style="text-align: center; margin-bottom: 1rem"
                  >
                    <el-button type="info" @click="delLun(item)"
                      >轉換</el-button
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :sm="24" style="text-align: center">
              <el-button type="primary" @click="addLun">新增輪住地址</el-button>
            </el-col>
          </el-row>

          <SubTitle title="緊急聯絡人資訊"></SubTitle>
          <el-row :gutter="24">
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人姓名">
                <el-input
                  placeholder="請輸入聯絡人姓名"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="關係">
                <el-input placeholder="請輸入關係" v-model="temp.Id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人手機">
                <el-input
                  placeholder="請輸入聯絡人手機"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="聯絡人市話">
                <el-input
                  placeholder="請輸入聯絡人市話"
                  v-model="temp.Id"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <SubTitle title="備註"></SubTitle>
          <el-input type="textarea" v-model="temp.Id"></el-input>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      // 表單相關
      labelPosition: "top",
      temp: {
        Id: "",
        cuty: "",
        lun: [
          {
            value1: "",
            value2: "",
            value3: "",
            value4: "",
            value5: "",
          },
        ],
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    addLun() {
      this.temp.lun.push({
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        key: Date.now(),
      });
    },
    delLun(item) {
      let index = this.temp.lun.indexOf(item);
      if (index !== -1) {
        this.temp.lun.splice(index, 1);
      }
    },
  },
  mounted() {
    console.log(this.$store.getters.modules);
    let router2 = this.$store.getters.modules;
    let a = router2.filter((r) => {
      return r.item.name == "個案資料";
    });
    let b = a[0].children.filter((r2) => {
      return r2.item.name == "全部個案";
    });
    console.log(b[0].item.elements);
  },
};
</script>

<style lang="scss" scoped></style>
