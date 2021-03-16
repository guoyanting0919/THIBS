<template>
  <div v-loading="imageLoading" element-loading-text="請稍等，圖片上傳中">
    <quill-editor
      ref="myTextEditor"
      v-model="content"
      :options="quillOption"
      @change="onEditorChange($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    >
    </quill-editor>
    // 這個是elementui的上傳，把它display:none
    <el-upload
      style="display: none"
      :class="name"
      :action="upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-progress="onProgress"
    >
    </el-upload>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import * as upload from "@/api/upload.js";
import Quill from "quill";

import quillConfig from "./quill_config.js";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  props: {
    // 富文字內容
    value: String,
    // 富文字的名字 同一個頁面的多個富文字name不能重複的
    name: String,
    // 圖片型別
    imgType: {
      type: Array,
      default: () => [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ],
    },
    // 圖片限制大小 單位 M
    limitSize: {
      type: Number,
      default: 1,
    },
  },
  components: {
    quillEditor,
  },
  mounted() {
    //
    quillConfig.initButton();
    var vm = this;
    // 當點選圖書上傳是，觸發elementui的upload點選
    var imgHandler = async function (image) {
      vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection();
      if (image) {
        document.querySelector(`.${vm.name} input`).click();
      }
    };

    vm.$refs.myTextEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  },
  model: {
    props: "content",
    // 必須的change事件不然是不會響應的
    event: "change",
  },
  computed: {
    content: {
      get: function () {
        return this.value;
      },
      set: function () {},
    },
  },
  data() {
    return {
      // 配置檔案
      quillOption: quillConfig,
      imageLoading: false,
      upload: upload.upload(),
    };
  },
  methods: {
    onEditorChange(e) {
      this.$emit("change", e.html);
    },
    onEditorFocus(e) {
      this.$emit("focus", e);
    },
    onEditorReady(e) {
      this.$emit("ready", e);
    },
    // 圖片上傳成功
    handleAvatarSuccess(res) {
      // console.log(res, file);
      if (res.code == 200) {
        // this.form.custom_logo_url = res.data.url;
        let url = res.data.url,
          vm = this;

        if (url !== null && url.length > 0) {
          var value = url;

          // ***主要的東西就是這裡：上傳成功回顯
          vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection();
          value = value.indexOf("http") != -1 ? value : "http:" + value;
          vm.$refs.myTextEditor.quill.insertEmbed(
            vm.addImgRange !== null ? vm.addImgRange.index : 0,
            "image",
            value,
            Quill.sources.USER
          );
        } else {
          vm.$message.warning("圖片增加失敗");
        }
      } else {
        this.$message.error(res.message);
      }
      this.imageLoading = false;
    },
    // 圖片上傳前
    beforeAvatarUpload(file) {
      let date = new Date().getTime();
      let imgType = this.imgType;

      const fileType = file.type;
      const isLt1M = file.size / 1024 / 1024 < this.limitSize;

      const isAllowType = imgType.indexOf(fileType) != -1;
      // console.log(fileType);
      // const isPng = fileType == 'image/jpeg';

      if (!isAllowType) {
        this.$message.error("請上傳符合檔案格式的圖片!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("上傳logo圖片大小不能超過 1MB!");
        return false;
      }
      return isAllowType && isLt1M;
    },
    onProgress() {
      this.imageLoading = true;
    },
  },
};
</script>