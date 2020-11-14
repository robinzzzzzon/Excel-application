//создаем объект с константами соотношение char к charCodeAt
const CODES = {
    A: 65,
    Z: 90
}

//функция создания ячеек
function toCell(content) {
    return `<div class="cell" contenteditable>${content}</div>`
}

//функция создания колонки, которая принимает некий элемент, в нашем случае char
function toColumn(content) {
    return `<div class="column">${content}</div>`
}

//функция создания строки, которая в качестве контента принимает массив колонок
function createRow(info, data) {
    return  `<div class="row">
        <div class="row-info">${info ? info : ''}</div>
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
    .map(el => toColumn(el)) //теперь еще раз переопределяем, но теперь заполняем каждый элемент div - элементом с содержимым A-Z
    .join('') //теперь превращяем наш массив в строку, чтобы получить из массива строку

    //создаем массив ячеек по аналогии с колонками, только не заполняем ячейки значениями
    const cells = new Array(colsCount)
    .fill('')
    .map(el => toCell(el))
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