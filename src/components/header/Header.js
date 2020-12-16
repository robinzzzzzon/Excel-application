import { ExcelComponent } from '@core/ExcelComponent'
import { defaultTitle } from '../../core/costants'
import { changeTitle } from '../../redux/actions'
import { $ } from '@core/dom.js'
import { debounce } from '../../core/utils'

export class Header extends ExcelComponent {
  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input'],
      ...options
    })
  }

  prepare() {
    this.onInput = debounce(this.onInput, 500)
  }

  //Переопределяем метод
  toHTML() {
    const title = this.store.getState().title || defaultTitle
    return `
      <input type="text" class="input" value="${title}" />

      <div>

        <div class="button">
          <i class="material-icons">delete</i>
        </div>

        <div class="button">
          <i class="material-icons">exit_to_app</i>
        </div>

      </div>
    `
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeTitle($target.text()))
  }
}
