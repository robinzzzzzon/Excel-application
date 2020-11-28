export class Emitter {
  constructor() {
    this.listeners = {}
  }

  //метод так же можно назвать dispatch, fire, trigger
  //метод позволяет уведомлять по подписке
  emit(eventName, ...args) {
    if (!Array.isArray(this.listeners[eventName])) {
      return false
    }
    this.listeners[eventName].forEach((listener) => {
      listener(...args)
    })
    return true
  }

  //метод так же можно назвать on, listen
  //метод подписки на уведомления по событию
  subscribe(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(fn)
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== fn
      )
    }
  }
}

// const emitter = new Emitter()

// emitter.subscribe('IvanEvent', (data) => console.log('Subscribe name:', data))
// emitter.emit('IvanEvent', 42)
