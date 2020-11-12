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
      //здесь, мы обращаемся к root каждого инстанса 
      //и т.к. инстанс любой компоненты является имплементацией $класса Dom, то ему доступен метод-обертка on(),
      //в который уже мы передаем наш тип слушателя и сформированный methodName, 
      //который насильно привязываем при помощи bind() для избежания потери контекста.
      //запись this[methodName].bind(this) по сути это как пример: formula.onSubmit()
      this.$root.on(listener, this[methodName].bind(this))
    })
  }

  //базовая реализация удаления слушателей
  removeDOMListeners() {
    //нужно реализовать
  }
}

//общий метод окончательного формирования однотипного наименования функции
function getMethodName(eventName) {
  return 'on' + capitalize(eventName)
}
