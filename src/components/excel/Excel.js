import {$} from '@core/dom'

//класс реализации ExcelComponent.
export class Excel {
  //Задаем конструктор где говорим, создать элемент с указанным селектором и массивом компонентов.
  constructor(selector, options) {
    //создаем элемент через $() делая элементом класса Dom
    this.$el = $(selector)
    this.components = options.components || []
  }

  //Метод создания структуры компонентов
  getRoot() {
    //Создаем div с классом excel и возвращаем его
    const $root = $.create('div', 'excel')

    //проходим методом map по каждому классу Component и возвращаем его инстанс в переопределенный this.components
    this.components = this.components.map(Component => {
      
      //создаем div с указанием класснейма для каждой компоненты(на этоп этапе это класс а не его инстанс)
      const $el = $.create('div', Component.className)
      //теперь уже создаем инстанс класса и подаем на вход наш div с класснеймом
      const component = new Component($el) // <- вот здесь мы передаем на вход элемент для класса DOMListener. Это нужно для того, чтобы централизованно навешивать слушатели

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
  render() {
    //this.$el инстанса Excel-класса помещает в себя возвращаемый рут из this.getRoot()
    this.$el.append(this.getRoot())

    //проходим по уже переопределенному this.components и вызываем у каждого инстанса метод init()
    this.components.forEach(component => component.init())

//     setTimeout(() => {
//       this.components.forEach(component => component.destroy())
//        }, 20000)
   }
 }
