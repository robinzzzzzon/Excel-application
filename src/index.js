import { Excel } from '@/components/excel/Excel'
import { Header } from '@/components/header/Header'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { Formula } from '@/components/formula/Formula'
import { Table } from '@/components/table/Table'
import './scss/index.scss'
import { createStore } from './core/createStore'
import { rootReducer } from './redux/rootReducer'
import { initialState } from './redux/initialState'
import { debounce, storage } from './core/utils'

//вместе с инитом самого excel, мы создаем стор
const store = createStore(rootReducer, initialState)

const stateListener = debounce((state) => {
  console.log('App State: ', state)
  storage('excel-state', state)
}, 500)

//сразу создаем подписку на excel-state
store.subscribe(stateListener)

//передаем store на вход инстанса excel
const excel = new Excel('#app', {
  components: [Header, Toolbar, Formula, Table],
  store
})

excel.render()
