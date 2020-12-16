import { range } from '@core/utils'
//метод для проверки возможности ресайза выбранного элемента
export function shouldResize(event) {
  return event.target.dataset.resize
}

//функция для удобства возвращения параметра у ячеек
export function isCell(event) {
  return event.target.dataset.type === 'cell'
}

//функция матчинга 2х массивов idшников строк и колонок
export function toMatrix($current, $target) {
  //получаем размеры(для нас это расстояние) массивов исходя из входных col и row-значений 2х ячеек
  const selectedCollsArray = range($current.col, $target.col)
  const selectRowsArray = range($current.row, $target.row)

  //на выход подаем сматченный массив соотношения row:col между current и target ячейками
  return selectedCollsArray.reduce((acc, col) => {
    selectRowsArray.forEach((row) => acc.push(`${row}:${col}`))
    return acc
  }, [])
}

//получение id след. элемента по нажатию клавиш относительно текущего элемента
export function nextSelector(key, { col, row }) {
  const MIN_VALUE = 0
  switch (key) {
    case 'Enter':
    case 'ArrowDown':
      row++
      break
    case 'Tab':
    case 'ArrowRight':
      col++
      break
    case 'ArrowLeft':
      col = col - 1 < MIN_VALUE ? MIN_VALUE : col - 1
      break
    case 'ArrowUp':
      row = row - 1 < MIN_VALUE ? MIN_VALUE : row - 1
      break
  }

  //возвращаем новый id
  return `[data-id="${row}:${col}"]`
}
