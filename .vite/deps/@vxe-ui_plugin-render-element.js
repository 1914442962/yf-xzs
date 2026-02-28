import {
  require_dayjs_min
} from "./chunk-XCUFKJYR.js";
import {
  defineComponent,
  h,
  onMounted,
  ref,
  resolveComponent,
  watch
} from "./chunk-PXUTNTA2.js";
import {
  require_xe_utils
} from "./chunk-OZ7H3HZS.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/@vxe-ui/plugin-render-element/es/store/index.js
var globalConfig = {};
var componentMaps = {};

// node_modules/@vxe-ui/plugin-render-element/es/util/comp.js
function getCurrComponent(name) {
  const comp = componentMaps[name] || (globalConfig.ElementPlus ? globalConfig.ElementPlus[name] : null);
  if (comp) {
    return comp;
  }
  return resolveComponent(name);
}
function hasInputType(renderOpts) {
  switch (renderOpts.name) {
    case "ElInput":
    case "ElInputNumber":
    case "ElTextarea":
      return true;
  }
  return false;
}

// node_modules/@vxe-ui/plugin-render-element/es/table/index.js
var import_xe_utils = __toESM(require_xe_utils());
var import_dayjs = __toESM(require_dayjs_min());
function defineTableRender(VxeUI) {
  function isEmptyValue(cellValue) {
    return cellValue === null || cellValue === void 0 || cellValue === "";
  }
  function getOnName(type) {
    return "on" + type.substring(0, 1).toLocaleUpperCase() + type.substring(1);
  }
  function getModelProp(renderOpts) {
    return "modelValue";
  }
  function getModelEvent(renderOpts) {
    return "update:modelValue";
  }
  function getChangeEvent(renderOpts) {
    let type = "change";
    switch (renderOpts.name) {
      case "ElAutocomplete":
        type = "select";
        break;
      case "ElInput":
      case "ElInputNumber":
        type = "input";
        break;
    }
    return type;
  }
  function toDayStringDate(value, format) {
    return (0, import_dayjs.default)(value, format).toDate();
  }
  function toDayDateString(date, format) {
    return (0, import_dayjs.default)(date).format(format);
  }
  function parseDate(value, props) {
    return value && props.valueFormat ? toDayStringDate(value, props.valueFormat) : value;
  }
  function getFormatDate(value, props, defaultFormat) {
    return value ? toDayDateString(parseDate(value, props), props.format || props.valueFormat || defaultFormat) : value;
  }
  function getFormatDates(values, props, separator, defaultFormat) {
    return import_xe_utils.default.map(values, (date) => getFormatDate(date, props, defaultFormat)).join(separator);
  }
  function equalDateRange(cellValue, data, props, defaultFormat) {
    cellValue = getFormatDate(cellValue, props, defaultFormat);
    return cellValue >= getFormatDate(data[0], props, defaultFormat) && cellValue <= getFormatDate(data[1], props, defaultFormat);
  }
  function getCellEditFilterProps(renderOpts, params, value, defaultProps) {
    return import_xe_utils.default.assign({}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value });
  }
  function formatText(cellValue) {
    return "" + (isEmptyValue(cellValue) ? "" : cellValue);
  }
  function updateFilterChangeOption(params, checked, option) {
    const { $table } = params;
    $table.updateFilterOptionStatus(option, checked);
  }
  function saveFilterEvent(params) {
    const { $table, column } = params;
    $table.saveFilterByEvent(new Event("change"), column);
  }
  function getCellLabelVNs(renderOpts, params, cellLabel) {
    const { placeholder } = renderOpts;
    return [
      h("span", {
        class: "vxe-cell--label"
      }, placeholder && isEmptyValue(cellLabel) ? [
        h("span", {
          class: "vxe-cell--placeholder"
        }, formatText(VxeUI.getI18n(placeholder)))
      ] : formatText(cellLabel))
    ];
  }
  const blurEvent = "blur";
  const clearEvent = "clear";
  function getComponentOns(renderOpts, params, eFns, eventOns) {
    const { events } = renderOpts;
    const modelEvent = getModelEvent(renderOpts);
    const changeEvent = getChangeEvent(renderOpts);
    const { model: modelFunc, change: changeFunc, blur: blurFunc, clear: clearFunc } = eFns || {};
    const ons = {};
    import_xe_utils.default.objectEach(events, (func, key) => {
      ons[getOnName(key)] = function(...args) {
        if (!import_xe_utils.default.isFunction(func)) {
          console.error(`Parameter "${func}" is not a method`);
        }
        func(params, ...args);
      };
    });
    if (modelFunc) {
      ons[getOnName(modelEvent)] = function(targetEvnt) {
        modelFunc(targetEvnt);
        if (events && events[modelEvent]) {
          events[modelEvent](params, targetEvnt);
        }
      };
    }
    if (changeFunc) {
      ons[getOnName(changeEvent)] = function(...args) {
        changeFunc(...args);
        if (events && events[changeEvent]) {
          events[changeEvent](params, ...args);
        }
      };
    }
    if (blurFunc) {
      ons[getOnName(blurEvent)] = function(...args) {
        blurFunc(...args);
        if (events && events[blurEvent]) {
          events[blurEvent](params, ...args);
        }
      };
    }
    if (clearFunc) {
      ons[getOnName(clearEvent)] = function(...args) {
        clearFunc(...args);
        if (events && events[clearEvent]) {
          events[clearEvent](params, ...args);
        }
      };
    }
    return eventOns ? Object.assign(ons, eventOns) : ons;
  }
  function getEditOns(renderOpts, params) {
    const { $table, row, column } = params;
    return getComponentOns(renderOpts, params, {
      model(value) {
        import_xe_utils.default.set(row, column.field, value);
      },
      change() {
        $table.updateStatus(params);
      }
    });
  }
  function getFilterOns(renderOpts, params, option, changeFunc) {
    return getComponentOns(renderOpts, params, {
      model(value) {
        option.data = value;
      },
      change: changeFunc
    });
  }
  function getFloatingFilterOns(renderOpts, params, option) {
    const { $table, column } = params;
    if (hasInputType(renderOpts)) {
      return getComponentOns(renderOpts, params, {
        model(value) {
          option.data = value;
        },
        change() {
          updateFilterChangeOption(params, !isEmptyValue(option.data), option);
        },
        clear() {
          updateFilterChangeOption(params, !isEmptyValue(option.data), option);
          saveFilterEvent(params);
        },
        blur() {
          $table.saveFilterByEvent(new Event("change"), column);
        }
      });
    }
    return getComponentOns(renderOpts, params, {
      model(value) {
        option.data = value;
      },
      clear() {
        updateFilterChangeOption(params, !isEmptyValue(option.data), option);
        $table.saveFilterByEvent(new Event("change"), column);
      },
      change() {
        updateFilterChangeOption(params, !isEmptyValue(option.data), option);
        $table.saveFilterByEvent(new Event("change"), column);
      }
    });
  }
  function matchCascaderData(index, list, values, labels) {
    const val = values[index];
    if (list && values.length > index) {
      import_xe_utils.default.each(list, (item) => {
        if (item.value === val) {
          labels.push(item.label);
          matchCascaderData(++index, item.children, values, labels);
        }
      });
    }
  }
  function getSelectCellValue(renderOpts, params) {
    const { options = [], optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = renderOpts;
    const { $table, rowid, row, column } = params;
    const { filterable, multiple } = props;
    const labelProp = optionProps.label || "label";
    const valueProp = optionProps.value || "value";
    const groupOptions = optionGroupProps.options || "options";
    const cellValue = import_xe_utils.default.get(row, column.field);
    const colid = column.id;
    let cellData;
    if (filterable) {
      const { internalData } = $table;
      const { fullAllDataRowIdData } = internalData;
      const rest = fullAllDataRowIdData[rowid];
      if (rest) {
        cellData = rest.cellData;
        if (!cellData) {
          cellData = rest.cellData = {};
        }
      }
      if (rest && cellData[colid] && cellData[colid].value === cellValue) {
        return cellData[colid].label;
      }
    }
    if (!isEmptyValue(cellValue)) {
      const selectlabel = import_xe_utils.default.map(multiple ? cellValue : [cellValue], optionGroups ? (value) => {
        let selectItem;
        for (let index = 0; index < optionGroups.length; index++) {
          selectItem = import_xe_utils.default.find(optionGroups[index][groupOptions], (item) => item[valueProp] === value);
          if (selectItem) {
            break;
          }
        }
        return selectItem ? selectItem[labelProp] : value;
      } : (value) => {
        const selectItem = import_xe_utils.default.find(options, (item) => item[valueProp] === value);
        return selectItem ? selectItem[labelProp] : value;
      }).join(", ");
      if (cellData && options && options.length) {
        cellData[colid] = { value: cellValue, label: selectlabel };
      }
      return selectlabel;
    }
    return "";
  }
  function getCascaderCellValue(renderOpts, params) {
    const { props = {} } = renderOpts;
    const { row, column } = params;
    const cellValue = import_xe_utils.default.get(row, column.field);
    const values = cellValue || [];
    const labels = [];
    matchCascaderData(0, props.options, values, labels);
    return (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(` ${props.separator || "/"} `);
  }
  function getDatePickerCellValue(renderOpts, params) {
    const { props = {} } = renderOpts;
    const { row, column } = params;
    const { rangeSeparator = "-" } = props;
    let cellValue = import_xe_utils.default.get(row, column.field);
    switch (props.type) {
      case "week":
        cellValue = getFormatDate(cellValue, props, "YYYYwWW");
        break;
      case "month":
        cellValue = getFormatDate(cellValue, props, "YYYY-MM");
        break;
      case "year":
        cellValue = getFormatDate(cellValue, props, "YYYY");
        break;
      case "dates":
        cellValue = getFormatDates(cellValue, props, ", ", "YYYY-MM-DD");
        break;
      case "daterange":
        cellValue = getFormatDates(cellValue, props, ` ${rangeSeparator} `, "YYYY-MM-DD");
        break;
      case "datetimerange":
        cellValue = getFormatDates(cellValue, props, ` ${rangeSeparator} `, "YYYY-MM-DD HH:ss:mm");
        break;
      case "monthrange":
        cellValue = getFormatDates(cellValue, props, ` ${rangeSeparator} `, "YYYY-MM");
        break;
      default:
        cellValue = getFormatDate(cellValue, props, "YYYY-MM-DD");
    }
    return cellValue;
  }
  function getTimePickerCellValue(renderOpts, params) {
    const { props = {} } = renderOpts;
    const { row, column } = params;
    const { isRange, format = "HH:mm:ss", rangeSeparator = "-" } = props;
    let cellValue = import_xe_utils.default.get(row, column.field);
    if (cellValue && isRange) {
      cellValue = import_xe_utils.default.map(cellValue, (date) => toDayDateString(parseDate(date, props), format)).join(` ${rangeSeparator} `);
    }
    return toDayDateString(parseDate(cellValue, props), format);
  }
  function createEditRender(defaultProps) {
    return function(renderOpts, params) {
      const { row, column } = params;
      const { name, attrs, props } = renderOpts;
      const cellValue = import_xe_utils.default.get(row, column.field);
      return [
        h(getCurrComponent(name), Object.assign(Object.assign(Object.assign(Object.assign({}, attrs), props), getCellEditFilterProps(renderOpts, params, cellValue, defaultProps)), getEditOns(renderOpts, params)))
      ];
    };
  }
  function defaultButtonEditRender(renderOpts, params) {
    const { attrs, props } = renderOpts;
    return [
      h(getCurrComponent("el-button"), Object.assign(Object.assign(Object.assign(Object.assign({}, attrs), props), getCellEditFilterProps(renderOpts, params, null)), getComponentOns(renderOpts, params)), cellText(renderOpts.content))
    ];
  }
  function defaultButtonsEditRender(renderOpts, params) {
    const { children } = renderOpts;
    if (children) {
      return children.map((childRenderOpts) => defaultButtonEditRender(childRenderOpts, params)[0]);
    }
    return [];
  }
  function createFilterRender(defaultProps) {
    return function(renderOpts, params) {
      const { column } = params;
      const { name, attrs, props } = renderOpts;
      return [
        h("div", {
          class: "vxe-table--filter-element-wrapper"
        }, column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(getCurrComponent(name), Object.assign(Object.assign(Object.assign(Object.assign({ key: oIndex }, attrs), props), getCellEditFilterProps(renderOpts, params, optionValue, defaultProps)), getFilterOns(renderOpts, params, option, () => {
            handleConfirmFilter(params, !!option.data, option);
          })));
        }))
      ];
    };
  }
  function createFloatingFilterRender(defaultProps) {
    return function(renderOpts, params) {
      const { option } = params;
      const { name, attrs, props } = renderOpts;
      const optionValue = option.data;
      return [
        h(getCurrComponent(name), Object.assign(Object.assign(Object.assign(Object.assign({}, attrs), props), getCellEditFilterProps(renderOpts, params, optionValue, defaultProps)), getFloatingFilterOns(renderOpts, params, option)))
      ];
    };
  }
  function handleConfirmFilter(params, checked, option) {
    const { $panel } = params;
    $panel.changeOption(null, checked, option);
  }
  function defaultFuzzyFilterMethod(params) {
    const { option, row, column } = params;
    const { data } = option;
    const cellValue = import_xe_utils.default.get(row, column.field);
    return import_xe_utils.default.toValueString(cellValue).indexOf(data) > -1;
  }
  function defaultExactFilterMethod(params) {
    const { option, row, column } = params;
    const { data } = option;
    const cellValue = import_xe_utils.default.get(row, column.field);
    return cellValue === data;
  }
  function renderOptions(options, optionProps) {
    const labelProp = optionProps.label || "label";
    const valueProp = optionProps.value || "value";
    return import_xe_utils.default.map(options, (item, oIndex) => {
      return h(getCurrComponent("el-option"), {
        key: oIndex,
        value: item[valueProp],
        label: item[labelProp],
        disabled: item.disabled
      });
    });
  }
  function cellText(cellValue) {
    return [formatText(cellValue)];
  }
  function createExportMethod(getExportCellValue) {
    return function(params) {
      const { row, column, options } = params;
      return options && options.original ? import_xe_utils.default.get(row, column.field) : getExportCellValue(column.editRender || column.cellRender, params);
    };
  }
  function defaultFilterOptions() {
    return [
      { data: null }
    ];
  }
  VxeUI.renderer.mixin({
    ElAutocomplete: {
      tableAutoFocus: "input",
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter: createFilterRender(),
      tableFilterDefaultMethod: defaultExactFilterMethod
    },
    ElInput: {
      tableAutoFocus: "input",
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter: createFilterRender(),
      renderTableFloatingFilter: createFloatingFilterRender(),
      tableFilterDefaultMethod: defaultFuzzyFilterMethod
    },
    ElInputNumber: {
      tableAutoFocus: "input",
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter: createFilterRender(),
      renderTableFloatingFilter: createFloatingFilterRender(),
      tableFilterDefaultMethod: defaultFuzzyFilterMethod
    },
    ElSelect: {
      tableAutoFocus: "input",
      renderTableEdit(renderOpts, params) {
        const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts;
        const { row, column } = params;
        const { attrs } = renderOpts;
        const cellValue = import_xe_utils.default.get(row, column.field);
        const props = getCellEditFilterProps(renderOpts, params, cellValue);
        const ons = getEditOns(renderOpts, params);
        if (optionGroups) {
          const groupOptions = optionGroupProps.options || "options";
          const groupLabel = optionGroupProps.label || "label";
          return [
            h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({}, attrs), props), ons), {
              default: () => {
                return import_xe_utils.default.map(optionGroups, (group, gIndex) => {
                  return h(getCurrComponent("el-option-group"), {
                    key: gIndex,
                    label: group[groupLabel]
                  }, {
                    default: () => renderOptions(group[groupOptions], optionProps)
                  });
                });
              }
            })
          ];
        }
        return [
          h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({}, props), attrs), ons), {
            default: () => renderOptions(options, optionProps)
          })
        ];
      },
      renderTableCell(renderOpts, params) {
        return getCellLabelVNs(renderOpts, params, getSelectCellValue(renderOpts, params));
      },
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter(renderOpts, params) {
        const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts;
        const groupOptions = optionGroupProps.options || "options";
        const groupLabel = optionGroupProps.label || "label";
        const { column } = params;
        const { attrs } = renderOpts;
        return [
          h("div", {
            class: "vxe-table--filter-element-wrapper"
          }, optionGroups ? column.filters.map((option, oIndex) => {
            const optionValue = option.data;
            const props = getCellEditFilterProps(renderOpts, params, optionValue);
            return h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({ key: oIndex }, attrs), props), getFilterOns(renderOpts, params, option, () => {
              handleConfirmFilter(params, props.multiple ? option.data && option.data.length > 0 : !import_xe_utils.default.eqNull(option.data), option);
            })), {
              default: () => {
                return import_xe_utils.default.map(optionGroups, (group, gIndex) => {
                  return h(getCurrComponent("el-option-group"), {
                    key: gIndex,
                    label: group[groupLabel]
                  }, {
                    default: () => renderOptions(group[groupOptions], optionProps)
                  });
                });
              }
            });
          }) : column.filters.map((option, oIndex) => {
            const optionValue = option.data;
            const props = getCellEditFilterProps(renderOpts, params, optionValue);
            return h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({ key: oIndex }, attrs), props), getFilterOns(renderOpts, params, option, () => {
              handleConfirmFilter(params, props.multiple ? option.data && option.data.length > 0 : !import_xe_utils.default.eqNull(option.data), option);
            })), {
              default: () => renderOptions(options, optionProps)
            });
          }))
        ];
      },
      tableFilterDefaultMethod(params) {
        const { option, row, column } = params;
        const { data } = option;
        const { field, filterRender: renderOpts } = column;
        const { props = {} } = renderOpts;
        const cellValue = import_xe_utils.default.get(row, field);
        if (props.multiple) {
          if (import_xe_utils.default.isArray(cellValue)) {
            return import_xe_utils.default.includeArrays(cellValue, data);
          }
          return data.indexOf(cellValue) > -1;
        }
        return cellValue == data;
      },
      tableExportMethod: createExportMethod(getSelectCellValue)
    },
    ElCascader: {
      tableAutoFocus: "input",
      renderTableEdit: createEditRender(),
      renderTableCell(renderOpts, params) {
        return getCellLabelVNs(renderOpts, params, getCascaderCellValue(renderOpts, params));
      },
      tableExportMethod: createExportMethod(getCascaderCellValue)
    },
    ElDatePicker: {
      tableAutoFocus: "input",
      renderTableEdit: createEditRender(),
      renderTableCell(renderOpts, params) {
        return getCellLabelVNs(renderOpts, params, getDatePickerCellValue(renderOpts, params));
      },
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter(renderOpts, params) {
        const { column } = params;
        const { name, attrs } = renderOpts;
        return [
          h("div", {
            class: "vxe-table--filter-element-wrapper"
          }, column.filters.map((option, oIndex) => {
            const optionValue = option.data;
            return h(getCurrComponent(name), Object.assign(Object.assign(Object.assign({ key: oIndex }, attrs), getCellEditFilterProps(renderOpts, params, optionValue)), getFilterOns(renderOpts, params, option, () => {
              handleConfirmFilter(params, !!option.data, option);
            })));
          }))
        ];
      },
      renderTableFloatingFilter: createFloatingFilterRender(),
      tableFilterDefaultMethod(params) {
        const { option, row, column } = params;
        const { data } = option;
        const { filterRender: renderOpts } = column;
        const { props = {} } = renderOpts;
        const cellValue = import_xe_utils.default.get(row, column.field);
        if (data) {
          switch (props.type) {
            case "daterange":
              return equalDateRange(cellValue, data, props, "YYYY-MM-DD");
            case "datetimerange":
              return equalDateRange(cellValue, data, props, "YYYY-MM-DD HH:ss:mm");
            case "monthrange":
              return equalDateRange(cellValue, data, props, "YYYY-MM");
            default:
              return cellValue === data;
          }
        }
        return false;
      },
      tableExportMethod: createExportMethod(getDatePickerCellValue)
    },
    ElTimePicker: {
      tableAutoFocus: "input",
      renderTableEdit: createEditRender(),
      renderTableCell(renderOpts, params) {
        return getCellLabelVNs(renderOpts, params, getTimePickerCellValue(renderOpts, params));
      },
      tableExportMethod: createExportMethod(getTimePickerCellValue)
    },
    ElTimeSelect: {
      tableAutoFocus: "input",
      renderTableEdit: createEditRender()
    },
    ElRate: {
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter: createFilterRender(),
      tableFilterDefaultMethod: defaultExactFilterMethod
    },
    ElSwitch: {
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      renderTableFilter(renderOpts, params) {
        const { column } = params;
        const { name, attrs } = renderOpts;
        return [
          h("div", {
            class: "vxe-table--filter-element-wrapper"
          }, column.filters.map((option, oIndex) => {
            const optionValue = option.data;
            return h(getCurrComponent(name), Object.assign(Object.assign(Object.assign({ key: oIndex }, attrs), getCellEditFilterProps(renderOpts, params, optionValue)), getFilterOns(renderOpts, params, option, () => {
              handleConfirmFilter(params, import_xe_utils.default.isBoolean(option.data), option);
            })));
          }))
        ];
      },
      tableFilterDefaultMethod: defaultExactFilterMethod
    },
    ElSlider: {
      renderTableDefault: createEditRender(),
      renderTableEdit: createEditRender(),
      createTableFilterOptions: defaultFilterOptions,
      renderTableFilter: createFilterRender(),
      tableFilterDefaultMethod: defaultExactFilterMethod
    },
    ElButton: {
      renderTableDefault: defaultButtonEditRender
    },
    ElButtons: {
      renderTableDefault: defaultButtonsEditRender
    }
  });
}

// node_modules/@vxe-ui/plugin-render-element/es/form/index.js
var import_xe_utils2 = __toESM(require_xe_utils());
function defineFormRender(VxeUI) {
  function isEmptyValue(cellValue) {
    return cellValue === null || cellValue === void 0 || cellValue === "";
  }
  function getOnName(type) {
    return "on" + type.substring(0, 1).toLocaleUpperCase() + type.substring(1);
  }
  function getModelProp(renderOpts) {
    return "modelValue";
  }
  function getModelEvent(renderOpts) {
    return "update:modelValue";
  }
  function getChangeEvent(renderOpts) {
    let type = "change";
    switch (renderOpts.name) {
      case "ElAutocomplete":
        type = "select";
        break;
      case "ElInput":
      case "ElInputNumber":
        type = "input";
        break;
    }
    return type;
  }
  function getItemProps(renderOpts, params, value, defaultProps) {
    return import_xe_utils2.default.assign({}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value });
  }
  function formatText(cellValue) {
    return "" + (isEmptyValue(cellValue) ? "" : cellValue);
  }
  function getOns(renderOpts, params, inputFunc, changeFunc) {
    const { events } = renderOpts;
    const modelEvent = getModelEvent(renderOpts);
    const changeEvent = getChangeEvent(renderOpts);
    const isSameEvent = changeEvent === modelEvent;
    const ons = {};
    import_xe_utils2.default.objectEach(events, (func, key) => {
      ons[getOnName(key)] = function(...args) {
        func(params, ...args);
      };
    });
    if (inputFunc) {
      ons[getOnName(modelEvent)] = function(targetEvnt) {
        inputFunc(targetEvnt);
        if (events && events[modelEvent]) {
          events[modelEvent](params, targetEvnt);
        }
        if (isSameEvent && changeFunc) {
          changeFunc(targetEvnt);
        }
      };
    }
    if (!isSameEvent && changeFunc) {
      ons[getOnName(changeEvent)] = function(...args) {
        changeFunc(...args);
        if (events && events[changeEvent]) {
          events[changeEvent](params, ...args);
        }
      };
    }
    return ons;
  }
  function getItemOns(renderOpts, params) {
    const { $form, data, field } = params;
    return getOns(renderOpts, params, (value) => {
      import_xe_utils2.default.set(data, field, value);
    }, () => {
      $form.updateStatus(params);
      if (renderOpts.changeToSubmit) {
        $form.handleSubmitEvent(new Event("change"));
      }
    });
  }
  function renderOptions(options, optionProps) {
    const labelProp = optionProps.label || "label";
    const valueProp = optionProps.value || "value";
    return import_xe_utils2.default.map(options, (item, oIndex) => {
      return h(getCurrComponent("el-option"), {
        key: oIndex,
        value: item[valueProp],
        label: item[labelProp],
        disabled: item.disabled
      });
    });
  }
  function cellText(cellValue) {
    return [formatText(cellValue)];
  }
  function createFormItemRender(defaultProps) {
    return function(renderOpts, params) {
      const { data, field } = params;
      const { name } = renderOpts;
      const { attrs } = renderOpts;
      const itemValue = import_xe_utils2.default.get(data, field);
      return [
        h(getCurrComponent(name), Object.assign(Object.assign(Object.assign({}, attrs), getItemProps(renderOpts, params, itemValue, defaultProps)), getItemOns(renderOpts, params)))
      ];
    };
  }
  function defaultButtonItemRender(renderOpts, params) {
    const { attrs } = renderOpts;
    const props = getItemProps(renderOpts, params, null);
    return [
      h(getCurrComponent("el-button"), Object.assign(Object.assign(Object.assign({}, attrs), props), getOns(renderOpts, params)), {
        default: () => cellText(renderOpts.content || props.content)
      })
    ];
  }
  function defaultButtonsItemRender(renderOpts, params) {
    const { children } = renderOpts;
    if (children) {
      return children.map((childRenderOpts) => defaultButtonItemRender(childRenderOpts, params)[0]);
    }
    return [];
  }
  function createOldFormItemRadioAndCheckboxRender() {
    return function(renderOpts, params) {
      const { name, options = [], optionProps = {}, attrs } = renderOpts;
      const { data, field } = params;
      const labelProp = optionProps.label || "label";
      const valueProp = optionProps.value || "value";
      const itemValue = import_xe_utils2.default.get(data, field);
      return [
        h(getCurrComponent(`${name}Group`), Object.assign(Object.assign(Object.assign({}, attrs), getItemProps(renderOpts, params, itemValue)), getItemOns(renderOpts, params)), {
          default: () => {
            return options.map((option, oIndex) => {
              return h(getCurrComponent(name), {
                key: oIndex,
                label: option[valueProp],
                disabled: option.disabled
              }, {
                default: () => cellText(option[labelProp])
              });
            });
          }
        })
      ];
    };
  }
  VxeUI.renderer.mixin({
    ElAutocomplete: {
      renderFormItemContent: createFormItemRender()
    },
    ElInput: {
      renderFormItemContent: createFormItemRender()
    },
    ElInputNumber: {
      renderFormItemContent: createFormItemRender()
    },
    ElSelect: {
      renderFormItemContent(renderOpts, params) {
        const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts;
        const { data, field } = params;
        const { attrs } = renderOpts;
        const itemValue = import_xe_utils2.default.get(data, field);
        const props = getItemProps(renderOpts, params, itemValue);
        const ons = getItemOns(renderOpts, params);
        if (optionGroups) {
          const groupOptions = optionGroupProps.options || "options";
          const groupLabel = optionGroupProps.label || "label";
          return [
            h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({}, attrs), props), ons), {
              default: () => {
                return import_xe_utils2.default.map(optionGroups, (group, gIndex) => {
                  return h(getCurrComponent("el-option-group"), {
                    label: group[groupLabel],
                    key: gIndex
                  }, {
                    default: () => renderOptions(group[groupOptions], optionProps)
                  });
                });
              }
            })
          ];
        }
        return [
          h(getCurrComponent("el-select"), Object.assign(Object.assign(Object.assign({}, attrs), props), ons), {
            default: () => renderOptions(options, optionProps)
          })
        ];
      }
    },
    ElCascader: {
      renderFormItemContent: createFormItemRender()
    },
    ElDatePicker: {
      renderFormItemContent: createFormItemRender()
    },
    ElTimePicker: {
      renderFormItemContent: createFormItemRender()
    },
    ElTimeSelect: {
      renderFormItemContent: createFormItemRender()
    },
    ElRate: {
      renderFormItemContent: createFormItemRender()
    },
    ElSwitch: {
      renderFormItemContent: createFormItemRender()
    },
    ElSlider: {
      renderFormItemContent: createFormItemRender()
    },
    ElRadioGroup: {
      renderFormItemContent(renderOpts, params) {
        const { options = [], optionProps = {}, attrs } = renderOpts;
        const { data, field } = params;
        const labelProp = optionProps.label || "label";
        const valueProp = optionProps.value || "value";
        const itemValue = import_xe_utils2.default.get(data, field);
        return [
          h(getCurrComponent("el-radio-group"), Object.assign(Object.assign(Object.assign({}, attrs), getItemProps(renderOpts, params, itemValue)), getItemOns(renderOpts, params)), {
            default: () => {
              return options.map((option, oIndex) => {
                return h(getCurrComponent("el-radio"), {
                  key: oIndex,
                  value: option[valueProp],
                  disabled: option.disabled
                }, {
                  default: () => cellText(option[labelProp])
                });
              });
            }
          })
        ];
      }
    },
    ElCheckboxGroup: {
      renderFormItemContent(renderOpts, params) {
        const { options = [], optionProps = {}, attrs } = renderOpts;
        const { data, field } = params;
        const labelProp = optionProps.label || "label";
        const valueProp = optionProps.value || "value";
        const itemValue = import_xe_utils2.default.get(data, field);
        return [
          h(getCurrComponent("el-checkbox-group"), Object.assign(Object.assign(Object.assign({}, attrs), getItemProps(renderOpts, params, itemValue)), getItemOns(renderOpts, params)), {
            default: () => {
              return options.map((option, oIndex) => {
                return h(getCurrComponent("el-checkbox"), {
                  key: oIndex,
                  value: option[valueProp],
                  label: option[labelProp],
                  disabled: option.disabled
                });
              });
            }
          })
        ];
      }
    },
    ElButton: {
      renderFormItemContent: defaultButtonItemRender
    },
    // 已废弃
    ElRadio: {
      renderFormItemContent: createOldFormItemRadioAndCheckboxRender()
    },
    ElCheckbox: {
      renderFormItemContent: createOldFormItemRadioAndCheckboxRender()
    },
    ElButtons: {
      renderFormItemContent: defaultButtonsItemRender
    }
  });
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/input-widget.js
function createWidgetElInput(VxeUI) {
  const getWidgetElInputConfig = (params) => {
    return {
      title: "输入框",
      icon: "vxe-icon-input",
      options: {
        placeholder: "请输入"
      }
    };
  };
  const WidgetElInputFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        const { options } = widget;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              })
            ];
          }
        });
      };
    }
  });
  const WidgetElInputViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-input"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              placeholder: options.placeholder,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElInputConfig,
    WidgetElInputFormComponent,
    WidgetElInputViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/textarea-widget.js
function createWidgetElTextarea(VxeUI) {
  const getWidgetElTextareaConfig = (params) => {
    return {
      title: "文本域",
      icon: "vxe-icon-textarea",
      options: {
        placeholder: "请输入"
      }
    };
  };
  const WidgetElTextareaFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              })
            ];
          }
        });
      };
    }
  });
  const WidgetElTextareaViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-input"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              placeholder: options.placeholder,
              type: "textarea",
              autosize: {
                minRows: 2,
                maxRows: 4
              },
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElTextareaConfig,
    WidgetElTextareaFormComponent,
    WidgetElTextareaViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/number-input-widget.js
function createWidgetElInputNumber(VxeUI) {
  const getWidgetElInputNumberConfig = (params) => {
    return {
      title: "数字",
      icon: "vxe-icon-number",
      options: {
        placeholder: "请输入"
      }
    };
  };
  const WidgetElInputNumberFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              })
            ];
          }
        });
      };
    }
  });
  const WidgetElInputNumberViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-input-number"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              placeholder: options.placeholder,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElInputNumberConfig,
    WidgetElInputNumberFormComponent,
    WidgetElInputNumberViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/date-picker-widget.js
function createWidgetElDatePicker(VxeUI) {
  const getWidgetElDatePickerConfig = (params) => {
    return {
      title: "日期",
      icon: "vxe-icon-input",
      options: {
        placeholder: "请选择"
      }
    };
  };
  const WidgetElDatePickerFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElDatePicker" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              })
            ];
          }
        });
      };
    }
  });
  const WidgetElDatePickerViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-date-picker"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              placeholder: options.placeholder,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElDatePickerConfig,
    WidgetElDatePickerFormComponent,
    WidgetElDatePickerViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/use.js
function useWidgetPropDataSource(VxeUI, props, isSubOption) {
  const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
  const VxeUIButtonComponent = VxeUI.getComponent("VxeButton");
  const VxeUITextareaComponent = VxeUI.getComponent("VxeTextarea");
  const VxeUITipComponent = VxeUI.getComponent("VxeTip");
  const optionsContent = ref("");
  const expandIndexList = ref([]);
  const addOptionEvent = () => {
    const { renderParams } = props;
    const { widget } = renderParams;
    const options = widget.options.options || [];
    options.push({
      value: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.defValue", [options.length + 1])
    });
    widget.options.options = [...options];
  };
  const subRE = /^(\s|\t)+/;
  const hasSubOption = (str) => {
    return subRE.test(str);
  };
  const expandAllOption = () => {
    const { renderParams } = props;
    const { widget } = renderParams;
    const options = widget.options.options || [];
    const indexList = [];
    options.forEach((group, gIndex) => {
      const { options: options2 } = group;
      if (options2 && options2.length) {
        indexList.push(gIndex);
      }
    });
    expandIndexList.value = indexList;
  };
  const toggleExpandOption = (item, gIndex) => {
    if (expandIndexList.value.includes(gIndex)) {
      expandIndexList.value = expandIndexList.value.filter((num) => num !== gIndex);
    } else {
      expandIndexList.value.push(gIndex);
    }
  };
  const confirmBatchAddOptionEvent = () => {
    const { renderParams } = props;
    const { widget } = renderParams;
    const optList = [];
    const rowList = optionsContent.value.split("\n");
    let prevGroup = null;
    if (isSubOption) {
      rowList.forEach((str, index) => {
        const nextStr = rowList[index + 1];
        const value = str.trim();
        if (!value) {
          return;
        }
        const item = {
          value
        };
        if (prevGroup) {
          if (hasSubOption(str)) {
            prevGroup.options.push(item);
            return;
          }
          prevGroup = null;
          optList.push(item);
        } else {
          optList.push(item);
        }
        if (nextStr) {
          if (hasSubOption(nextStr)) {
            prevGroup = Object.assign(item, { options: [] });
          }
        }
      });
    } else {
      rowList.forEach((str) => {
        optList.push({
          value: str.trim()
        });
      });
    }
    widget.options.options = optList;
    expandAllOption();
  };
  const openPopupEditEvent = () => {
    var _a;
    const { renderParams } = props;
    const { widget } = renderParams;
    const contList = [];
    (_a = widget.options.options) === null || _a === void 0 ? void 0 : _a.forEach((group) => {
      var _a2;
      contList.push(group.value);
      (_a2 = group.options) === null || _a2 === void 0 ? void 0 : _a2.forEach((item) => {
        contList.push(`	${item.value}`);
      });
    });
    optionsContent.value = contList.join("\n");
    VxeUI.modal.open({
      title: `${widget.title} - ${VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.batchEditOption")}`,
      width: 500,
      height: "50vh ",
      resize: true,
      showFooter: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.buildOption"),
      onConfirm: confirmBatchAddOptionEvent,
      slots: {
        default() {
          return h("div", {
            class: "vxe-form-design--widget-form-item-data-source-popup"
          }, [
            h(VxeUITipComponent, {
              status: "primary",
              title: "",
              content: VxeUI.getI18n(`vxe.formDesign.widgetProp.dataSource.${isSubOption ? "batchEditSubTip" : "batchEditTip"}`)
            }),
            h(VxeUITextareaComponent, {
              resize: "none",
              modelValue: optionsContent.value,
              "onUpdate:modelValue"(val) {
                optionsContent.value = val;
              }
            })
          ]);
        }
      }
    });
  };
  const renderOption = (item, hasFirstLevel, isExpand, gIndex, hasSub, isFirst, isLast) => {
    return h("div", {
      class: ["vxe-form-design--widget-form-item-data-source-option", {
        "is--first": isFirst,
        "is--last": isLast
      }]
    }, [
      h("div", {
        class: "vxe-form-design--widget-expand-btn"
      }, hasFirstLevel && hasSub ? [
        h("i", {
          class: isExpand ? VxeUI.getIcon().FORM_DESIGN_WIDGET_OPTION_EXPAND_CLOSE : VxeUI.getIcon().FORM_DESIGN_WIDGET_OPTION_EXPAND_OPEN,
          onClick() {
            toggleExpandOption(item, gIndex);
          }
        })
      ] : []),
      h("input", {
        class: "vxe-default-input",
        value: item.value,
        onInput(evnt) {
          item.value = evnt.currentTarget.value;
        }
      }),
      h(VxeUIButtonComponent, {
        status: "danger",
        mode: "text",
        icon: VxeUI.getIcon().FORM_DESIGN_WIDGET_DELETE
      })
    ]);
  };
  const renderOptions = () => {
    const { renderParams } = props;
    const { widget } = renderParams;
    const { options } = widget;
    const groups = options.options;
    const optVNs = [];
    if (groups) {
      groups.forEach((group, gIndex) => {
        const { options: options2 } = group;
        const isExpand = expandIndexList.value.includes(gIndex);
        if (options2 && options2.length) {
          optVNs.push(renderOption(group, true, isExpand, gIndex, true, gIndex === 0, gIndex === groups.length - 1));
          if (isExpand) {
            optVNs.push(h("div", {
              class: "vxe-form-design--widget-form-item-data-source-sub-option"
            }, options2.map((item) => renderOption(item, false, isExpand, 0, false, false, false))));
          }
        } else {
          optVNs.push(renderOption(group, true, isExpand, gIndex, false, gIndex === 0, gIndex === groups.length - 1));
        }
      });
    }
    return optVNs;
  };
  watch(() => props.renderParams.widget, () => {
    expandAllOption();
  });
  onMounted(() => {
    expandAllOption();
  });
  return {
    renderDataSourceFormItem() {
      return h(VxeUIFormItemComponent, {
        title: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.name"),
        field: "options"
      }, {
        default() {
          return [
            h("div", {}, [
              h(VxeUIButtonComponent, {
                status: "primary",
                mode: "text",
                content: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.addOption"),
                onClick: addOptionEvent
              }),
              h(VxeUIButtonComponent, {
                status: "primary",
                mode: "text",
                content: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.batchEditOption"),
                onClick: openPopupEditEvent
              })
            ]),
            h("div", {
              class: "vxe-form-design--widget-form-item-data-source"
            }, renderOptions())
          ];
        }
      });
    }
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/select-widget.js
var import_xe_utils3 = __toESM(require_xe_utils());
function createWidgetElSelect(VxeUI) {
  const getWidgetElSelectConfig = (params) => {
    return {
      title: "下拉框",
      icon: "vxe-icon-select",
      options: {
        placeholder: "请选择",
        options: import_xe_utils3.default.range(0, 3).map((v, i) => {
          return {
            value: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.defValue", [i + 1])
          };
        })
      }
    };
  };
  const WidgetElSelectFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      const { renderDataSourceFormItem } = useWidgetPropDataSource(VxeUI, props, false);
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              }),
              renderDataSourceFormItem()
            ];
          }
        });
      };
    }
  });
  const WidgetElSelectViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-select"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              placeholder: options.placeholder,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            }, {
              default: () => {
                return options.options ? options.options.map((item) => {
                  return h(getCurrComponent("el-option"), {
                    label: item.value,
                    value: item.value
                  });
                }) : [];
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElSelectConfig,
    WidgetElSelectFormComponent,
    WidgetElSelectViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/radio-widget.js
var import_xe_utils4 = __toESM(require_xe_utils());
function createWidgetElRadio(VxeUI) {
  const getWidgetElRadioConfig = (params) => {
    return {
      title: "单选框",
      icon: "vxe-icon-radio-checked",
      options: {
        options: import_xe_utils4.default.range(0, 3).map((v, i) => {
          return {
            value: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.defValue", [i + 1])
          };
        })
      }
    };
  };
  const WidgetElRadioFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      const { renderDataSourceFormItem } = useWidgetPropDataSource(VxeUI, props, false);
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              }),
              renderDataSourceFormItem()
            ];
          }
        });
      };
    }
  });
  const WidgetElRadioViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-radio-group"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            }, {
              default: () => {
                return options.options ? options.options.map((item, index) => {
                  return h(getCurrComponent("el-radio"), {
                    key: index,
                    value: item.value
                  }, {
                    default() {
                      return `${item.value || ""}`;
                    }
                  });
                }) : [];
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElRadioConfig,
    WidgetElRadioFormComponent,
    WidgetElRadioViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/checkbox-widget.js
var import_xe_utils5 = __toESM(require_xe_utils());
function createWidgetElCheckbox(VxeUI) {
  const getWidgetElCheckboxConfig = (params) => {
    return {
      title: "复选框",
      icon: "vxe-icon-checkbox-checked",
      options: {
        options: import_xe_utils5.default.range(0, 3).map((v, i) => {
          return {
            value: VxeUI.getI18n("vxe.formDesign.widgetProp.dataSource.defValue", [i + 1])
          };
        })
      }
    };
  };
  const WidgetElCheckboxFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      const { renderDataSourceFormItem } = useWidgetPropDataSource(VxeUI, props, false);
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              }),
              renderDataSourceFormItem()
            ];
          }
        });
      };
    }
  });
  const WidgetElCheckboxViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        const { options } = widget;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-checkbox-group"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            }, {
              default: () => {
                return options.options ? options.options.map((item, index) => {
                  return h(getCurrComponent("el-checkbox"), {
                    key: index,
                    value: item.value
                  }, {
                    default() {
                      return `${item.value}`;
                    }
                  });
                }) : [];
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElCheckboxConfig,
    WidgetElCheckboxFormComponent,
    WidgetElCheckboxViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/switch-widget.js
function createWidgetElSwitch(VxeUI) {
  const getWidgetElSwitchConfig = (params) => {
    return {
      title: "是/否",
      icon: "vxe-icon-switch",
      options: {}
    };
  };
  const WidgetElSwitchFormComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormComponent = VxeUI.getComponent("VxeForm");
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const VxeUISwitchComponent = VxeUI.getComponent("VxeSwitch");
      return () => {
        const { renderParams } = props;
        const { widget } = renderParams;
        return h(VxeUIFormComponent, {
          class: "vxe-form-design--widget-render-form-wrapper",
          vertical: true,
          span: 24,
          titleBold: true,
          titleOverflow: true,
          data: widget.options
        }, {
          default() {
            return [
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.name")
              }, {
                default() {
                  return h(getCurrComponent("el-input"), {
                    modelValue: widget.title,
                    "onUpdate:modelValue"(val) {
                      widget.title = val;
                    }
                  });
                }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.placeholder"),
                field: "placeholder",
                itemRender: { name: "ElInput" }
              }),
              h(VxeUIFormItemComponent, {
                title: VxeUI.getI18n("vxe.formDesign.widgetProp.required")
              }, {
                default() {
                  return h(VxeUISwitchComponent, {
                    modelValue: widget.required,
                    "onUpdate:modelValue"(val) {
                      widget.required = val;
                    }
                  });
                }
              })
            ];
          }
        });
      };
    }
  });
  const WidgetElSwitchViewComponent = defineComponent({
    props: {
      renderOpts: {
        type: Object,
        default: () => ({})
      },
      renderParams: {
        type: Object,
        default: () => ({})
      }
    },
    emits: [],
    setup(props) {
      const VxeUIFormItemComponent = VxeUI.getComponent("VxeFormItem");
      const changeEvent = () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        if ($formView) {
          const itemValue = $formView ? $formView.getItemValue(widget) : null;
          $formView.updateWidgetStatus(widget, itemValue);
        }
      };
      return () => {
        const { renderParams } = props;
        const { widget, $formView } = renderParams;
        return h(VxeUIFormItemComponent, {
          class: ["vxe-form-design--widget-render-form-item"],
          field: widget.field,
          title: widget.title
        }, {
          default() {
            return h(getCurrComponent("el-switch"), {
              modelValue: $formView ? $formView.getItemValue(widget) : null,
              onChange: changeEvent,
              "onUpdate:modelValue"(val) {
                if ($formView) {
                  $formView.setItemValue(widget, val);
                }
              }
            });
          }
        });
      };
    }
  });
  return {
    getWidgetElSwitchConfig,
    WidgetElSwitchFormComponent,
    WidgetElSwitchViewComponent
  };
}

// node_modules/@vxe-ui/plugin-render-element/es/form-design/index.js
function defineFormDesignRender(VxeUI) {
  const { getWidgetElInputConfig, WidgetElInputViewComponent, WidgetElInputFormComponent } = createWidgetElInput(VxeUI);
  const { getWidgetElTextareaConfig, WidgetElTextareaViewComponent, WidgetElTextareaFormComponent } = createWidgetElTextarea(VxeUI);
  const { getWidgetElInputNumberConfig, WidgetElInputNumberViewComponent, WidgetElInputNumberFormComponent } = createWidgetElInputNumber(VxeUI);
  const { getWidgetElDatePickerConfig, WidgetElDatePickerViewComponent, WidgetElDatePickerFormComponent } = createWidgetElDatePicker(VxeUI);
  const { getWidgetElSelectConfig, WidgetElSelectViewComponent, WidgetElSelectFormComponent } = createWidgetElSelect(VxeUI);
  const { getWidgetElRadioConfig, WidgetElRadioViewComponent, WidgetElRadioFormComponent } = createWidgetElRadio(VxeUI);
  const { getWidgetElCheckboxConfig, WidgetElCheckboxViewComponent, WidgetElCheckboxFormComponent } = createWidgetElCheckbox(VxeUI);
  const { getWidgetElSwitchConfig, WidgetElSwitchViewComponent, WidgetElSwitchFormComponent } = createWidgetElSwitch(VxeUI);
  VxeUI.renderer.mixin({
    ElInputWidget: {
      createFormDesignWidgetConfig: getWidgetElInputConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElInputViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElInputFormComponent, { renderOpts, renderParams });
      }
    },
    ElTextareaWidget: {
      createFormDesignWidgetConfig: getWidgetElTextareaConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElTextareaViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElTextareaFormComponent, { renderOpts, renderParams });
      }
    },
    ElNumberInputWidget: {
      createFormDesignWidgetConfig: getWidgetElInputNumberConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElInputNumberViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElInputNumberFormComponent, { renderOpts, renderParams });
      }
    },
    ElDatePickerWidget: {
      createFormDesignWidgetConfig: getWidgetElDatePickerConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElDatePickerViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElDatePickerFormComponent, { renderOpts, renderParams });
      }
    },
    ElSelectWidget: {
      createFormDesignWidgetConfig: getWidgetElSelectConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElSelectViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElSelectFormComponent, { renderOpts, renderParams });
      }
    },
    ElRadioWidget: {
      createFormDesignWidgetConfig: getWidgetElRadioConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElRadioViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElRadioFormComponent, { renderOpts, renderParams });
      }
    },
    ElCheckboxWidget: {
      createFormDesignWidgetConfig: getWidgetElCheckboxConfig,
      createFormDesignWidgetFieldValue: () => [],
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElCheckboxViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElCheckboxFormComponent, { renderOpts, renderParams });
      }
    },
    ElSwitchWidget: {
      createFormDesignWidgetConfig: getWidgetElSwitchConfig,
      renderFormDesignWidgetView(renderOpts, renderParams) {
        return h(WidgetElSwitchViewComponent, { renderOpts, renderParams });
      },
      renderFormDesignWidgetFormView(renderOpts, renderParams) {
        return h(WidgetElSwitchFormComponent, { renderOpts, renderParams });
      }
    }
  });
}

// node_modules/@vxe-ui/plugin-render-element/es/index.esm.js
var import_xe_utils6 = __toESM(require_xe_utils());
var ElementPlus;
function getEventTarget(evnt) {
  const target = evnt.target;
  if (target && target.shadowRoot && evnt.composed) {
    return evnt.composedPath()[0] || target;
  }
  return target;
}
function getEventTargetNode(evnt, container, className) {
  let targetElem;
  let target = getEventTarget(evnt);
  const rootEl = document.documentElement || document.querySelector("html");
  while (target && target.nodeType && target !== rootEl) {
    if (className && target.className && target.className.split && target.className.split(" ").indexOf(className) > -1) {
      targetElem = target;
    } else if (target === container) {
      return { flag: className ? !!targetElem : true, container, targetElem };
    }
    target = target.parentElement;
  }
  return { flag: false };
}
function toComponentName(name) {
  if (name) {
    return name.slice(0, 1).toUpperCase() + name.slice(1);
  }
  return name;
}
var VxeUIPluginRenderElement = {
  component(comp) {
    if (comp && comp.name) {
      const kcName = import_xe_utils6.default.kebabCase(comp.name);
      const ccName = toComponentName(import_xe_utils6.default.camelCase(comp.name));
      componentMaps[kcName] = comp;
      componentMaps[ccName] = comp;
    } else {
      console.error("[@vxe-ui/plugin-render-element 4.3.1] error component.", comp);
    }
  },
  install(VxeUI, options) {
    const pluginOpts = Object.assign({}, options);
    if (options) {
      ElementPlus = options.ElementPlus;
      Object.assign(globalConfig, options);
    }
    if (VxeUI.checkVersion) {
      const pVersion = 4;
      const sVersion = 11;
      if (!VxeUI.checkVersion(VxeUI.tableVersion, pVersion, sVersion)) {
        console.error(`[@vxe-ui/plugin-render-element 4.3.1] ${VxeUI.getI18n("vxe.error.errorVersion", [`vxe-table@${VxeUI.tableVersion || "?"}`, `vxe-table v${pVersion}.${sVersion}+`])} https://vxeui.com/other4/#/plugin-render-element/install`);
      }
    } else {
      if (!/^(4)\./.test(VxeUI.uiVersion || VxeUI.tableVersion)) {
        console.error("[@vxe-ui/plugin-render-element 4.3.1] Requires vxe-table 4.7.0+ version. https://vxeui.com/other4/#/plugin-render-element/install");
      }
    }
    function handleClearEvent(params) {
      const { $event } = params;
      const bodyElem = document.body;
      const prefixCls = `${pluginOpts.prefixCls || "el"}`.replace(/-$/, "");
      if (
        // 远程搜索
        getEventTargetNode($event, bodyElem, `${prefixCls}-autocomplete-suggestion`).flag || // 下拉框
        getEventTargetNode($event, bodyElem, `${prefixCls}-select-dropdown`).flag || // 级联
        getEventTargetNode($event, bodyElem, `${prefixCls}-cascader__dropdown`).flag || getEventTargetNode($event, bodyElem, `${prefixCls}-cascader-menus`).flag || // 日期
        getEventTargetNode($event, bodyElem, `${prefixCls}-time-panel`).flag || getEventTargetNode($event, bodyElem, `${prefixCls}-picker-panel`).flag || // 颜色
        getEventTargetNode($event, bodyElem, `${prefixCls}-color-dropdown`).flag
      ) {
        return false;
      }
    }
    defineTableRender(VxeUI);
    defineFormRender(VxeUI);
    defineFormDesignRender(VxeUI);
    VxeUI.interceptor.add("event.clearFilter", handleClearEvent);
    VxeUI.interceptor.add("event.clearEdit", handleClearEvent);
    VxeUI.interceptor.add("event.clearAreas", handleClearEvent);
    VxeUI.interceptor.add("event.clearActived", handleClearEvent);
  }
};
if (typeof window !== "undefined") {
  if (window.VxeUI && window.VxeUI.use) {
    window.VxeUI.use(VxeUIPluginRenderElement);
  }
  if (window.ElementPlus) {
    globalConfig.ElementPlus = window.ElementPlus;
  }
}
var index_esm_default = VxeUIPluginRenderElement;
export {
  VxeUIPluginRenderElement,
  index_esm_default as default
};
//# sourceMappingURL=@vxe-ui_plugin-render-element.js.map
