import { $ } from '@core/dom'

//функция ресайза таблицы
export function resizeHandler($root, event) {
  //возвращаем результат функции через промис
  return new Promise((resolve) => {
    //оборачиваем получение ресайз-элемента как инстанс-Dom, для более удобной работы.
    const $resizer = $(event.target)

    //Получаем с помощью метода get data у объекта Dom, данные элемента
    const type = $resizer.data.resize

    //Здесь задаем тернарник по значению и далее уже его передаем в setCssStyles:
    const sideProp = type === 'col' ? 'bottom' : 'right'

    //метод-обертка dom.js. Задаем стили при начале движения ползунка
    $resizer.setCssStyles({
      opacity: 1,
      [sideProp]: '-5000px'
    })

    //для доступа в разных блоках выносим value
    let value

    // const $parent = $resizer.$el.parentNode //Плохая практика т.к. мы привязываемся к любому родитеклю без уточнения, а ведь структура DOM-дерева может меняться
    // const $parent = $resizer.$el.closest('.column') //Уже лучше т.к. теперь мы ссылаемся на ближайшего родителя по названию класса, но это все равно не круто т.к. класс используется для css и он может меняться
    const $parent = $resizer.closest('[data-type="resizable"]') //а вто это гуд т.к. мы добавили поиск по отдельной data-type

    //получаем координаты родителя(т.к. по факту будут меняться координаты колонки)
    const parentCoords = $parent.getCordinate()

    //эта запись здесь просто как более удобный пример подключения слушателей
    //Иначе пришлось бы создавать отдельные методы и подключать слушатели по общей схеме
    document.onmousemove = (ev) => {
      if (type === 'col') {
        //вычисляем дэльту по оси X:
        const delta = ev.pageX - parentCoords.right
        //вычисляем текущее значение ширины элемента с учетом сдвига в любую из сторон
        value = parentCoords.width + delta
        //присваиваем css-стилю ресайзера полученное значение
        $resizer.setCssStyles({ right: -delta + 'px' })
      } else if (type === 'row') {
        //вычисляем дэльту по оси Y:
        const delta = ev.pageY - parentCoords.bottom
        //вычисляем текущее значение высоты элемента с учетом сдвига в любую из сторон
        value = parentCoords.height + delta
        //присваиваем css-стилю ресайзера полученное значение
        $resizer.setCssStyles({ bottom: -delta + 'px' })
      }
    }
    //здесь говорим, что если выполняется onmouseup, то нужно зануллить onmousemove и onmouseup
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null

      //наконец когда занулили слушатели, задаем окончательные css-показатели нашим элементам:
      if (type === 'col') {
        //задаем ширину для колонки
        $parent.setCssStyles({ width: value + 'px' })
        //находим все элементы на странице с таким же data-col как у колонки и присваиваем им те же показатели ширины
        $root.findAll(`[data-col="${$parent.data.col}"]`).forEach((el) => {
          el.style.width = value + 'px'
        })
      } else {
        //ну и если это строки, то просто задаем новое значение высоте строки
        $parent.setCssStyles({ height: value + 'px' })
      }

      resolve({
        //передаем value пикселей
        value,
        type,
        //ну и в зависимости от resizerType передаем id
        id: $parent.data[type]
      })

      //для ресайзера возвращаем исходное положение относительно родителя
      $resizer.setCssStyles({
        opacity: 0,
        bottom: 0,
        right: 0
      })
    }
  })
}
