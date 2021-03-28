const CODES = {
    A: 65,
    Z: 90
}

function createCell(i, col) {
    return `
        <div
        class="cell"
        contenteditable
        data-col="${col}"
        data-id="${i}:${col}"
        data-type="cell"
        ></div>
    `
}
function createCol(el, index) {
    return `
        <div class="column" data-type="resizable" data-col="${index}">
            ${el}
            <div class="col-resize" data-resize="col"></div>
        </div>
    `
}
function createRow(index, content) {
    const resizer = index ?
        '<div class="row-resize" data-resize="row"></div>' :
        ''
    return `
        <div class="row" data-type="resizable" data-row="${index}">
            <div class="row-info">
                ${index ? index : ''}
                ${resizer}
            </div>
            <div class="row-data">${content}</div>
        </div>
    `
}

export function createTable(rowscount = 15) {
    const colsCount = CODES.Z - CODES.A + 1
    const rows = []
    const cols = new Array(colsCount)
        .fill('')
        .map((el, index) => {
        return String.fromCharCode(CODES.A + index)
    })
        .map(createCol)
        .join('')
    rows.push(createRow(null, cols))
    for (let i = 0; i <rowscount; i++) {
        const cells = new Array(colsCount)
            .fill('')
            .map((_, col) => createCell(i, col))
            .join('')
        rows.push(createRow(i+1, cells))
    }
    return rows.join('')
}
