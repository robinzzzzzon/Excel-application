import { createToolbar } from './toolbar.template'
import { $ } from '@core/dom.js'
import { defaultStyles } from '@core/costants.js'
import { ExcelStateComponent } from '../../core/ExcelStateComponent'

export class Toolbar extends ExcelStateComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__toolbar'

  constructor($root, options) {
    super($root, {
      name: 'Toolbar',
      listeners: ['click'],
      subscribe: ['currentStyles'],
      ...options
    })
  }

  prepare() {
    this.initState({ defaultStyles })
  }

  get template() {
    return createToolbar(this.state)
  }

  //Переопределяем метод
  toHTML() {
    return this.template
  }

  storeChanged(changes) {
    this.setState(changes.currentStyles)
  }

  onClick(event) {
    //получаем таргет
    const $target = $(event.target)
    if ($target.data.type === 'button') {
      //получаем value у button
      const value = JSON.parse($target.data.value)
      //уведомляем о новом состоянии
      this.$emit('toolbar:applyStyle', value)

      //Тут непонятно ,Нужно это или нет
      //получаем key из объекта value
      const key = Object.keys(value)[0]
      //задаем новое значение value[key]
      this.setState({ [key]: value[key] })
    }
  }
}
