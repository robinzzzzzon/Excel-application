import { defaultStyles } from '../../core/costants'
import { toInlineStyles } from '../../core/utils'
import { parse } from '../../core/parse'

//создаем объект с константами соотношение char к charCodeAt
const CODES = {
  A: 65,
  Z: 90
}

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

//вспомогательная функция приведения charCodeAt к собственно char исходя из индекса
//первый входной параметр обозначен плейсхолдером, что означает что мы его игнорим.
function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

//функция получения показателей ширины в px для колонок и ячеек
function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px'
}

//функция получения показателей высоты в px для колонок и ячеек
function getHeight(state, info) {
  return (state[info] || DEFAULT_HEIGHT) + 'px'
}

//общая вспомогательная функция заполнения колонок контентом, нумерацией и style-width
function withWidthFrom(state) {
  return function (content, index) {
    return {
      content,
      index,
      width: getWidth(state.colState, index)
    }
  }
}

//функция создания ячеек
function toCell(state, rowNumber) {
  return function (_, colNumber) {
    const id = `${rowNumber}:${colNumber}`
    const width = getWidth(state.colState, colNumber)
    const data = state.dataState[id]
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id]
    })
    return `<div 
    class="cell" 
    contenteditable 
    data-col="${colNumber}"
    data-type="cell"
    data-id="${id}"
    data-value="${data || ''}"
    style="${styles}; width: ${width}"
    >${parse(data) || ''}</div>`
  }
}

//функция создания колонки, которая принимает некий элемент, в нашем случае char
//div с col-resize специально добавлен для дальнейшего оживления под ресайз колонок
//переменная data-resize добавлена, с целью еще одной прослойки для привязки слушателей т.к. классы к которым привязаны дом-элементы могут меняться.
function toColumn({ content, index, width }) {
  return `<div 
          class="column" 
          data-type="resizable" 
          data-col="${index}" 
          style="width: ${width}">
          ${content}
          <div class="col-resize" data-resize="col"></div>
          </div>`
}

//функция создания строки, которая в качестве контента принимает массив колонок
function createRow(info, data, state) {
  //пример переменной для выборочного добавления какого либо элемента.
  //т.к. info не всегда определен, то и div row-resize нужен не всегда
  const resize = info ? `<div class="row-resize" data-resize="row"></div>` : ''
  const height = getHeight(state, info)
  return `<div class="row" 
          data-type="resizable" 
          data-row="${info}" 
          style="height: ${height}">
        <div class="row-info">
        ${info ? info : ''}
        ${resize}
        </div>
        <div class="row-data">${data}</div>
            </div>`
}

//собственно метод создания таблицы:
export function createTable(rowsCount = 10, state = {}) {
  //создаем переменную с кол-вом столбцов
  const colsCount = CODES.Z - CODES.A + 1

  //пустой массив строк
  const rows = []

  //создаем массив через глобальный класс new Array чтобы сразу задать ему размер = colsCount
  const cols = new Array(colsCount)
    .fill('') //теперь заполняем все ячейки пустыми строками
    .map(toChar) //затем переопределяем содержимое массива заполняя ячейки нашими Chars A-Z
    .map(withWidthFrom(state))
    .map(toColumn) //теперь еще раз переопределяем, но теперь заполняем каждый элемент div - элементом с содержимым A-Z
    .join('') //теперь превращяем наш массив в строку, чтобы получить из массива строку

  //наконец создаем нашу первую строчку с названием столбцов, подав на вход наш развернутый из массива html
  rows.push(createRow(null, cols, {}))

  //теперь необходимо самостоятельно реализовать создание строк с обычными пустыми ячейками
  for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
    //создаем массив ячеек по аналогии с колонками, только не заполняем ячейки значениями
    const cells = new Array(colsCount)
      .fill('')
      .map(toCell(state, rowNumber)) //реализация вызова метода с замыканием
      .join('')

    //т.к. нужен отсчет с 1, передаем i + 1
    rows.push(createRow(rowNumber + 1, cells, state.rowState))
  }

  //соотв-нно строки тоже нужно развернуть из массива в html
  return rows.join('')
}
