import { storage } from '../utils'

function toHtml(key) {
  const model = storage(key)
  const id = key.split(':')[1]
  return `
  <li class="db__record">
  <a href="#excel/${id}">${model.title}</a>
  <strong>
  ${new Date(model.openedDate).toLocaleDateString()}
  ${new Date(model.openedDate).toLocaleTimeString()}
  </strong>
  </li>`
}

//excel:id
function getAllDashes() {
  const keys = []
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)
    if (!key.includes('excel')) {
      continue
    }
    keys.push(key)
  }
  return keys
}

export function createDashboardPanel() {
  const keys = getAllDashes()

  if (!keys.length) {
    return `<p>Вы пока не создали ни одной таблицы</p>`
  }

  return `
  <div class="db__list-header">
        <span>Название</span>
        <span>Дата открытия</span>
      </div>

      <ul class="db__list">
      ${keys.map(toHtml).join('')}
      </ul>
  `
}
