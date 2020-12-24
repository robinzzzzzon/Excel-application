//функция формирования methodName
export function capitalize(listenerName) {
  if (typeof listenerName !== 'string') {
    return ''
  }

  return listenerName.charAt(0).toUpperCase() + listenerName.slice(1)
}

//функция подсчета длины массива
export function range(start, end) {
  if (start > end) {
    ;[end, start] = [start, end]
  }
  return new Array(end - start + 1).fill('').map((_, index) => {
    return start + index
  })
}

//get/set записи в localstorage data от state
export function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(data))
}

//функция сравнения 2х переменных
export function isEqual(a, b) {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  return a === b
}

export function camelToDashCase(str) {
  return str.replace(/([A-Z])/g, (g) => `${g[0].toLowerCase()}`)
}

export function toInlineStyles(styles = {}) {
  return Object.keys(styles)
    .map((key) => `${camelToDashCase(key)}: ${styles[key]}`)
    .join(';')
}

export function debounce(fn, wait) {
  let timeout
  return function (...args) {
    const later = () => {
      clearTimeout(timeout)
      fn.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
