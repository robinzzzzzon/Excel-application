import './scss/index.scss'
import { Router } from './core/routes/Router'
import { DashBoardPage } from './core/pages/DashBoardPage'
import { ExcelPage } from './core/pages/ExcelPage'

//Создаем страницы теперь через инстанс класса Router
new Router('#app', {
  dashboard: DashBoardPage,
  excel: ExcelPage
})
