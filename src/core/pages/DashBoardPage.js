import { $ } from '../dom'
import { Page } from '../Page'
import { createDashboardPanel } from './dashboard.functions'

export class DashBoardPage extends Page {
  getRoot() {
    const excelPageId = Date.now().toString()
    return $.create('div', 'db').html(`
    <div class="db__header">
      <h1>Excel Панель управления</h1>
    </div>

    <div class="db__new">
      <div class="db__view">
        <a href="#excel/${excelPageId}" class="db__create">
          Новая <br /> Таблица
        </a>
      </div>
    </div>

    <div class="db__table db__view">
    ${createDashboardPanel()}
    </div>
    `)
  }
}
