import { ExcelComponent } from '@core/ExcelComponent'
import { createTable } from './table.template'
import { resizeHandler } from './table.resize'
import { isCell, shouldResize, toMatrix, nextSelector } from './table.utils'
import { TableSelection } from './TableSelection'
import { $ } from '@core/dom'

export class Table extends ExcelComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown', 'keydown']
    })
  }

  //Переопределяем метод
  toHTML() {
    return createTable()
  }

  //переопределяем родительский методов и добавляем реализацию
  prepare() {
    this.selection = new TableSelection()
  }

  //переопределяем родительский метод init()
  init() {
    super.init()

    //т.к. table-компонент это так же объект класса dom, то обращаемся к его методам, с реализацией выбора 1й ячейки как активной
    const $cell = this.$root.find('[data-id="0:0"]')
    this.selection.selectAny($cell)
  }

  //общий метод ресайза таблицы
  onMousedown(event) {
    //1)Как вариант мы получаем доступ до элемента по функции getAttribute(), которая подходит для всех случаев

    //2)А можно получать доступ до переменных data у DOM-элементов с помощью функции dataset. В нашем случае это data-resize
    if (shouldResize(event)) {
      resizeHandler(this.$root, event)

      //ниже реализация выделения 1й или группы активных ячеек
    } else if (isCell(event)) {
      //оборачиваем для удобства выбранную ячейку
      const $target = $(event.target)
      //если был зажат Shift, то реализуем selected для группы
      if (event.shiftKey) {
        //определяем id текущей ячейки
        const current = this.selection.current.getId(true)
        //определяем id целевой(конечной) ячейки
        const target = $target.getId(true)

        //получаем сматченный массив выбранных ячеек
        const $selectedCells = toMatrix(current, target).map((id) => {
          return this.$root.find(`[data-id="${id}"]`)
        })

        //добавляем cssClass всем элементам
        this.selection.selectGroup($selectedCells)
      } else {
        //добавляем cssClass 1й выбранной ячейке
        this.selection.selectAny($target)
      }
    }
  }

  //метод обработки события нажатия клавиш
  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp'
    ]

    //получаем объект из эвента
    const { key } = event

    //если key содержится в объектах массива и не нажат шифт, то отменяем дефолтное поведение
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()

      //получаем id текущего объекта-ячейки
      const id = this.selection.current.getId(true)
      //вычисляем id по nextSelector() и находим этот элемент
      const $next = this.$root.find(nextSelector(key, id))
      //перемещаем фокус на найденный элемент + делаем его выделенным
      this.selection.selectAny($next)
    }
  }
}
