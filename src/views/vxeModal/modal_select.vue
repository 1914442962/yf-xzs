<template>
  <div id="modal_basic">
    <article>
      <p v-if="isHeader">
        {{ headStr }}
      </p>
      <div v-if="formComponent.includes('select')" class="form_item">
        <el-select
          v-model="formObj.selectStr"
          filterable
          allow-create
          :clearable="clearable"
          default-first-option
        >
          <el-option
            :value="items.value"
            :label="items.label"
            v-for="(items, indexs) in selectOptions"
            :key="indexs + 'selectOptions'"
          ></el-option>
        </el-select>
      </div>
      <div v-if="formComponent.includes('daterange')" class="form_item">
        <el-date-picker
          v-model="formObj.daterange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          :clearable="clearable"
        >
        </el-date-picker>
      </div>
      <div v-if="formComponent.includes('date')" class="form_item">
        <el-date-picker
          v-model="formObj.date"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          placeholder="日期"
          :clearable="clearable"
          :disabled="dateDisable"
        >
        </el-date-picker>
      </div>
      <div v-if="formComponent.includes('year')" class="form_item">
        <el-date-picker
          v-model="formObj.year"
          type="year"
          value-format="YYYY"
          format="YYYY"
          placeholder="年份"
          :clearable="clearable"
        >
        </el-date-picker>
      </div>
      <div v-if="formComponent.includes('datetime')" class="form_item">
        <el-date-picker
          v-model="formObj.datetime"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="YYYY-MM-DD HH:MM"
        >
        </el-date-picker>
      </div>
      <div v-if="formComponent.includes('radio')" class="form_item">
        <el-radio-group v-model="formObj.radio">
          <el-radio
            :label="item"
            v-for="(item, index) in radioList"
            :key="index + 'radioList'"
          ></el-radio>
        </el-radio-group>
      </div>
      <div
        v-if="formComponent.includes('checkbox')"
        class="form_item"
        style="margin: 0 auto"
        :style="{ width: checkboxWidth }"
      >
        <el-checkbox-group v-model="formObj.checkList">
          <el-checkbox
            :label="item"
            v-for="(item, index) in checkboxList"
            :key="index + 'checkboxList'"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-if="formComponent.includes('input')" class="form_item">
        <el-input
          placeholder="请输入"
          v-model="formObj.inputStr"
          clearable
        ></el-input>
      </div>
      <div v-if="formComponent.includes('inputNumber')" class="form_item">
        <el-input-number
          style="width: 220px"
          placeholder="请输入"
          v-model="formObj.inputNumber"
          clearable
          :min="0"
        ></el-input-number>
      </div>
    </article>
    <footer>
      <el-button type="primary" plain @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "modal_basic",
  props: {
    title: {
      type: String,
    },
    isHeader: {
      type: Boolean,
      default: false,
    },
    headStr: {
      type: String,
    },
    selectOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    footStr: {
      type: String,
    },

    checkboxWidth: {
      type: String,
      default: () => {
        return "auto";
      },
    },
    formComponent: {
      type: Array,
    },
    radioList: {
      type: Array,
    },
    checkboxList: {
      type: Array,
    },
    dateDisable: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formObj: {
        daterange: ["", ""],
        radio: "",
        year: "",
        date: "",
        checkList: [],
        datetime: "",
        selectStr: "",
        inputNumber: "",
        inputStr: "",
      },
    };
  },
  created() {
    this.formObj.daterange = [
      dayjs().subtract(10, "day").format("YYYY-MM-DD"),
      dayjs().subtract(3, "day").format("YYYY-MM-DD"),
    ];
    if (this.formComponent.includes("year")) {
      if (this.defaultValue.year) {
        this.formObj.year = this.defaultValue.year;
      } else {
        this.formObj.year = dayjs().format("YYYY");
      }
    }

    if (this.formComponent.includes("radio")) {
      if (this.defaultValue.radio) {
        this.formObj.radio = this.defaultValue.radio;
      }
    }
    if (this.formComponent.includes("date")) {
      if (this.defaultValue.date || this.defaultValue.date == "") {
        this.formObj.date = this.defaultValue.date;
      } else {
        this.formObj.date = dayjs().format("YYYY-MM-DD");
      }
    }
    if (this.formComponent.includes("datetime")) {
      if (this.defaultValue.datetime) {
        this.formObj.datetime = this.defaultValue.datetime;
      }
    }
    if (this.formComponent.includes("input")) {
      if (this.defaultValue.input) {
        this.formObj.inputStr = this.defaultValue.input;
      }
    }
    if (this.formComponent.includes("inputNumber")) {
      if (this.defaultValue.inputNumber) {
        this.formObj.inputNumber = this.defaultValue.inputNumber;
      }
    }
    if (this.formComponent.includes("checkbox")) {
      if (this.defaultValue.checkList) {
        this.formObj.checkList = this.defaultValue.checkList;
      }
    }
  },
  methods: {
    submit() {
      if (!this.clearable) {
        if (this.formComponent.includes("daterange")) {
          if (
            this.formObj.daterange[0] == "" ||
            this.formObj.daterange[1] == ""
          ) {
            this.$message.warning("请选择开始时间和结束时间");
            return;
          }
        }
        if (this.formComponent.includes("datetime")) {
          if (this.formObj.datetime == "") {
            this.$message.warning("请选择日期时间");
            return;
          }
        }
        if (this.formComponent.includes("date")) {
          if (this.formObj.date == "") {
            this.$message.warning("请选择日期");
            return;
          }
        }
        if (this.formComponent.includes("year")) {
          if (this.formObj.year == "") {
            this.$message.warning("请选择年份");
            return;
          }
        }
        if (this.formComponent.includes("radio")) {
          if (!this.formObj.radio) {
            this.$message.warning("请勾选单选框");
            return;
          }
        }
        if (this.formComponent.includes("checkbox")) {
          if (this.formObj.checkList.length == 0) {
            this.$message.warning("请勾选复选框");
            return;
          }
        }
        if (this.formComponent.includes("select")) {
          if (!this.formObj.selectStr) {
            this.$message.warning("请选择下拉框数据");
            return;
          }
        }
      }

      this.$emit("submit", this.formObj);
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
#modal_basic {
  width: 100%;
  height: 100%;
  padding: 0 12px;

  article {
    text-align: center;
    width: 100%;
    height: calc(100% - 48px);
    background-color: #ffffff;
    padding: 0 12px;
    p {
      text-align: center;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .form_item {
      padding-top: 10px;
    }
  }
  footer {
    text-align: center;
    padding: 8px 0;
  }
}
</style>
