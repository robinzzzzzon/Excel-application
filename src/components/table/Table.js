import {ExcelComponent} from '@core/ExcelComponent'
import { createTable } from './table.template'

export class Table extends ExcelComponent {

  //Сразу присваиваем класс по умолчанию в виде статической переменной:
  static className = 'excel__table'

  //Переопределяем метод
  toHTML() {
    return createTable(30)
  } 
}
