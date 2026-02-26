const channel = new BroadcastChannel("YFZLQD-channel");
import grrjApi from "@/api/xzs/grrj-api.js";
import view_prompt from "@/views/vxeModal/view_prompt.vue";

export default {
  data() {
    return {
      pagerConfig: {
        currentPage: 1,
        pageSize: 20,
        layouts: [
          "Home",
          "PrevPage",
          "JumpNumber",
          "NextPage",
          "End",
          "Sizes",
          "FullJump",
          "Total",
        ],
        size: "small",
        slots: {
          total: ({ total }) => {
            return (
              <span style="margin-right:6px;vertical-align:initial">
                {" "}
                共{" "}
                <span style="font-weight:bold;vertical-align:baseline">
                  {total}
                </span>{" "}
                条记录
              </span>
            );
          },
          left: "pagerLeft",
        },
      },
      pagerParam: {
        currentPage: 1,
        pageSize: 20,
      },
    };
  },
  beforeRouteLeave(to, from, next) {
    let flag = this.$store.state.aliveTabs.some((i) => i.url === from.name);
    if (!flag) {
      let Vnode = this.$vnode;
      let parentVnode = Vnode && Vnode.parent;
      if (
        parentVnode &&
        parentVnode.componentInstance &&
        parentVnode.componentInstance.cache
      ) {
        var key =
          Vnode.key == null
            ? Vnode.componentOptions.Ctor.cid +
              (Vnode.componentOptions.tag
                ? `::${Vnode.componentOptions.tag}`
                : "")
            : Vnode.key;
        var cache = parentVnode.componentInstance.cache;
        var keys = parentVnode.componentInstance.keys;
        if (cache[key]) {
          this.$destroy();
          if (keys.length) {
            var index = keys.indexOf(key);
            if (index > -1) {
              keys.splice(index, 1);
            }
          }
          cache[key] = null;
        }
      }
    }
    next();
  },

  methods: {
    trimSpecial(str) {
      // return str.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#¥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、～]/g, "");
      return str.replace(
        /[`~!@#$%^&*_\-+=<>?:"{}|,.\/;'\\[\]·~！@#¥%……&*——\-+={}|《》？：“”【】、；‘’，。、～]/g,
        "",
      );
    },

    btnClick(item) {
      switch (item.name) {
        case "查询":
          this.loadTableData();
          break;
        case "重置":
          this.resetParams();
          break;
        case "确定":
          this.doConfirm();
          break;
        case "刷新":
          this.reloadTableData();
          break;
        case "查看日志":
          this.doViewDialog();
          break;
        case "查看流程图":
          this.doViewFlow();
          break;
        case "新建":
          this.doAdd();
          break;
        case "新增":
          this.doAdd();
          break;
        case "生成":
          this.doSc();
          break;
        case "初始化":
          this.doInit();
          break;
        case "导出":
          this.doExport();
          break;
        case "导出当前页":
          this.doExport();
          break;
        case "导出全部":
          this.doExport(true);
          break;
        case "自动换行":
          this.toggleWrap();
          break;
        case "提交":
          this.doOperation(item);
          break;
        case "删除":
          this.doDelete();
          break;
        case "保存":
          this.doSave();
          break;
        case "复制":
          this.doCopy();
          break;
        case "同步":
          this.doSync();
          break;
        case "下载导入模版":
          this.downloadModule();
          break;
        case "导入":
          this.doImport();
          break;
        case "下载":
          this.downloadModule();
          break;
        case "上传文件":
          this.readFileEvent();
          break;
        case "发送短信":
          this.doSendMessage();
          break;
        case "推送至年度风险":
          this.doPush();
          break;
        default:
          this.doOperation(item);
          break;
      }
    },
    getCheckboxRecord() {
      const rows = this.$refs.xTable.getCheckboxRecords();
      if (!rows || rows.length === 0 || rows.length > 1) {
        this.$message.warning("请选择一条数据！");
        return [];
      } else {
        return rows;
      }
    },
    getRadioRecord() {
      let row = this.$refs.xTable.getRadioRecord();
      if (!row || row.length === 0) {
        this.$message.warning("请选择一条数据");
        return;
      }
      return row;
    },
    getCheckboxRecords() {
      const rows = this.$refs.xTable.getCheckboxRecords();
      if (!rows || rows.length === 0) {
        this.$message.warning("请至少选择一条数据！");
        return [];
      } else {
        return rows;
      }
    },

    getUpdateRecords() {
      const rows = [
        ...this.$refs.xTable.getUpdateRecords(),
        ...this.$refs.xTable.getInsertRecords(),
      ];
      if (!rows || rows.length === 0) {
        this.$message.warning("数据未修改！");
        return [];
      } else {
        return rows;
      }
    },
    doExport() {
      this.$refs.xTable.openExport();
    },
    filterMethod(e) {
      console.log(e);
      let { options, row, column } = e;
      if (
        column.filterRender &&
        column.filterRender &&
        column.filterRender.name == "VxeSelect"
      ) {
        if (options[0].data) {
          options[0].data = options[0].data.filter((i) => i);
          return options[0].data.includes(row[column.field]);
        }
        return true;
      }
      return true;
    },
    exportMethod({ options }) {
      const body = {
        filename: options.filename,
        sheetName: options.sheetName,
        isHeader: options.isHeader,
        original: options.original,
        mode: options.mode,
        ids: options.mode === "selected" ? options.data.map((i) => i.id) : [],
        fields: options.columns.map((c) => {
          return { field: c.field, title: c.title };
        }),
      };
      return this.$refs.xTable.exportData(body);
    },
    afterExportMethod() {
      this.$message.success("导出成功");
    },
    sortChangeEvent(e) {
      let { property, order } = e;
      this.searchParams.sortOrder = order ? order : "";
      this.searchParams.sortColumn = property;
      this.loadTableData();
    },
    menuClickEvent(e, source) {
      const { menu } = e;
      if (menu.code === "collect") {
        this.$vxeModal.show(
          view_prompt,
          {
            title: "请输入标记原因并将当前数据标记重点，加入个人日记",
          },
          {
            width: 420,
            title: "标记原因",
            height: 260,
          },
          {
            // close: () => {
            //   this.loadTableData();
            // },
            returnData: (res) => {
              grrjApi
                .addDataService({
                  type: source,
                  data: [e.row],
                  yy: res,
                  headerList: this.tableHeaderList.filter(
                    (i) => !i.type && !i.slots,
                  ),
                })
                .then((res) => {
                  this.$message.success(res.data);
                  channel.postMessage({ type: "refresh_grrj", data: {} });
                });
            },
          },
        );
      }
    },
    getRealParams(searchParams, page, sorts, filters) {
      let obj = JSON.parse(JSON.stringify(searchParams));
      for (let i = 0; i < filters.length; i++) {
        let isMultiple =
          filters[i].column.filterMultiple &&
          filters[i].column.filters.length > 1;
        let property = isMultiple
          ? filters[i].field + "List"
          : filters[i].field;
        obj[property] = filters[i].column.filterRender
          ? isMultiple
            ? filters[i].datas
            : filters[i].datas[0]
          : isMultiple
            ? filters[i].values
            : filters[i].values[0];
      }
      if (sorts[0]) {
        obj.sortOrder = sorts[0].order;
        obj.sortColumn = sorts[0].field;
      }
      this.pagerParam = page;
      obj.pageIndex = page.currentPage - 1;
      obj.pageSize = page.pageSize;
      return obj;
    },
    sumMethod(list, field) {
      let num = 0;
      list.forEach((row) => {
        num += Number(row[field]);
      });
      return num;
    },
  },
};
