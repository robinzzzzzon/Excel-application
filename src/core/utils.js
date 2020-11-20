//обезличенная функция формирования methodName
export function capitalize(listenerName) {
  if (typeof listenerName !== 'string') {
    return ''
  }

  return listenerName.charAt(0).toUpperCase() + listenerName.slice(1)
}
