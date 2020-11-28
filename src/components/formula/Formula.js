import { ExcelComponent } from '@core/ExcelComponent'
import { $ } from '@core/dom.js'

export class Formula extends ExcelComponent {
  //т.к. у нас добавление слушателей реализовано в абстрактном родительском классе DomListener,
  //то необходимо прокидывать наверх помимо рута еще и список слушателей.
  //Для этого реализуем конструктор:
  constructor($root, options) {
    //типичный проброс параметров в родит. конструктор
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      ...options
    })
  }

  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__formula'

  //Переопределяем метод
  toHTML() {
    return `
      <div class="info">fx</div>
      <div id="formula" class="input" contenteditable spellcheck="false"></div>
    `
  }

  //инициализация компонента формулы
  init() {
    super.init()

    this.$formula = this.$root.find('#formula')

    //подписываемся на событие селекта ячейки в таблице и получаем ее текст
    this.$on('table:select', ($cell) => {
      this.$formula.text($cell.text())
    })

    //подписываемся на событие ввода в ячейке и получаем текст
    this.$on('table:input', ($cell) => {
      this.$formula.text($cell.text())
    })
  }

  //добавление input слушателя
  onInput(event) {
    this.$emit('formula:input', $(event.target).text())
  }

  //метод в которой если срабатывает event.key = Tab/Enter,
  //то отменяем дефолтное поведение и уведомляем о событии formula:done
  onKeydown(event) {
    const keys = ['Enter', 'Tab']
    if (keys.includes(event.key)) {
      event.preventDefault()

      this.$emit('formula:done')
    }
  }

  //   //добавление click слушателя
  //   onClick(event) {
  //     console.log('Formula: onClick', event)
  //   }
}
