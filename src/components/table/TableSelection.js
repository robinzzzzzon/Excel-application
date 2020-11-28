//класс активности ячеек таблицы
export class TableSelection {
  static className = 'selected'

  constructor() {
    this.group = []
    this.current = null
  }

  //любая ячейка это всегда дом-элемент
  //Поэтому можем использовать dom-методы
  selectAny($el) {
    this.clear()
    $el.focus().addCssClass(TableSelection.className)
    this.group.push($el)
    this.current = $el
  }

  //приведение селективности ячеек к дефолтному значению
  clear() {
    this.group.forEach(($el) => {
      $el.removeCssClass(TableSelection.className)
    })
    this.group = []
  }

  //метод выделения группы активных ячеек
  selectGroup($group) {
    this.clear()
    this.group = $group
    this.group.forEach(($el) => $el.addCssClass(TableSelection.className))
  }
}
