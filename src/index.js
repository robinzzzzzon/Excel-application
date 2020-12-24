import './scss/index.scss'
import { Router } from './routes/Router'
import { DashBoardPage } from './pages/DashBoardPage'
import { ExcelPage } from './pages/ExcelPage'

//Создаем страницы теперь через инстанс класса Router
new Router('#app', {
  dashboard: DashBoardPage,
  excel: ExcelPage
})
