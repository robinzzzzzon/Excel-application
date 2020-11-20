import { ExcelComponent } from '@core/ExcelComponent'

export class Formula extends ExcelComponent {
  //т.к. у нас добавление слушателей реализовано в абстрактном родительском классе DomListener,
  //то необходимо прокидывать наверх помимо рута еще и список слушателей.
  //Для этого реализуем конструктор:
  constructor($root) {
    //типичный проброс параметров в родит. конструктор
    super($root, {
      name: 'Formula',
      listeners: ['input', 'click'],
    })
  }

  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__formula'

  //Переопределяем метод
  toHTML() {
    return `
      <div class="info">fx</div>
      <div class="input" contenteditable spellcheck="false"></div>
    `
  }

  //добавление input слушателя
  onInput(event) {
    console.log('Formula: onInput', event.target.textContent.trim())
  }

  //добавление click слушателя
  onClick(event) {
    console.log('Formula: onClick', event)
  }
}
