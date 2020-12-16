import { ExcelComponent } from '@core/ExcelComponent'
import { $ } from '@core/dom.js'

export class Formula extends ExcelComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__formula'

  //т.к. у нас добавление слушателей реализовано в абстрактном родительском классе DomListener,
  //то необходимо прокидывать наверх помимо рута еще и список слушателей.
  //Для этого реализуем конструктор:
  constructor($root, options) {
    //типичный проброс параметров в родит. конструктор
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options
    })
  }

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

    //подписываемся на событие селекта ячейки в таблице и получаем ее значение
    this.$on('table:select', ($cell) => {
      this.$formula.text($cell.data.value)
    })
  }

  storeChanged({ currentText }) {
    this.$formula.text(currentText)
  }

  //добавление input слушателя
  onInput(event) {
    const text = $(event.target).text()
    this.$emit('formula:input', text)
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
}
