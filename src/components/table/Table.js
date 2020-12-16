import { ExcelComponent } from '@core/ExcelComponent'
import { createTable } from './table.template'
import { resizeHandler } from './table.resize'
import { isCell, shouldResize, toMatrix, nextSelector } from './table.functions'
import { TableSelection } from './TableSelection'
import * as actions from '../../redux/actions'
import { $ } from '@core/dom'
import { defaultStyles } from '../../core/costants'
import { parse } from '../../core/parse'

export class Table extends ExcelComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
  }

  //Переопределяем метод
  toHTML() {
    //создаем таблицу и при создании получаем состояние
    return createTable(20, this.store.getState())
  }

  //переопределяем родительский методов и добавляем реализацию
  prepare() {
    this.selection = new TableSelection()
  }

  //переопределяем родительский метод init()
  init() {
    super.init()

    //т.к. table-компонент это так же объект класса dom,
    //то обращаемся к его методам, с реализацией выбора 1й ячейки как активной
    const $cell = this.$root.find('[data-id="0:0"]')
    //селектим 1ю ячейку + уведомляем о событии
    this.selectCell($cell)

    //подписываемся на событие ввода для формулы и сэтим это значение в текущую ячейку
    this.$on('formula:input', (value) => {
      this.selection.current.getAttr('data-value', value).text(parse(value))
      this.updateTextInStore(value)
    })

    //подписываемся на событие окончания ввода по Enter/Tab и смещаем фокус на текущую ячейку
    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value)
      this.$dispatch(
        actions.applyStyle({
          value,
          ids: this.selection.selectedIds
        })
      )
    })
  }

  //метод селекта ячейки + уведомление о событии
  selectCell($cell) {
    this.selection.selectAny($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getCssStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(styles))
  }

  //метод-обертка ресайза
  async resizeTable(event) {
    try {
      //кладем результат промиса в data
      const data = await resizeHandler(this.$root, event)
      //уведомляем, о ресайзе table
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  //общий метод ресайза таблицы
  onMousedown(event) {
    //1)Как вариант мы получаем доступ до элемента по функции getAttribute(), которая подходит для всех случаев

    //2)А можно получать доступ до переменных data у DOM-элементов с помощью функции dataset. В нашем случае это data-resize
    if (shouldResize(event)) {
      this.resizeTable(event)
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
        this.selectCell($target)
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
      //перемещаем фокус на найденный элемент + делаем его выделенным а так же уведомляем  о событии
      this.selectCell($next)
    }
  }

  updateTextInStore(value) {
    this.$dispatch(
      actions.changeText({
        id: this.selection.current.getId(),
        value
      })
    )
  }

  //метод ввода в рамках таблицы.
  //Здесь при инициализации создаем уведомление на это событие для других слушателей(например для инстнса Formula)
  onInput(event) {
    //this.$emit('table:input', $(event.target))
    this.updateTextInStore($(event.target).text())
  }
}
