import { EventEmitter } from 'events'
import Router from './router'

export default class Silent extends EventEmitter {
  constructor() {
    super()
    this.router = new Router()
  }

  $subsribe(event, ...middlewares) {
    this.router.register(event, middlewares)
    let listener = ctx => this.router.doRoute(event, ctx)
    this.removeAllListeners(event) && this.on(event, listener)
    return () => {
      this.router.unregister(event, middlewares)
      this.removeListener(event, listener)
    }
  }

  $listen(route, ...middlewares) {
    this.router.register(route, middlewares)
  }

  $dispatch(route, body={}) {
    this.router.route(route, { body })
  }

  $emit(event, payload) {
    this.emit(event, payload)
  }

}

Silent.mixin = o => {
  let silent = new Silent()
  console.warn(silent)
  o = Object.assign(o, silent)  
}