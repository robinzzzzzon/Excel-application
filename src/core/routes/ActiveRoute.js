//вспомогательный класс для получения хэш-path
export class ActiveRoute {
  //получаем путь без #
  static get path() {
    return window.location.hash.slice(1)
  }

  //получаем параметры path. сплитим по слэшу
  static get param() {
    return ActiveRoute.path.split('/')
  }

  static navigate(path) {
    window.location.hash = path
  }
}
