import { $ } from '../dom.js'
import { ActiveRoute } from './ActiveRoute'

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is not provided in router')
    }

    //создаем рутовый элемент
    this.$placeholder = $(selector)
    //получаем конфиги роутов
    this.routes = routes
    //декларируем this.page
    this.page = null

    //насильно привязываем контекст this к указанному методу заранее. Изначально.
    this.changePageHandler = this.changePageHandler.bind(this)

    //наконец инициализируем наши пэйджи
    this.init()
  }

  //вешаем слушатель hashchange и вешаем колбэк changePageHandler
  init() {
    window.addEventListener('hashchange', this.changePageHandler)
    this.changePageHandler()
  }

  //реализация роутинга:
  changePageHandler() {
    //здесь, мы говорим если на момент вызова наш this.page != null,
    //то вызываем destroy
    if (this.page) {
      this.page.destroy()
    }
    //далее всегда чистим рут-элемент
    this.$placeholder.clear()

    //просто описание того, что нужно отрендерить,
    //используя вспомогательные методы класса ActiveRoute
    const Page = ActiveRoute.path.includes('excel')
      ? this.routes.excel
      : this.routes.dashboard

    this.page = new Page(ActiveRoute.param)

    //после того, как мы смогли определить, что содержится в урле,
    //рендерим страницу вызывая getRoot() с реализацией для каждой страницы
    this.$placeholder.append(this.page.getRoot())

    //активируем хук с init для excel страницы, который вешает слушатели после рендеринга
    this.page.afterRender()
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler)
  }
}
