import { ExcelComponent } from '@core/ExcelComponent'
import { createTable } from './table.template'
import { resizeHandler } from './table.resize'
import { shouldResize } from './table.utils'
import { TableSelection } from './TableSelection'

export class Table extends ExcelComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
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
    }
  }
}
