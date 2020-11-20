//класс активности ячеек таблицы
export class TableSelection {
  constructor() {
    this.group = []
  }

  //любая ячейка это всегда дом-элемент
  //Поэтому можем использовать dom-методы
  selectAny($el) {
    this.group.push($el)
    $el.addCssClass('selected')
  }

  //нужно реализовать
  selectGroup() {}
}
