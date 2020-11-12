//класс-утилита для создания вспомогательных методов для работы с дом-элементами
class Dom {
  //т.к. инстанс класса Dom должен быть всегда с заданным селектором, то мы описываем соотв. конструктор:
  constructor (selector) {
    //делаем проверку через тернарник, что если подаваемый селектор - строка (например #app), то тогда ищем ноду с таким селектором.
    //если же это целая нода ,то присваиваем ее в контекст this.$el
    this.$el = typeof selector === 'string' 
    ? document.querySelector(selector)
    : selector
  }

  //объединенный по сути get/set метод по работе с html ноды.
  //говорим, если входной параметр html - строка, то присваиваем нашему $el этот html и возвращаем ноду.
  //return this нужен, для дальнейшего чейнинга.
  html(html) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html
      return this
    }

    //иначе, работаем как get, возвращая затримленный html ноды.
    return this.$el.outerHTML.trim()
  }

  //метод обнуления ноды
  clear() {
    this.html('')
    return this
  }

  //метод обертка добавления слушателя
  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback)
  }


  //метод добавления элементов.
  //проверяем, если при вызове, наша нода является инстансом класса Dom, то присваиваем node.$el т.к. это dom-элемент
  append(node) {
    if (node instanceof Dom) {
      node = node.$el
    }

    //иначе добавляем контексту объекта this переменную $el и кладем в нее ноду
    if (Element.prototype.append) {
      this.$el.append(node)
    } else {
      this.$el.appendChild(node)
    }

    //возвращаем контекст для чейна
    return this
  }
}

//функция создания инстанса класса.
//здесь мы на вход функции подаем некий селектор, который может быть либо строкой, либо готовой нодой.
//ну и соотв-нно возвращаем инстанс нашего класса
export function $(selector) {
  return new Dom(selector)
}

//переменная с анонимной функцией. Здесь мы создаем элемент по тагнейму, если указаны классы, то добавляем их и возвращаем элемент
$.create = (tagName, classes = '') => {
  const el = document.createElement(tagName)
  if (classes) {
    el.classList.add(classes)
  }
  //здесь оборачиваем создание нашего нового dom-элемента через создание инстанса $() чтобы сделать его объектом класса Dom
  return $(el)
}
