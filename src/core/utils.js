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
