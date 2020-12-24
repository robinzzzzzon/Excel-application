import { Excel } from '@/components/excel/Excel'
import { Header } from '@/components/header/Header'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { Formula } from '@/components/formula/Formula'
import { Table } from '@/components/table/Table'
import { createStore } from '@core/createStore'
import { rootReducer } from '../../redux/rootReducer'
import { normalizeInitialState } from '../../redux/initialState'
import { debounce, storage } from '@core/utils'
import { Page } from '../Page'

function storageName(param) {
  return 'excel:' + param
}

export class ExcelPage extends Page {
  getRoot() {
    const params = this.params ? this.params : Date.now().toString()

    //вместе с инитом самого excel, мы создаем стор
    const state = storage(storageName(params))
    const initialState = normalizeInitialState(state)
    const store = createStore(rootReducer, initialState)

    const stateListener = debounce((state) => {
      console.log('App State: ', state)
      storage(storageName(params), state)
    }, 500)

    //сразу создаем подписку на excel-state
    store.subscribe(stateListener)

    //передаем store на вход инстанса excel
    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store
    })

    return this.excel.getRoot()
  }

  afterRender() {
    this.excel.init()
  }

  destroy() {
    this.excel.destroy()
  }
}
