//создаем объект с константами соотношение char к charCodeAt
const CODES = {
    A: 65,
    Z: 90
}

//функция создания ячеек
function toCell(content, index) {
    return `<div class="cell" contenteditable data-col="${index}">${content}</div>`
}

//функция создания колонки, которая принимает некий элемент, в нашем случае char
//div с col-resize специально добавлен для дальнейшего оживления под ресайз колонок
//переменная data-resize добавлена, с целью еще одной прослойки для привязки слушателей т.к. классы к которым привязаны дом-элементы могут меняться.
function toColumn(content, index) {
    return `<div class="column" data-type="resizable" data-col="${index}">
    ${content}
    <div class="col-resize" data-resize="col"></div>
    </div>`
}

//функция создания строки, которая в качестве контента принимает массив колонок
function createRow(info, data) {

    //пример переменной для выборочного добавления какого либо элемента.
    //т.к. info не всегда определен, то и div row-resize нужен не всегда
    const resize = info ? `<div class="row-resize" data-resize="row"></div>` : ''

    return  `<div class="row" data-type="resizable" data-row="${info}">
        <div class="row-info">
        ${info ? info : ''}
        ${resize}
        </div>
        <div class="row-data">${data}</div>
            </div>`
}

//вспомогательная функция приведения charCodeAt к собственно char исходя из индекса
//первый входной параметр обозначен плейсхолдером, что означает что мы его игнорим.
function toChar( _, index) {
    return String.fromCharCode(CODES.A + index)
}

//собственно метод создания таблицы:
export function createTable(rowsCount = 10) {

    //создаем переменную с кол-вом столбцов
    const colsCount = CODES.Z - CODES.A + 1

    //пустой массив строк
    const rows = []

    //создаем массив через глобальный класс new Array чтобы сразу задать ему размер = colsCount
    const cols = new Array(colsCount)
    .fill('') //теперь заполняем все ячейки пустыми строками
    .map((el, index) => toChar(el, index)) //затем переопределяем содержимое массива заполняя ячейки нашими Chars A-Z
    .map((el, index) => toColumn(el, index)) //теперь еще раз переопределяем, но теперь заполняем каждый элемент div - элементом с содержимым A-Z
    .join('') //теперь превращяем наш массив в строку, чтобы получить из массива строку

    //создаем массив ячеек по аналогии с колонками, только не заполняем ячейки значениями
    const cells = new Array(colsCount)
    .fill('')
    .map((el, index) => toCell(el, index))
    .join('')

    //наконец создаем нашу первую строчку с названием столбцов, подав на вход наш развернутый из массива html
    rows.push(createRow(null, cols))

    //теперь необходимо самостоятельно реализовать создание строк с обычными пустыми ячейками
    for (let i = 0; i < rowsCount; i++) {
        //т.к. нужен отсчет с 1, передаем i + 1
        rows.push(createRow(i + 1, cells))
    }

    //соотв-нно строки тоже нужно развернуть из массива в html
    return rows.join('')
}