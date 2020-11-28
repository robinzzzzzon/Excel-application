import { DomListener } from '@core/DomListener'

//Абстрактный класс наследующийся от абстрактного Domlistener.
//Здесь мы по сути только говорим, что у любого наследника должен быть метод toHTML()
export class ExcelComponent extends DomListener {
  //Здесь, мы уже принимаем на вход от дочерних классов options,
  //а наверх в родительский пробрасываем только слушатели:
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.emitter = options.emitter
    this.unsubscribers = []

    //здесь, мы вызываем метод а реализацию уже опишем в дочерних классах
    this.prepare()
  }

  // Возвращает шаблон компонента. Здесь он родительский. Мы его объявляем а уже переопределяем в каждой компоненте отдельно.
  toHTML() {
    return ''
  }

  //метод-шаблон для дочерних классов ,чтобы можно было лучше декомпозировать логику
  prepare() {}

  //уведомляем слушателей про события event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args)
  }

  //подписываемся на события
  $on(event, fn) {
    const subscr = this.emitter.subscribe(event, fn)
    this.unsubscribers.push(subscr)
  }

  //для разделения зон ответственности по логике,
  //мы добавляем обертку и будем использовать ее для инита слушателей
  init() {
    //просто переопределяем родительский метод класса DOMListener
    this.initDOMListeners()
  }

  //метод удаления слушателей и удаления подписок
  destroy() {
    this.removeDOMListeners()
    this.unsubscribers.forEach((subscr) => subscr())
  }
}
