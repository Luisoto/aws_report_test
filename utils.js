
const xl = require('excel4node');

exports.itemsToExcel = (items) => {
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet('Sheet 1');
    let columnNames = getAllColumns(items);
    let row = 2
    let columnIndex = 1
    //Create table titles
    columnNames.forEach(columnName => {
        ws.cell(1, columnIndex).string(columnName);
        columnIndex ++
    });
    items.forEach(item => {
        const columns = Object.keys(item);
        columns.forEach(column => {
            if (typeof item[column] === 'object') {
                //Create columns from value
                const nestedColumns = Object.keys(item[column]);
                nestedColumns.forEach(nestedColumn => {
                    const nestedColumnName = column + '_' + nestedColumn;
                    const indexFound = columnNames.findIndex(columName => columName === nestedColumnName);
                    ws.cell(row, indexFound+1).string(item[column][nestedColumn].toString());
                });
            }
            else {
                const indexFound = columnNames.findIndex(columnName => columnName === column);
                ws.cell(row, indexFound+1).string(item[column].toString())
            }

        })
        row ++
    });
    return wb;
}
exports.itemsToDocDefinition = (items) => {
    const columnNames = getAllColumns(items)
    let bodyArray = [columnNames]
    items.forEach(item => {
       const tempItemArray = Array(columnNames.length).fill("")
        const columns = Object.keys(item);
        columns.forEach(column => {
            if (typeof item[column] === 'object') {
                //Create columns from value
                const nestedColumns = Object.keys(item[column]);
                nestedColumns.forEach(nestedColumn => {
                    const nestedColumnName = column + '_' + nestedColumn;
                    const indexFound = columnNames.findIndex(columName => columName === nestedColumnName);
                    tempItemArray[indexFound] = item[column][nestedColumn].toString();
                });
            }
            else {
                const indexFound = columnNames.findIndex(columnName => columnName === column);
                tempItemArray[indexFound] = item[column].toString();
            }
        });
        bodyArray.push(tempItemArray);
    });
    return bodyArray;
}

function getAllColumns(items) {
    let columns = [];
    items.forEach(item => {
        const itemColumns = Object.keys(item);
        itemColumns.forEach(itemColum => {
            if(typeof item[itemColum] === 'object'){
                const nestedKeys = Object.keys(item[itemColum]);
                nestedKeys.forEach(nestedItemKey => {
                    const nestedColumn = itemColum + '_' + nestedItemKey
                    if (columns.indexOf(nestedColumn) === -1) {
                        columns.push(nestedColumn)
                    }
                });
            }
            else {
                if (columns.indexOf(itemColum) === -1) {
                    columns.push(itemColum)
                }
            }
        })
    });
    return columns;
}