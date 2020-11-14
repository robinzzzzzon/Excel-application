import { capitalize } from "./utils"

//абстрактный класс для добавления слушателей дом-элементам
export class DomListener {

  //говорим, что для любого слушателя должен быть задан root-элемент + указаны слушатели.
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error(`No $root provided for DomListener!`)
    }
    //присваиваем рут инстансу создаваемого класса
    this.$root = $root
    //получаем доступ до проброшенных слушателей от дочерних классов
    this.listeners = listeners
  }

  //базовая реализация добавления слушателей
  initDOMListeners() {

    //проходимся по списку слушателей контекста this(корневой элемент каждого инстанса)
    this.listeners.forEach(listener => {
      //говорим, создать переменную с названием метода, 
      //который будем вызывать исходя из описания каждого класса компоненты.
      //в нашем случае, название метода формирует pure function из utils.js
      const methodName = getMethodName(listener)

      //если полученный methodName не найден в классе компоненты, то выбрасываем ошибку с описанием
      if(!this[methodName]) {
        throw new Error (`Method ${methodName} is not implemented in ${this.name}`)
      }

      //для того, чтобы methodName передавался вместе с контекстом, 
      //мы можем переопределить methodName, насильно привязав ему контекст
      this[methodName] = this[methodName].bind(this)

      //здесь, мы обращаемся к root каждого инстанса 
      //и т.к. инстанс любой компоненты является имплементацией $класса Dom, то ему доступен метод-обертка on(),
      //в который уже мы передаем наш тип слушателя и сформированный methodName, 
      //запись this[methodName] по сути это как пример: formula.onSubmit()
      this.$root.on(listener, this[methodName])
    })
  }

  //базовая реализация удаления слушателей
  removeDOMListeners() {

    this.listeners.forEach(listener => {

      const methodName = getMethodName(listener)

      this.$root.off(listener, this[methodName])
    })
  }
}

//общий метод окончательного формирования однотипного наименования функции
function getMethodName(eventName) {
  return 'on' + capitalize(eventName)
}
