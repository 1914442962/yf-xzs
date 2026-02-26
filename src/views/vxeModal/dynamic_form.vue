<template>
  <div id="dynamic_form" class="page_content">
    <article>
      <el-scrollbar height="100%">
        <el-form
          :model="ruleForm"
          :rules="validateRules"
          ref="ruleForm"
          :label-width="labelWidth"
          :disabled="isDisabled"
        >
          <el-form-item
            v-for="(item, index) in formItems"
            :key="'formItems' + index"
            :label="item.title + '：'"
            :prop="item.field"
            :style="
              item.colWidth ? { width: item.colWidth } : { width: '100%' }
            "
          >
            <el-input
              v-if="
                item.editRender.name == 'ElInput' &&
                (!item.editRender.props.type ||
                  item.editRender.props.type == 'text')
              "
              v-model="ruleForm[item.field]"
              type="text"
              :clearable="item.editRender.props.clearable"
            ></el-input>
            <el-input
              v-if="
                item.editRender.name == 'ElInput' &&
                item.editRender.props.type == 'number'
              "
              v-model="ruleForm[item.field]"
              type="number"
              :clearable="item.editRender.props.clearable"
            ></el-input>
            <el-input
              v-if="
                item.editRender &&
                item.editRender.name == 'ElInput' &&
                item.editRender.props.type == 'textarea'
              "
              v-model="ruleForm[item.field]"
              type="textarea"
              :clearable="item.editRender.props.clearable"
              :autosize="{ minRows: 2, maxRows: 6 }"
            ></el-input>
            <el-select
              v-if="item.editRender.name == 'ElSelect'"
              v-model="ruleForm[item.field]"
              @focus="focusMethod(item)"
              :clearable="item.editRender.props.clearable"
              :filterable="item.editRender.props.filterable"
              :multiple="item.editRender.props.multiple"
            >
              <template
                v-if="
                  item.editRender.options && item.editRender.options.length > 0
                "
              >
                <el-option
                  v-for="(item1, index1) in item.editRender.options"
                  :key="'formItems' + index + item.field + index1"
                  :value="item1.value"
                  :label="item1.label"
                ></el-option>
              </template>
            </el-select>
            <el-tree-select
              v-if="item.editRender.name == '$ElTreeSelect'"
              v-model="ruleForm[item.field]"
              :filterable="item.editRender.props.filterable"
              :render-after-expand="false"
              check-strictly
              :data="item.editRender.data"
              :clearable="item.editRender.props.clearable"
              :multiple="item.editRender.props.multiple"
              collapse-tags
              collapse-tags-tooltip
              tag-type=""
            >
            </el-tree-select>
            <el-input-number
              v-if="item.editRender.name == 'ElInputNumber'"
              v-model="ruleForm[item.field]"
              :min="item.editRender.props.min"
              :max="item.editRender.props.max"
              :step="item.editRender.props.step"
              controls-position="right"
            />
            <el-date-picker
              v-if="
                item.editRender.name == 'ElDatePicker' &&
                ['year', 'month', 'date', 'datetime'].includes(
                  item.editRender.props.type,
                )
              "
              v-model="ruleForm[item.field]"
              :type="item.editRender.props.type"
              :value-format="item.editRender.props.valueFormat"
              :label-format="item.editRender.props.labelFormat"
            ></el-date-picker>
            <el-radio-group
              v-if="item.editRender.name == '$radio'"
              v-model="ruleForm[item.field]"
            >
              <template
                v-if="
                  item.editRender.options && item.editRender.options.length > 0
                "
              >
                <el-radio
                  v-for="(item1, index1) in item.editRender.options"
                  :key="'radio' + index + item.field + index1"
                  :value="item1.value"
                  >{{ item1.label }}
                </el-radio>
              </template>
            </el-radio-group>
            <vxe-upload
              v-if="item.editRender.name == 'vxeUpload'"
              v-model="ruleForm[item.field]"
              :disabled="isDisabled"
              :multiple="item.editRender.props.multiple"
              :file-types="item.editRender.props.types"
              :more-config="moreConfig"
              :show-tip="false"
              show-download-button
              button-text="上传"
              :limit-size="item.editRender.props.limitSize"
              :upload-method="(e) => uploadMethod(e, item)"
              :download-method="downloadMethod"
              :remove-method="removeMethod"
            >
            </vxe-upload>
            <el-tiptap
              v-if="item.editRender.name == 'ElTiptap'"
              v-model:content="ruleForm[item.field]"
              :extensions="extensions"
            ></el-tiptap>
            <template
              v-if="item.editRender && item.editRender.name == '$modal'"
            >
              <el-input
                v-model="ruleForm[item.field]"
                readonly
                style="width: calc(100% - 78px); margin-right: 10px"
                :title="ruleForm[item.field]"
              ></el-input>
              <el-button
                @click="selectBtn(item)"
                type="primary"
                style="margin-right: 8px"
                >选择</el-button
              >
            </template>
            <p v-if="!item.editRender.name">{{ ruleForm[item.field] }}</p>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </article>
    <footer>
      <el-button
        v-for="(item, index) in footerButtonList"
        :key="'footerButtonList' + index"
        :type="item.type"
        @click="btnClick(item)"
        >{{ item.name }}</el-button
      >
    </footer>
  </div>
</template>

<script>
import commonApi from "@/api/common-api";
import {
  Document,
  Text,
  Paragraph,
  Bold,
  Underline,
  Strike,
  Italic,
  FormatClear,
  BulletList,
  OrderedList,
} from "element-tiptap";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";
import czSelect from "@/views/czsb/czSelect.vue";
import zcqSbD5000 from "@/views/czsb/zcq-sb-d5000/index.js";
import zcqSbOms from "@/views/czsb/zcq-sb-oms/index.js";
import zcqSbDky from "@/views/czsb/zcq-sb-dky.vue";

export default {
  name: "dynamic_form",
  props: {
    validateRules: Array,
    row: Object,
    tableHeaderList: Array,
    isDisabled: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: "auto",
    },
    footerButtonList: {
      type: Array,
      default: [
        { type: "gradientDarkGreen", name: "刷新" },
        { type: "gradientBlue", name: "保存" },
      ],
    },
  },
  data() {
    return {
      ruleForm: {},
      formItems: [],
      extensions: [
        Document,
        Text,
        Paragraph,
        // Heading.configure({ level: 5 }),
        Bold.configure({ bubble: true }), // render command-button in bubble menu.
        Underline.configure({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        Italic.configure({ bubble: true }),
        Strike.configure({ bubble: true }),
        FormatClear.configure({ bubble: true }),
        History,
        BulletList,
        OrderedList,
      ],
      originData: {},
    };
  },
  computed: {
    moreConfig() {
      return {
        maxCount: 1,
        layout: "horizontal",
      };
    },
  },
  created() {
    this.originData = JSON.parse(JSON.stringify(this.row));
    console.log("行数据", this.row);
    this.formItems = this.tableHeaderList.filter(
      (i) =>
        !(
          i.type == "radio" ||
          i.type == "checkbox" ||
          i.type == "expand" ||
          i.type == "seq"
        ),
    );
    console.log("表单字段", this.formItems);
    //
    // 不能省啊，给空对象赋字段，以便双向绑定
    let obj = {};
    for (const { field } of this.formItems) {
      obj[field] = "";
    }
    this.ruleForm = Object.assign({}, obj);
    // 不能省啊，给空对象赋字段，以便双向绑定

    for (var key in this.row) {
      this.ruleForm[key] = this.row[key];
    }
  },
  methods: {
    focusMethod(item) {
      if (
        item.editRender.props.associate &&
        this.ruleForm[item.editRender.props.associateField]
      ) {
        let obj = {};
        obj[item.editRender.props.associateField] =
          this.ruleForm[item.editRender.props.associateField];
        commonApi
          .getAssociateOptionsService(item.editRender.props.associateUrl, obj)
          .then((res) => {
            item.editRender.options = res.data;
          });
      }
    },
    uploadMethod({ file }, item) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", this.ruleForm.id);
      formData.append("type", item.editRender.props.type);
      return commonApi.uploadFileService(formData).then((res) => {
        return res.data;
      });
    },
    downloadMethod({ option }) {
      commonApi.downloadFileGetService({ fileId: option.id });
    },
    removeMethod({ option }) {
      if (option.id) {
        commonApi
          .removeFileService({ fileId: option.id, id: this.ruleForm.id })
          .then(() => {
            this.$message.success("移除成功");
          });
      }
    },
    previewMethod({ option }) {
      commonApi.preViewFileService({ id: option.id }).then((res) => {
        let url = fileToBlobUrl(res, "pdf") + "#toolbar=0";
        this.$vxeModal.show(
          view_file,
          {
            url: url,
          },
          {
            width: 800,
            title: "文件预览",
            height: window.innerHeight - 20,
          },
          {},
        );
      });
    },
    selectBtn(item) {
      switch (item.editRender.props.type) {
        case "tdcs":
          this.selectCs(item);
          break;
        case "tdsb":
          this.selectSb(item);
          break;
      }
    },

    selectCs(item) {
      this.$vxeModal.show(
        czSelect,
        {
          omsDefaultNode: this.$store.state.omsDefaultNode,
          d5000DefaultNode: this.$store.state.d5000DefaultNode,
          showOMS: false,
        },
        {
          width: 600,
          height: 188,
          title: "选择停电厂站类型",
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          refreshCZXX: (e) => {
            this.ruleForm[item.field] = e.CZMC;
            this.ruleForm[item.field + "Id"] = e.CZID;
            this.ruleForm[item.field + "lx"] = e.tdcslx;
            this.ruleForm[item.field + "Param"] = e;
            this.ruleForm[item.field + "Param0"] = e;
          },
        },
      );
    },
    selectSb(item) {
      if (!this.ruleForm.tdcslx) {
        this.$message({
          message: "停电场所类型为空，请先选择停电场所",
          type: "warning",
        });
        return;
      }
      if (!this.ruleForm.tdcsParam) {
        this.$message({
          message: "当前为非对象化场所，请重选场所后再选择停电设备",
          type: "warning",
        });
        return;
      }
      let paramdata = {
        id: this.ruleForm.id,
        tdcsParam: this.ruleForm.tdcsParam,
        bdlx: "rjh-dd",
      };
      if (this.ruleForm.tdcslx == "D5000") {
        this.$vxeModal.show(
          zcqSbD5000,
          {
            paramdata,
            sblist: this.ruleForm[item.field + "List"],
            isCommon: true,
          },
          {
            width: 1000,
            height: 650,
            title: "设备选择-D5000",
          },
          {
            refreshSBXX: (data) => {
              this.ruleForm[item.field + "List"] = data;
              this.ruleForm[item.field + "List0"] = data;
              this.ruleForm[item.field + "Id"] = data
                .map((i) => i.sbid)
                .join(",");
              this.ruleForm[item.field] = data.map((i) => i.sbddmm).join(",");
            },
          },
        );
      } else if (this.ruleForm.tdcslx == "OMS") {
        this.$vxeModal.show(
          zcqSbOms,
          {
            paramdata,
            sblist: this.ruleForm[item.field + "List"],
            isCommon: true,
          },
          {
            width: 1000,
            height: 650,
            title: "设备选择-OMS",
          },
          {
            refreshSBXX: (data) => {
              this.ruleForm[item.field + "List"] = data;
              this.ruleForm[item.field + "List0"] = data;
              this.ruleForm[item.field + "Id"] = data
                .map((i) => i.sbid)
                .join(",");
              this.ruleForm[item.field] = data.map((i) => i.sbddmm).join(",");
            },
          },
        );
      } else if (this.ruleForm.tdcslx == "DKY") {
        // TODO 本地数据调控云
        this.$vxeModal.show(
          zcqSbDky,
          {
            paramdata,
            sblist: this.ruleForm[item.field + "List"],
            isCommon: true,
          },
          {
            width: 1000,
            height: 650,
            title: "设备选择-DKY",
          },
          {
            refreshSBXX: (data) => {
              this.ruleForm[item.field + "List"] = data;
              this.ruleForm[item.field + "List0"] = data;
              this.ruleForm[item.field + "Id"] = data
                .map((i) => i.sbid)
                .join(",");
              this.ruleForm[item.field] = data.map((i) => i.sbddmm).join(",");
            },
          },
        );
      }
    },
    btnClick(item) {
      switch (item.name) {
        case "刷新":
          this.refreshData();
          break;
        case "保存":
          this.doSubmit();
          break;
        case "取消":
          this.$emit("close");
          break;
        default:
          this.$emit("doOperate", { data: this.ruleForm, btn: item });
      }
    },
    refreshData() {
      this.ruleForm = JSON.parse(JSON.stringify(this.originData));
    },
    doSubmit() {
      console.log(this.ruleForm);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("doSubmit", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
#dynamic_form .el-form-item__error {
  top: 30px;
}

#dynamic_form .el-form-item__content .vxe-upload {
  width: 100%;
}
</style>
<style scoped lang="scss">
#dynamic_form {
  width: 100%;
  height: 100%;

  article {
    width: 100%;
    height: calc(100% - 48px);
    background-color: #ffffff;
    border-radius: 4px;
    overflow-y: auto;
    padding: 10px;

    .el-form-item {
      display: inline-flex;
    }
  }

  footer {
    padding: 8px 0;
    text-align: center;
  }
}
</style>
