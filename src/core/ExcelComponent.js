import {DomListener} from '@core/DomListener'

//Абстрактный класс наследующийся от абстрактного Domlistener. 
//Здесь мы по сути только говорим, что у любого наследника должен быть метод toHTML()
export class ExcelComponent extends DomListener {

  //Здесь, мы уже принимаем на вход от дочерних классов options, 
  //а наверх в родительский пробрасываем только слушатели:
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
  }
  
  // Возвращает шаблон компонента. Здесь он родительский. Мы его объявляем а уже переопределяем в каждой компоненте отдельно.
  toHTML() {
    return ''
  }

  //для разделения зон ответственности по логике, 
  //мы добавляем обертку и будем использовать ее для инита слушателей
  init() {
    //просто переопределяем родительский метод класса DOMListener
    this.initDOMListeners()
  }
}
