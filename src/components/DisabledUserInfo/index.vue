<template>
  <el-row :gutter="16">
    <el-col :sm="12" :md="4">
      <el-form-item label="姓名">
        <el-input
          disabled
          placeholder="請輸入個案姓名"
          v-model="temp.name"
        ></el-input>
      </el-form-item>
    </el-col>
    <el-col :sm="12" :md="2">
      <el-form-item label="性別">
        <el-select
          disabled
          clearable
          v-model="temp.sex"
          placeholder="請選擇性別"
          style="width: 100%"
        >
          <el-option :value="1" :label="'男'">男</el-option>
          <el-option :value="0" :label="'女'">女</el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :sm="12" :md="4">
      <el-form-item label="身份證字號">
        <el-input
          disabled
          v-model="temp.uid"
          placeholder="請輸入個案身分證字號"
        ></el-input>
      </el-form-item>
    </el-col>
    <el-col :sm="12" :md="4">
      <el-form-item label="生日">
        <el-date-picker
          disabled
          v-model="temp.birthday"
          type="date"
          placeholder="請選擇生日"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :sm="12" :md="5">
      <el-form-item label="手機">
        <el-input
          disabled
          v-model="temp.phone"
          placeholder="請輸入手機"
        ></el-input>
      </el-form-item>
    </el-col>
    <el-col :sm="12" :md="5">
      <el-form-item label="市話">
        <el-input disabled v-model="temp.tel" placeholder="暫無資料"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "disabledUserInfo",
  props: {
    temp: {
      type: Object,
      default: () => {}, //預設
      required: true, //是否必填
    },
  },
};
</script>

<style>
</style>