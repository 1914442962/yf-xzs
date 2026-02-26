<template>
  <div id="zfxgk" class="page_content">
    <header>
      <section>
        <div class="header-item">
          历史版本：
          <el-select
            v-model="version"
            placeholder="请选择"
            style="width: 400px"
            filterable
            clearable
          >
            <el-option
              v-for="item in versionOptions"
              :key="item.title"
              :label="item.title"
              :value="item.title"
            >
            </el-option>
          </el-select>
        </div>
      </section>
      <section>
        <div class="header-item">
          <el-button type="gradientBlue" @click="doClear">重新生成</el-button>
          <el-button type="gradientBlue" @click="doSave(false)">保存</el-button>
          <el-button type="gradientBlue" @click="doSave(true)">导出</el-button>
        </div>
      </section>
    </header>
    <article>
      <el-form :model="formData" label-width="0" :key="mathKey">
        <el-form-item>
          <!--          <el-input-->
          <!--            v-model="formData.title"-->
          <!--            size="large"-->
          <!--            class="title_input"-->
          <!--            readonly-->
          <!--          />-->
          <p class="title_input">{{ formData.title }}</p>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formData.first"
            type="textarea"
            autosize
            resize="none"
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formData.second"
          :key="'second' + index"
        >
          <el-input
            v-model="item.text"
            autosize
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item>
          <p style="text-align: center; color: #666; width: 100%">
            {{ formData.tableName1 }}
          </p>
          <vxe-grid v-bind="gridOptions1" ref="xTable" style="width: 100%">
          </vxe-grid>
        </el-form-item>
        <el-form-item>
          <Editor
            v-model="formData.third"
            mode="default"
            style="width: 100%"
            :default-config="editorConfig"
            @onCreated="handleCreated"
          ></Editor>
        </el-form-item>
        <el-form-item>
          <p style="text-align: center; color: #666; width: 100%">
            {{ formData.tableName2 }}
          </p>
          <vxe-grid v-bind="gridOptions2" ref="xTable" style="width: 100%">
          </vxe-grid>
        </el-form-item>
      </el-form>
    </article>
  </div>
</template>
<script>
import zfxyjApi from "@/api/fxyj/zfxyj-api.js";
import "@wangeditor/editor/dist/css/style.css";
import { Editor } from "@wangeditor/editor-for-vue";
import commonApi from "@/api/common-api.js";

export default {
  name: "zfxgk",
  components: { Editor },
  data() {
    return {
      formData: {
        title: "",
        first: "",
        second: [],
        third: "",
        table1: [],
        table2: [],
        tableName2: "",
        tableName1: "",
      },
      editorConfig: {
        hoverbarKeys: {
          text: {
            // menuKeys: ['bold','through','color','bgColor','clearStyle']
            menuKeys: ["bold", "clearStyle"],
          },
        },
      },
      editorRef: {},
      mathKey: -1,
      version: null,
      versionOptions: [],
    };
  },
  watch: {
    version: {
      handler() {
        this.loadPage();
      },
      immediate: false,
    },
  },
  computed: {
    gridOptions1() {
      return {
        keepSource: true,
        border: true, //边框
        round: true, //圆角边框
        stripe: true,
        headerAlign: "center",
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        radioConfig: {
          highlight: true,
        },
        checkboxConfig: {
          highlight: true,
        },
        columnConfig: {
          resizable: true,
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
        },
        headerCellClassName: "row-class",
        data: this.formData.table1,
        columns: [
          {
            field: "xh",
            title: "序号",
            width: 80,
          },
          {
            field: "sy",
            title: "五级预警事由",
            minWidth: 200,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "time",
            title: "时段",
            width: 210,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
        ],
      };
    },
    gridOptions2() {
      return {
        keepSource: true,
        border: true, //边框
        round: true, //圆角边框
        stripe: true,
        headerAlign: "center",
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        radioConfig: {
          highlight: true,
        },
        checkboxConfig: {
          highlight: true,
        },
        columnConfig: {
          resizable: true,
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
        },
        headerCellClassName: "row-class",
        data: this.formData.table2,
        columns: [
          {
            field: "xh",
            title: "序号",
            width: 80,
          },
          {
            field: "sy",
            title: "六级预警事由",
            minWidth: 200,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "time",
            title: "时段",
            width: 210,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
        ],
      };
    },
  },
  created() {
    this.initPage();
  },
  methods: {
    handleCreated(editor) {
      this.editorRef = editor;
    },
    initPage() {
      zfxyjApi.getZFxgkIsExistService({}).then((res) => {
        zfxyjApi.getFxgkService({ lx: "周" }).then((res0) => {
          this.versionOptions = res0.data;
          if (res.data == "是" && this.versionOptions.length > 0) {
            this.version = this.versionOptions[0].title;
          } else {
            this.version = "";
          }
        });
      });
    },
    loadPage() {
      if (this.version) {
        let res = JSON.parse(
          this.versionOptions.filter((i) => i.title === this.version)[0].sj,
        );
        res.data.second = res.data.second.map((item) => {
          return {
            text: item,
          };
        });
        this.formData = res.data;
        this.mathKey = Math.random();
      } else {
        zfxyjApi.loadGkDataService({}).then((res) => {
          res.data.second = res.data.second.map((item) => {
            return {
              text: item,
            };
          });
          this.formData = res.data;
          this.mathKey = Math.random();
        });
      }
    },
    doSave(flag) {
      let obj = JSON.parse(JSON.stringify(this.formData));
      obj.second = obj.second.map((i) => i.text);
      // obj.third = this.editorRef.getText();
      // console.log(this.editorRef.getHtml())
      // console.log(this.editorRef.getText())
      zfxyjApi.saveGkDataService({ data: obj }).then((res) => {
        if (flag) {
          commonApi.downloadFileGetService({ fileId: res.data.id });
        } else {
          this.$message.success("保存成功");
          this.initPage();
        }
      });
    },
    doClear() {
      this.version = "";
    },
  },
};
</script>
<style>
#zfxgk .title_input {
  text-align: center;
  font-weight: bold;
  background-color: transparent;
  font-size: 18px;
}

#zfxgk .title_input .el-input__wrapper {
  background-color: transparent;
  font-size: 18px;
}

#zfxgk .title_input .el-input__inner {
  text-align: center;
  font-weight: bold;
}

#zfxgk .w-e-text-container {
  background-color: transparent;
  text-indent: 30px;
  font-size: 16px;
}

#zfxgk .el-textarea__inner {
  background-color: transparent;
  text-indent: 30px;
  line-height: 40px;
  font-size: 16px;
}

#zfxgk strong span {
  font-weight: bold;
}
</style>
<style scoped lang="scss">
#zfxgk {
  width: 816px;
  margin: 4px auto;

  //background: #fff;
  article {
    width: 100%;
    height: calc(100% - 48px);
    overflow-y: auto;
  }
}
</style>
