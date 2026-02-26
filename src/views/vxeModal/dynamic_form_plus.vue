<template>
  <div id="dynamic_form_plus" class="page_content">
    <article>
      <el-form
        :model="ruleForm"
        :rules="validateRules"
        ref="ruleForm"
        :label-width="labelWidth"
        :disabled="disabled"
      >
        <template v-for="(item, index) in formItems">
          <div
            v-if="item.children && item.children.length > 0"
            :key="'formItems' + index"
            class="parent_div"
            :class="item.itemClass"
          >
            <div
              class="form_item_merge_label"
              :style="item.width ? { width: item.width } : {}"
            >
              <span class="form_item_merge_label_span"> {{ item.title }}</span>
            </div>
            <el-form-item
              v-for="(item2, index2) in item.children"
              :key="'formItems' + index + 'children' + index2"
              :label="item2.title"
              :prop="item2.field"
              :class="item2.itemClass"
              :style="item2.width ? { width: item2.width } : { width: '100%' }"
              style="position: relative"
            >
              <el-icon
                :size="16"
                v-if="item2.editRender && item2.editRender.icons"
                style="
                  position: absolute;
                  right: 0;
                  top: 0;
                  z-index: 100;
                  cursor: pointer;
                "
                color="#0cb088"
              >
                <Edit
                  v-if="item2.editRender.icons.includes('edit')"
                  @click="getData(item2)"
                ></Edit>
              </el-icon>

              <el-input
                v-if="
                  item2.editRender.name == 'ElInput' &&
                  (!item2.editRender.props.type ||
                    item2.editRender.props.type == 'text')
                "
                v-model="ruleForm[item2.field]"
                type="text"
                :disabled="item2.disabled"
                :clearable="item2.editRender.props.clearable"
              ></el-input>
              <el-input
                v-if="
                  item2.editRender.name == 'ElInput' &&
                  item2.editRender.props.type == 'number'
                "
                v-model="ruleForm[item2.field]"
                type="number"
                :min="item2.editRender.props.min"
                :max="item2.editRender.props.max"
                :disabled="item2.disabled"
                :step="item2.editRender.props.step"
                :clearable="item2.editRender.props.clearable"
              ></el-input>
              <el-input-number
                v-if="item2.editRender.name == 'ElInputNumber'"
                v-model="ruleForm[item2.field]"
                :min="item2.editRender.props.min"
                :max="item2.editRender.props.max"
                :disabled="item2.disabled"
                :step="item2.editRender.props.step"
                controls-position="right"
              />
              <el-input
                v-if="
                  item2.editRender &&
                  item2.editRender.name == 'ElInput' &&
                  item2.editRender.props.type == 'textarea'
                "
                v-model="ruleForm[item2.field]"
                type="textarea"
                :clearable="item2.editRender.props.clearable"
                :disabled="item2.disabled"
                :rows="6"
              ></el-input>

              <el-date-picker
                v-if="
                  item2.editRender.name == 'ElDatePicker' &&
                  ['year', 'month', 'date', 'datetime'].includes(
                    item2.editRender.props.type,
                  )
                "
                v-model="ruleForm[item2.field]"
                :type="item2.editRender.props.type"
                :value-format="item2.editRender.props.valueFormat"
                :disabled="item2.disabled"
                :label-format="item2.editRender.props.labelFormat"
              ></el-date-picker>

              <el-select
                v-if="item2.editRender.name == 'ElSelect'"
                v-model="ruleForm[item2.field]"
                :clearable="item2.editRender.props.clearable"
                :filterable="item2.editRender.props.filterable"
                :multiple="item2.editRender.props.multiple"
                :disabled="item2.disabled"
              >
                <template
                  v-if="
                    item2.editRender.options &&
                    item2.editRender.options.length > 0
                  "
                >
                  <el-option
                    v-for="(item1, index1) in item2.editRender.options"
                    :key="
                      'formItems' +
                      index +
                      'children' +
                      index2 +
                      item.field +
                      index1
                    "
                    :value="item1.value"
                    :label="item1.label"
                  ></el-option>
                </template>
              </el-select>
              <el-radio-group
                v-if="item2.editRender.name == '$radio'"
                v-model="ruleForm[item2.field]"
                :disabled="item2.disabled"
              >
                <template
                  v-if="
                    item2.editRender.options &&
                    item2.editRender.options.length > 0
                  "
                >
                  <el-radio
                    v-for="(item1, index1) in item2.editRender.options"
                    :key="'radio' + index + item.field + index1"
                    :value="item1.value"
                    >{{ item1.label }}
                  </el-radio>
                </template>
              </el-radio-group>
              <vxe-upload
                v-if="item2.editRender.name == 'vxeUpload'"
                v-model="ruleForm[item2.field]"
                :disabled="item2.disabled"
                :multiple="item2.editRender.props.multiple"
                :file-types="item2.editRender.props.types"
                :more-config="moreConfig"
                :show-tip="false"
                show-download-button
                button-text="上传"
                :limit-size="item2.editRender.props.limitSize"
                :upload-method="(e) => uploadMethod(e, item2)"
                :download-method="downloadMethod"
                :remove-method="removeMethod"
                :preview-method="previewMethod"
              >
              </vxe-upload>
              <p v-if="!item2.editRender.name">{{ ruleForm[item2.field] }}</p>
            </el-form-item>
          </div>
          <el-form-item
            v-else
            :key="'formItems' + index"
            :label="item.title"
            :prop="item.field"
            :class="item.itemClass"
            :style="item.width ? { width: item.width } : { width: '100%' }"
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
              :min="item.editRender.props.min"
              :max="item.editRender.props.max"
              :step="item.editRender.props.step"
              :clearable="item.editRender.props.clearable"
            ></el-input>
            <el-input-number
              v-if="item.editRender.name == 'ElInputNumber'"
              v-model="ruleForm[item.field]"
              :min="item.editRender.props.min"
              :max="item.editRender.props.max"
              :step="item.editRender.props.step"
              controls-position="right"
            />
            <el-input
              v-if="
                item.editRender &&
                item.editRender.name == 'ElInput' &&
                item.editRender.props.type == 'textarea'
              "
              v-model="ruleForm[item.field]"
              type="textarea"
              :clearable="item.editRender.props.clearable"
              :rows="6"
            ></el-input>
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
                >选择
              </el-button>
            </template>

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

            <el-select
              v-if="item.editRender.name == 'ElSelect'"
              v-model="ruleForm[item.field]"
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
            <p v-if="!item.editRender.name">{{ ruleForm[item.field] }}</p>
          </el-form-item>
        </template>
      </el-form>
    </article>
    <footer v-if="showFooter">
      <el-button type="gradientGray" @click="$emit('close')">取消</el-button>
      <el-button
        v-for="(item, index) in footerButtonList"
        :key="'footerButtonList' + index"
        :type="item.type"
        @click="btnClick(item)"
        >{{ item.name }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import czSelect from "@/views/czsb/czSelect.vue";
import zcqSbD5000 from "@/views/czsb/zcq-sb-d5000/index.js";
import zcqSbOms from "@/views/czsb/zcq-sb-oms/index.js";
import zcqSbDky from "@/views/czsb/zcq-sb-dky.vue";
import commonApi from "@/api/common-api.js";
import { Edit } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";

export default {
  name: "dynamic_form_plus",
  components: { Edit },
  props: {
    validateRules: Array,
    row: Object,
    tableHeaderList: Array,
    labelWidth: {
      type: String,
      default: "auto",
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
    for (let i = 0; i < this.formItems[i].children; i++) {
      if (this.formItems[i].field) {
        obj[this.formItems[i].field] = "";
      }
      for (const { field } of this.formItems[i].children) {
        obj[field] = "";
      }
    }

    this.ruleForm = Object.assign({}, obj);
    // 不能省啊，给空对象赋字段，以便双向绑定

    for (var key in this.row) {
      this.ruleForm[key] = this.row[key];
    }
  },
  methods: {
    refreshData() {
      this.ruleForm = JSON.parse(JSON.stringify(this.originData));
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
    btnClick(item) {
      switch (item.name) {
        case "刷新":
          this.refreshData();
          break;
        case "保存":
          this.doSubmit();
          break;
        case "打印":
          this.doPrint();
          break;
        case "取消":
          this.$emit("close");
          break;
        default:
          this.$emit("doOperate", { data: this.ruleForm, btn: item });
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
      if (this.$store.state.isXzs) {
        commonApi.preViewFileGetService({ fileId: option.id });
      } else {
        commonApi.preViewFileService({ fileId: option.id }).then((res) => {
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
      }
    },
    getData(item) {
      this.ruleForm[item.field] = this.$store.state.userInfo.sysUser.nickName;
      this.ruleForm[item.editRender.associateField] = dayjs().format(
        "YYYY-MM-DD HH:mm:ss",
      );
    },
  },
};
</script>
<style>
#dynamic_form_plus .el-form-item__error {
  top: 75%;
  left: 11px;
}

#dynamic_form_plus .whole_row .el-form-item__error {
  top: 90%;
}

#dynamic_form_plus .el-form-item__content .vxe-upload {
  width: 100%;
}

#dynamic_form_plus .el-form-item__label {
  background-color: #d7f4ed;
  border: solid 1px #0cb088;
  border-bottom: 0;
  line-height: 24px;
  padding: 20px 6px;
  height: auto !important;
  display: flex;
  align-items: center;
  //width: 180px !important;
}

#dynamic_form_plus .child > .el-form-item__label {
  width: 120px !important;
}

#dynamic_form_plus .el-form-item__content {
  /*width: 65%;*/
  /* background-color: #f9f9f9; */
  background-color: #f8fafc;
  border: solid 1px #d5d5d5;
  padding: 7px 11px;
  border-left: none;
  border-right: none;
  border-bottom: 0;
  width: calc(100% - 180px);
}

#dynamic_form_plus .el-form-item.borderRight .el-form-item__content {
  border-right: solid 1px #d5d5d5;
}

#dynamic_form_plus .el-form-item.borderBottom .el-form-item__content {
  border-bottom: solid 1px #d5d5d5;
}

#dynamic_form_plus .el-form-item.borderBottom .el-form-item__label {
  border-bottom: solid 1px #0cb088;
}

#dynamic_form_plus .el-form-item.whole_row .el-form-item__content {
  padding: 12px 11px;
}

#dynamic_form_plus .el-form-item.whole_row .el-form-item__label {
  line-height: 40px;
}

#dynamic_form_plus .el-form-item.height2 .el-form-item__label {
  line-height: 120px;
}

#dynamic_form_plus .parent_div {
  position: relative;
  text-align: right;
  word-wrap: break-word;
}

#dynamic_form_plus .parent_div.borderBottom .form_item_merge_label {
  border-bottom: solid 1px #0cb088;
}

#dynamic_form_plus .form_item_merge_label {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #d7f4ed;
  border: solid 1px #0cb088;
  border-right: none;
  border-bottom: 0;
  padding: 20px 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#dynamic_form_plus .form_item_merge_label_span {
  width: 20px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: center;
}
</style>
<style scoped lang="scss">
#dynamic_form_plus {
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
      margin-bottom: 0;
    }
  }

  footer {
    padding: 8px 0;
    text-align: center;
  }
}
</style>
