import { ExcelComponent } from '@core/ExcelComponent'

//класс расширяющий excelComponent, функциональностью стейта
export class ExcelStateComponent extends ExcelComponent {
  constructor(...args) {
    //просто прокидываем в родитель все аргументы
    super(...args)
  }

  //получаем шаблон стейта
  get template() {
    return JSON.stringify(this.state, null, 2)
  }

  //получение начального стейта
  initState(initialState = {}) {
    this.state = { ...initialState }
  }

  //изменение стейта
  setState(newState) {
    //складываем текущий стейт и новый в this.state
    this.state = { ...this.state, ...newState }

    //рендерим полученный шаблон(с учетом newState)
    this.$root.html(this.template)
  }
}
