import { $ } from '@core/dom'
import { Emitter } from '@core/Emitter'
import { StoreSubscriber } from '../../core/StoreSubscriber'
import { updateDate } from '../../redux/actions'

//класс реализации ExcelComponent.
export class Excel {
  //Задаем конструктор где говорим, создать элемент с указанным селектором и массивом компонентов.
  constructor(options) {
    //создаем элемент через $() делая элементом класса Dom
    this.components = options.components || []
    this.store = options.store
    this.emitter = new Emitter()
    this.subscriber = new StoreSubscriber(this.store)
  }

  //Метод создания структуры компонентов
  getRoot() {
    //Создаем div с классом excel и возвращаем его
    const $root = $.create('div', 'excel')

    //при создании инстанса каждой компоненты на вход подаем инстанс эмиттера и стора
    const componentOptions = {
      emitter: this.emitter,
      store: this.store
    }

    //проходим методом map по каждому классу Component и возвращаем его инстанс в переопределенный this.components
    this.components = this.components.map((Component) => {
      //создаем div с указанием класснейма для каждой компоненты(на этоп этапе это класс а не его инстанс)
      const $el = $.create('div', Component.className)
      //теперь уже создаем инстанс класса и подаем на вход наш div с класснеймом
      const component = new Component($el, componentOptions) // <- вот здесь мы передаем на вход элемент для класса DOMListener. Это нужно для того, чтобы централизованно навешивать слушатели

      //подаем на вход нашей ноде чере dom-метод html() возвращаемый html инстанса каждого из классов компоненты
      $el.html(component.toHTML())

      //помещаем в $root наши элементы
      $root.append($el)

      //возвращаем компоненту
      return component
    })

    //Наконец возвращаем рут со всем содержимым
    return $root
  }

  //Метод рендеринга
  init() {
    this.store.dispatch(updateDate())
    this.subscriber.subscribeComponents(this.components)

    //проходим по уже переопределенному this.components и вызываем у каждого инстанса метод init()
    this.components.forEach((component) => component.init())
  }

  destroy() {
    this.subscriber.unsubscribeComponents()
    this.components.forEach((component) => component.destroy())
  }
}
