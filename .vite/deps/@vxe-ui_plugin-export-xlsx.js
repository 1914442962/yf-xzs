import {
  require_xe_utils
} from "./chunk-OZ7H3HZS.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/@vxe-ui/plugin-export-xlsx/es/index.esm.js
var import_xe_utils = __toESM(require_xe_utils());
var VxeUI;
var globalExcelJS;
var defaultHeaderBackgroundColor = "f2f2f2";
var defaultCellFontColor = "000000";
var defaultCellBorderStyle = "thin";
var defaultCellBorderColor = "e0e0e0";
var defaultFontSizeMaps = {
  default: 14,
  medium: 14,
  small: 13,
  mini: 12
};
var httpPromiseMaps = {};
var httpBufferMaps = {};
function getExcelJS() {
  const ExcelJS = globalExcelJS || window.ExcelJS;
  if (!ExcelJS) {
    console.error("[@vxe-ui/plugin-export-xlsx 4.5.1] Install error. ExcelJS not exist.");
  }
  return ExcelJS;
}
function getCellLabel($xeTable, column, cellValue) {
  const { cellType, cellRender, editRender } = column;
  const renderOpts = editRender || cellRender;
  if (cellValue) {
    if (renderOpts) {
      if (["VxeImage", "VxeImageGroup", "VxeUpload"].includes(renderOpts.name || "")) {
        return "";
      }
    }
    if (column.type === "seq") {
      const tableProps = $xeTable.props;
      const { treeConfig } = tableProps;
      if (!treeConfig) {
        if (!isNaN(cellValue)) {
          return Number(cellValue);
        }
      }
      return import_xe_utils.default.toValueString(cellValue);
    }
    switch (cellType) {
      case "string":
        return import_xe_utils.default.toValueString(cellValue);
      case "number":
        if (!isNaN(cellValue)) {
          return Number(cellValue);
        }
        break;
    }
    if (cellValue.length < 12 && !isNaN(cellValue)) {
      return Number(cellValue);
    }
  }
  return import_xe_utils.default.toValueString(cellValue);
}
function getFooterData($xeTable, opts, footerData) {
  const $xeGrid = $xeTable.xeGrid;
  const $xeGantt = $xeTable.xeGantt;
  const { footerFilterMethod } = opts;
  return footerFilterMethod ? footerData.filter((items, index) => footerFilterMethod({ $table: $xeTable, $grid: $xeGrid, $gantt: $xeGantt, items, $rowIndex: index })) : footerData;
}
function getFooterCellValue($xeTable, opts, row, column) {
  const { renderer } = VxeUI;
  const { computeColumnOpts } = $xeTable.getComputeMaps();
  const columnOpts = computeColumnOpts.value;
  const renderOpts = column.editRender || column.cellRender;
  let footLabelMethod = column.footerExportMethod;
  if (!footLabelMethod && renderOpts && renderOpts.name) {
    const compConf = renderer.get(renderOpts.name);
    if (compConf) {
      footLabelMethod = compConf.tableFooterExportMethod || compConf.footerExportMethod;
    }
  }
  if (!footLabelMethod) {
    footLabelMethod = columnOpts.footerExportMethod;
  }
  if (footLabelMethod) {
    const _columnIndex = $xeTable.getVTColumnIndex(column);
    return footLabelMethod({ $table: $xeTable, items: row, itemIndex: _columnIndex, row, _columnIndex, column, options: opts });
  }
  if ($xeTable.getFooterCellLabel) {
    return getCellLabel($xeTable, column, $xeTable.getFooterCellLabel(row, column));
  }
  if (import_xe_utils.default.isArray(row)) {
    const _columnIndex = $xeTable.getVTColumnIndex(column);
    return getCellLabel($xeTable, column, row[_columnIndex]);
  }
  return getCellLabel($xeTable, column, import_xe_utils.default.get(row, column.field));
}
function getValidColumn(column) {
  const { childNodes } = column;
  const isColGroup = childNodes && childNodes.length;
  if (isColGroup) {
    return getValidColumn(childNodes[0]);
  }
  return column;
}
function setExcelRowHeight(excelRow, height) {
  if (height) {
    excelRow.height = import_xe_utils.default.floor(height * 1.13, 2);
  }
}
function setExcelCellStyle(excelCell, align) {
  excelCell.protection = {
    locked: false
  };
  excelCell.alignment = {
    vertical: "middle",
    horizontal: align || "left"
  };
}
function getImgType(name) {
  const index = name.lastIndexOf(".");
  let ext = "";
  if (index > 0) {
    ext = name.substring(index + 1).toLowerCase();
  }
  return ext || "png";
}
function getExcelCellCurrencySymbol(currencySymbol) {
  if (currencySymbol === "$") {
    return "$";
  }
  if (currencySymbol === "¥" || currencySymbol === "￥") {
    return "¥";
  }
  return currencySymbol;
}
function getExcelCellNumberValSymbol(digits) {
  return `0.${import_xe_utils.default.padEnd("0", digits, "0")}`;
}
function getExcelCellNumberColorSymbol(showNegativeStatus) {
  if (showNegativeStatus) {
    return "[Red]";
  }
  return "";
}
function settExcelCellFormat(workbook, worksheet, excelCell, column, excelRow, row) {
  const { getConfig, getI18n } = VxeUI;
  const { cellType, cellRender, editRender } = column;
  if (cellType !== "string") {
    const renderOpts = editRender || cellRender;
    if (renderOpts) {
      const { name, props = {}, showNegativeStatus } = renderOpts;
      if (name === "VxeNumberInput" || name === "FormatNumberInput") {
        const { type, digits } = props;
        const numberInputConfig = getConfig().numberInput || {};
        if (type === "amount") {
          const numDigits = digits || numberInputConfig.digits || 2;
          const numSymbol = getExcelCellNumberValSymbol(numDigits);
          excelCell.numFmt = `##${numSymbol};${getExcelCellNumberColorSymbol(showNegativeStatus)}\\-##${numSymbol}`;
          const showCurrency = props.showCurrency;
          if (import_xe_utils.default.isBoolean(showCurrency) ? showCurrency : numberInputConfig.showCurrency) {
            const currencySymbol = getExcelCellCurrencySymbol(props.currencySymbol || numberInputConfig.currencySymbol || getI18n("vxe.numberInput.currencySymbol") || "");
            excelCell.numFmt = `"${currencySymbol}"#,##${numSymbol};${getExcelCellNumberColorSymbol(showNegativeStatus)}-"${currencySymbol}"#,##${numSymbol}`;
          }
        } else {
          const numDigits = digits || (type === "float" ? numberInputConfig.digits : 2) || 1;
          const numSymbol = getExcelCellNumberValSymbol(numDigits);
          excelCell.numFmt = `##${numSymbol};${getExcelCellNumberColorSymbol(showNegativeStatus)}\\-##${numSymbol}`;
        }
      } else if (renderOpts.name === "VxeImage" || renderOpts.name === "VxeImageGroup") {
        const { width, height } = (renderOpts.name === "VxeImage" ? props : props.imageStyle) || {};
        const cellValue = import_xe_utils.default.get(row, column.field);
        if (cellValue) {
          (import_xe_utils.default.isArray(cellValue) ? cellValue.slice(0, 1) : [cellValue]).forEach((item) => {
            if (item) {
              const imgUrl = import_xe_utils.default.isString(item) ? item : item.url;
              if (imgUrl) {
                const imgBuffer = httpBufferMaps[imgUrl];
                if (imgBuffer) {
                  const cellImage = workbook.addImage({
                    buffer: imgBuffer,
                    extension: getImgType(imgUrl)
                  });
                  worksheet.addImage(cellImage, {
                    tl: {
                      col: Math.max(0, import_xe_utils.default.toNumber(excelCell.col) - 1),
                      row: Math.max(0, import_xe_utils.default.toNumber(excelCell.row) - 1)
                    },
                    ext: {
                      width: import_xe_utils.default.toNumber(width || height) || 24,
                      height: import_xe_utils.default.toNumber(height || width) || 24
                    }
                  });
                }
              }
            }
          });
        }
      } else if (renderOpts.name === "VxeUpload" && props.mode === "image") {
        const { urlField, typeField, imageConfig } = props;
        const { width, height } = imageConfig || {};
        const cellValue = import_xe_utils.default.get(row, column.field);
        if (cellValue) {
          (import_xe_utils.default.isArray(cellValue) ? cellValue.slice(0, 1) : [cellValue]).forEach((item) => {
            if (item) {
              const imgUrl = import_xe_utils.default.isString(item) ? item : item[urlField || "url"];
              if (imgUrl) {
                const imgBuffer = httpBufferMaps[imgUrl];
                if (imgBuffer) {
                  const cellImage = workbook.addImage({
                    buffer: imgBuffer,
                    extension: (import_xe_utils.default.isString(item) ? "" : item[typeField]) || getImgType(imgUrl)
                  });
                  worksheet.addImage(cellImage, {
                    tl: {
                      col: Math.max(0, import_xe_utils.default.toNumber(excelCell.col) - 1),
                      row: Math.max(0, import_xe_utils.default.toNumber(excelCell.row) - 1)
                    },
                    ext: {
                      width: import_xe_utils.default.toNumber(width || height) || 24,
                      height: import_xe_utils.default.toNumber(height || width) || 24
                    }
                  });
                }
              }
            }
          });
        }
      }
    }
  }
}
function getDefaultBorderStyle() {
  return {
    top: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    left: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    bottom: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    right: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    }
  };
}
function handleParseColumnImageUrl(params) {
  const { columns, datas } = params;
  const urlList = [];
  columns.forEach((column) => {
    const { cellRender, editRender } = column;
    const renderOpts = editRender || cellRender || {};
    const { name, props = {} } = renderOpts;
    if (name === "VxeImage" || name === "VxeImageGroup") {
      datas.forEach((rowRest) => {
        const row = rowRest._row;
        const cellValue = import_xe_utils.default.get(row, column.field);
        if (cellValue) {
          (import_xe_utils.default.isArray(cellValue) ? cellValue : [cellValue]).forEach((item) => {
            if (item) {
              const imgUrl = item.url ? item.url : `${item || ""}`;
              if (imgUrl) {
                urlList.push(imgUrl);
              }
            }
          });
        }
      });
    } else if (name === "VxeUpload" && props.mode === "image") {
      const { urlField } = props;
      datas.forEach((rowRest) => {
        const row = rowRest._row;
        const cellValue = import_xe_utils.default.get(row, column.field);
        if (cellValue) {
          (import_xe_utils.default.isArray(cellValue) ? cellValue : [cellValue]).forEach((item) => {
            if (item) {
              const imgUrl = import_xe_utils.default.isString(item) ? item : item[urlField || "url"];
              if (imgUrl) {
                urlList.push(imgUrl);
              }
            }
          });
        }
      });
    }
  });
  if (urlList.length) {
    return handleFetchImage(urlList);
  }
}
function handleFetchImage(urlList) {
  let fIndex = 0;
  const handleStartFetch = () => {
    if (fIndex < urlList.length) {
      const restList = [];
      let count = 1;
      for (; fIndex < urlList.length; fIndex++) {
        const url = urlList[fIndex];
        if (!httpBufferMaps[url]) {
          if (!httpPromiseMaps[url]) {
            count++;
            httpPromiseMaps[url] = fetch(url).then((res) => res.arrayBuffer()).then((arrayBuffer) => {
              httpBufferMaps[url] = arrayBuffer;
              delete httpPromiseMaps[url];
            }).catch(() => {
              delete httpPromiseMaps[url];
            });
          }
          restList.push(httpPromiseMaps[url]);
        }
        if (count >= 4) {
          break;
        }
      }
      return Promise.all(restList).then(() => {
        if (fIndex < urlList.length) {
          return handleStartFetch();
        }
      });
    }
    return Promise.resolve();
  };
  return handleStartFetch();
}
function exportXLSX(params) {
  const msgKey = import_xe_utils.default.uniqueId("xlsx");
  const { modal, getI18n } = VxeUI;
  const { $table, $grid, options, columns, colgroups, datas } = params;
  const tableProps = $table.props;
  const tableReactData = $table.reactData;
  const { computeSize, computeColumnOpts } = $table.getComputeMaps();
  const { headerAlign: allHeaderAlign, align: allAlign, footerAlign: allFooterAlign } = tableProps;
  const { rowHeight } = tableReactData;
  const { message, download, sheetName, isHeader, isFooter, isMerge, isColgroup, isTitle, useStyle, sheetMethod } = options;
  const vSize = computeSize.value;
  const columnOpts = computeColumnOpts.value;
  const showMsg = message !== false;
  const mergeCells = $table.getMergeCells();
  const fontSize = defaultFontSizeMaps[vSize || ""] || 14;
  const colList = [];
  let footList = [];
  const footArr = [];
  const sheetCols = [];
  const sheetMerges = [];
  let beforeRowCount = 0;
  columns.forEach((column) => {
    const { id, renderWidth } = column;
    sheetCols.push({
      key: id,
      width: import_xe_utils.default.ceil(renderWidth / 7.2, 1)
    });
  });
  if (isHeader) {
    if (isColgroup && colgroups) {
      colgroups.forEach((cols, rIndex) => {
        const groupHead = {};
        columns.forEach((column) => {
          groupHead[column.id] = null;
        });
        cols.forEach((column) => {
          const { _colSpan, _rowSpan } = column;
          const validColumn = getValidColumn(column);
          const columnIndex = columns.indexOf(validColumn);
          const headExportMethod = column.headerExportMethod || columnOpts.headerExportMethod;
          groupHead[validColumn.id] = headExportMethod ? headExportMethod({ column, options, $table }) : isTitle ? column.getTitle() : validColumn.field;
          if (_colSpan > 1 || _rowSpan > 1) {
            sheetMerges.push({
              s: { r: rIndex, c: columnIndex },
              e: { r: rIndex + _rowSpan - 1, c: columnIndex + _colSpan - 1 }
            });
          }
        });
        colList.push(groupHead);
      });
    } else {
      const colHead = {};
      columns.forEach((column) => {
        const { id, field } = column;
        const headExportMethod = column.headerExportMethod || columnOpts.headerExportMethod;
        colHead[id] = headExportMethod ? headExportMethod({ column, options, $table }) : isTitle ? column.getTitle() : field;
      });
      colList.push(colHead);
    }
    beforeRowCount += colList.length;
  }
  if (isMerge) {
    mergeCells.forEach((mergeItem) => {
      const { row: mergeRowIndex, rowspan: mergeRowspan, col: mergeColIndex, colspan: mergeColspan } = mergeItem;
      sheetMerges.push({
        s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
        e: { r: mergeRowIndex + beforeRowCount + mergeRowspan - 1, c: mergeColIndex + mergeColspan - 1 }
      });
    });
  }
  const rowList = datas;
  const rowArr = rowList.map((item) => {
    const rest = {};
    columns.forEach((column) => {
      rest[column.id] = getCellLabel($table, column, item[column.id]);
    });
    return rest;
  });
  beforeRowCount += rowList.length;
  if (isFooter) {
    const { footerData } = $table.getTableData();
    footList = getFooterData($table, options, footerData);
    const mergeFooterItems = $table.getMergeFooterItems();
    if (isMerge) {
      mergeFooterItems.forEach((mergeItem) => {
        const { row: mergeRowIndex, rowspan: mergeRowspan, col: mergeColIndex, colspan: mergeColspan } = mergeItem;
        sheetMerges.push({
          s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
          e: { r: mergeRowIndex + beforeRowCount + mergeRowspan - 1, c: mergeColIndex + mergeColspan - 1 }
        });
      });
    }
    footList.forEach((row) => {
      const item = {};
      columns.forEach((column) => {
        item[column.id] = getFooterCellValue($table, options, row, column);
      });
      footArr.push(item);
    });
  }
  const exportMethod = () => {
    const ExcelObj = getExcelJS();
    if (!ExcelObj) {
      if (modal) {
        modal.close(msgKey);
      }
      return Promise.resolve({
        status: false
      });
    }
    const workbook = new ExcelObj.Workbook();
    const sheet = workbook.addWorksheet(sheetName || "Sheet1");
    workbook.creator = "vxe-table";
    sheet.columns = sheetCols;
    if (isHeader) {
      sheet.addRows(colList).forEach((excelRow) => {
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight);
        }
        excelRow.eachCell((excelCell) => {
          const excelCol = sheet.getColumn(excelCell.col);
          const column = $table.getColumnById(excelCol.key);
          const { headerAlign, align } = column;
          setExcelCellStyle(excelCell, headerAlign || align || allHeaderAlign || allAlign);
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                bold: true,
                size: fontSize,
                color: {
                  argb: defaultCellFontColor
                }
              },
              fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: defaultHeaderBackgroundColor
                }
              },
              border: getDefaultBorderStyle()
            });
          }
        });
      });
    }
    sheet.addRows(rowArr).forEach((excelRow, rIndex) => {
      const row = rowList[rIndex]._row;
      if (useStyle) {
        setExcelRowHeight(excelRow, rowHeight);
      }
      excelRow.eachCell((excelCell) => {
        const excelCol = sheet.getColumn(excelCell.col);
        const column = $table.getColumnById(excelCol.key);
        if (column) {
          const { align } = column;
          setExcelCellStyle(excelCell, align || allAlign);
          settExcelCellFormat(workbook, sheet, excelCell, column, excelRow, row);
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                size: fontSize,
                color: {
                  argb: defaultCellFontColor
                }
              },
              border: getDefaultBorderStyle()
            });
          }
        }
      });
    });
    if (isFooter) {
      sheet.addRows(footArr).forEach((excelRow, rIndex) => {
        const row = footList[rIndex];
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight);
        }
        excelRow.eachCell((excelCell) => {
          const excelCol = sheet.getColumn(excelCell.col);
          const column = $table.getColumnById(excelCol.key);
          if (column) {
            const { footerAlign, align } = column;
            setExcelCellStyle(excelCell, footerAlign || align || allFooterAlign || allAlign);
            settExcelCellFormat(workbook, sheet, excelCell, column, excelRow, row);
            if (useStyle) {
              Object.assign(excelCell, {
                font: {
                  size: fontSize,
                  color: {
                    argb: defaultCellFontColor
                  }
                },
                border: getDefaultBorderStyle()
              });
            }
          }
        });
      });
    }
    return Promise.resolve(
      // 自定义处理
      sheetMethod ? sheetMethod({
        options,
        workbook,
        worksheet: sheet,
        columns,
        colgroups,
        datas,
        $grid,
        $table
      }) : null
    ).then(() => {
      sheetMerges.forEach(({ s, e }) => {
        sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1);
      });
      return workbook.xlsx.writeBuffer().then((buffer) => {
        const type = "application/octet-stream";
        const blob = new Blob([buffer], { type });
        if (modal) {
          modal.close(msgKey);
        }
        if (showMsg && modal) {
          modal.message({
            content: getI18n("vxe.table.expSuccess"),
            status: "success"
          });
        }
        if (download) {
          downloadFile(params, blob, options);
          return {
            status: true
          };
        }
        return { type, content: "", blob };
      });
    }).catch(() => {
      if (modal) {
        modal.close(msgKey);
      }
      if (showMsg && modal) {
        modal.message({
          content: getI18n("vxe.table.expError"),
          status: "error"
        });
      }
      return {
        status: false
      };
    });
  };
  return Promise.all([
    handleParseColumnImageUrl(params)
  ]).then(() => {
    if (showMsg && modal) {
      modal.message({
        id: msgKey,
        content: getI18n("vxe.table.expLoading"),
        status: "loading",
        duration: -1
      });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(exportMethod());
        }, 1500);
      });
    }
    return exportMethod();
  });
}
function downloadFile(params, blob, options) {
  const { modal, t } = VxeUI;
  const { message, filename, type } = options;
  const showMsg = message !== false;
  if (window.Blob) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, `${filename}.${type}`);
    } else {
      const linkElem = document.createElement("a");
      linkElem.target = "_blank";
      linkElem.download = `${filename}.${type}`;
      linkElem.href = URL.createObjectURL(blob);
      document.body.appendChild(linkElem);
      linkElem.click();
      document.body.removeChild(linkElem);
    }
  } else {
    if (showMsg && modal) {
      modal.alert({ content: t("vxe.error.notExp"), status: "error" });
    }
  }
}
function importError(params) {
  const { modal, t } = VxeUI;
  const { $table, options } = params;
  const tableInternalData = $table.internalData;
  const { _importReject } = tableInternalData;
  const showMsg = options.message !== false;
  if (showMsg && modal) {
    modal.message({ content: t("vxe.error.impFields"), status: "error" });
  }
  if (_importReject) {
    _importReject({ status: false });
  }
}
function importXLSX(params) {
  const { modal, getI18n } = VxeUI;
  const { $table, columns, options, file } = params;
  const tableInternalData = $table.internalData;
  const { _importResolve } = tableInternalData;
  const ExcelObj = getExcelJS();
  if (!ExcelObj) {
    if (_importResolve) {
      _importResolve({
        status: false
      });
    }
    return;
  }
  const showMsg = options.message !== false;
  const fileReader = new FileReader();
  fileReader.onerror = () => {
    importError(params);
  };
  fileReader.onload = (evnt) => {
    const tableFieldMaps = {};
    const tableTitleMaps = {};
    columns.forEach((column) => {
      const field = column.field;
      const title = column.getTitle();
      if (field) {
        tableFieldMaps[field] = column;
      }
      if (title) {
        tableTitleMaps[column.getTitle()] = column;
      }
    });
    const workbook = new ExcelObj.Workbook();
    const readerTarget = evnt.target;
    if (readerTarget) {
      workbook.xlsx.load(readerTarget.result).then((wb) => {
        const firstSheet = wb.worksheets[0];
        if (firstSheet) {
          const sheetValues = Array.from(firstSheet.getSheetValues());
          const fieldIndex = import_xe_utils.default.findIndexOf(sheetValues, (list) => list && list.length > 0);
          const heads = sheetValues[fieldIndex];
          let status = false;
          const fields = heads.map((key) => {
            if (tableFieldMaps[key]) {
              if (!status) {
                status = true;
              }
              return key;
            }
            if (tableTitleMaps[key]) {
              if (!status) {
                status = true;
              }
              return tableTitleMaps[key].field;
            }
            return null;
          });
          if (status) {
            const records = sheetValues.slice(fieldIndex + 1).map((list) => {
              const record = {};
              fields.forEach((field, cIndex) => {
                if (field) {
                  record[field] = import_xe_utils.default.isUndefined(list[cIndex]) ? null : list[cIndex];
                }
              });
              return record;
            });
            $table.createData(records).then((data) => {
              let loadRest;
              if (options.mode === "insertTop") {
                loadRest = $table.insertAt(data, 0);
              } else if (options.mode === "insertBottom" || options.mode === "insert") {
                loadRest = $table.insertAt(data, -1);
              } else {
                const { visibleData } = $table.getTableData();
                loadRest = $table.remove(visibleData).then(() => $table.insertAt(data, -1));
              }
              return loadRest.then(() => {
                if (_importResolve) {
                  _importResolve({ status: true });
                }
              });
            });
            if (showMsg && modal) {
              modal.message({ content: getI18n("vxe.table.impSuccess", [records.length]), status: "success" });
            }
          } else {
            importError(params);
          }
        } else {
          importError(params);
        }
      });
    } else {
      importError(params);
    }
  };
  fileReader.readAsArrayBuffer(file);
}
function hasAdvancedVersion(tableVersion) {
  const vRest = tableVersion ? `${tableVersion}`.match(/(\d+)\.(\d+)\./) : null;
  return vRest && import_xe_utils.default.toNumber(vRest[1]) >= 4 && import_xe_utils.default.toNumber(vRest[2]) >= 12;
}
function handleImportEvent(params) {
  if (params.options.type === "xlsx") {
    if (VxeUI && hasAdvancedVersion(VxeUI.tableVersion || "")) {
      return {
        result: importXLSX(params),
        status: false
      };
    }
    return false;
  }
}
function handleExportEvent(params) {
  if (params.options.type === "xlsx") {
    if (VxeUI && hasAdvancedVersion(VxeUI.tableVersion || "")) {
      return {
        result: exportXLSX(params),
        status: false
      };
    }
    return false;
  }
}
function pluginSetup(options) {
  globalExcelJS = options ? options.ExcelJS : null;
}
var VxeUIPluginExportXLSX = {
  setConfig: pluginSetup,
  install(core, options) {
    VxeUI = core;
    if (VxeUI.checkVersion) {
      const pVersion = 4;
      const sVersion = 11;
      if (!VxeUI.checkVersion(VxeUI.tableVersion, pVersion, sVersion)) {
        console.error(`[@vxe-ui/plugin-export-xlsx 4.5.1] ${VxeUI.getI18n("vxe.error.errorVersion", [`vxe-table@${VxeUI.tableVersion || "?"}`, `vxe-table v${pVersion}.${sVersion}+`])} https://vxeui.com/other4/#/plugin-export-xlsx/install`);
      }
    } else {
      if (!/^(4)\./.test(VxeUI.uiVersion || VxeUI.tableVersion)) {
        console.error("[@vxe-ui/plugin-export-xlsx 4.5.1] Requires vxe-table 4.7.0+ version. https://vxeui.com/other4/#/plugin-export-xlsx/install");
      }
    }
    if (options) {
      pluginSetup(options);
    }
    VxeUI.setConfig({
      table: {
        importConfig: {
          _typeMaps: {
            xlsx: 1
          }
        },
        exportConfig: {
          _typeMaps: {
            xlsx: 1
          }
        }
      }
    });
    VxeUI.interceptor.mixin({
      "event.import": handleImportEvent,
      "event.export": handleExportEvent
    });
  }
};
if (typeof window !== "undefined" && window.VxeUI && window.VxeUI.use) {
  window.VxeUI.use(VxeUIPluginExportXLSX);
}
var index_esm_default = VxeUIPluginExportXLSX;
export {
  VxeUIPluginExportXLSX,
  index_esm_default as default
};
//# sourceMappingURL=@vxe-ui_plugin-export-xlsx.js.map
