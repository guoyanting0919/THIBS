<template>
  <div style="width: 100%;height: 100%;padding: 10px;box-sizing: border-box;">
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
import "./leipiFormDesign";
export default {
  name: "Ueditor",
  data() {
    return {
      editor: null,
      editorContent: this.content,
    };
  },
  props: {
    content: {
      type: String,
    },
    config: {
      type: Object,
    },
    fileds: {
      default: 0,
    },
    formType: {
      type: [String, Number],
    },
  },
  mounted() {
    var _this = this;
    console.log(window.ue);
    if (window.ue !== undefined) {
      window.ue.destroy();
    }

    this.$nextTick(() => {
      // this.editor = window.UE.getEditor('editor', this.config) // 初始化UE
      // 表單設計器
      _this.editor = window.UE.getEditor("editor", {
        initialFrameWidth: "100%",
        initialFrameHeight: 450,
        toolleipi: true, // 是否顯示，設計器的 toolbars
        textarea: "design_content",
        // 這裡可以選擇自己需要的工具按鈕名稱,此處僅選擇如下五個
        toolbars: [
          [
            "fullscreen",
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "fontborder",
            "strikethrough",
            "removeformat",
            "|",
            "forecolor",
            "backcolor",
            "insertorderedlist",
            "insertunorderedlist",
            "|",
            "fontfamily",
            "fontsize",
            "|",
            "indent",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "horizontal",
            "|",
            "inserttable",
            "deletetable",
            "mergecells",
            "splittocells",
          ],
        ],
        wordCount: false,
        elementPathEnabled: false,
        autoHeightEnabled: true,
        // initialFrameHeight: 430
      });
      window.ue = _this.editor;
      _this.editor.addListener("ready", function () {
        _this.$emit("ready"); // 通知父節點編輯器準備完畢
      });
    });
  },
  watch: {
    content: function (val) {
      if (val !== undefined && val !== "") {
        console.log(val);
        window.ue.setContent(val);
      }
    },
  },
  methods: {
    getObj() {
      // 獲取內容方法
      var content = this.editor.getContent();
      if (this.formType === "element-ui") {
        var dom = document.createElement("div");
        dom.innerHTML = content;
        var iframes = dom.querySelectorAll("iframe");
        var fileds = iframes.length;
        iframes.forEach((item) => {
          if (item && !item.getAttribute("name")) {
            item.setAttribute("name", `data_${fileds}`);
            fileds++;
          }
        });
        var returnOBj = {
          html: dom.innerHTML,
          content: dom.innerHTML,
        };
        return returnOBj;
      }
      return window.leipiFormDesign.parse_form(content, this.fileds);
    },
    destroyed() {
      this.editor.destroy();
    },
  },
};
</script>