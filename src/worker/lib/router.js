export default class doRoute {
  constructor() {
    this.routeMap = {}
  }

  register(route, middlewares) {
    middlewares.forEach(middleware => {
      if (typeof middleware !== 'function') {
        throw new Error(`Failed to subscribe a event, middlewares must be a function.`)
      }
      this.ensureRouteMapEvent(route)
      this.routeMap[route].push(middleware)
    })
  }

  doRoute(route, ctx) {
    let middlewares = null
    if (Array.isArray(route)) {
      middlewares = route
    } else {
      middlewares = this.routeMap[route]
    }
    function next(fns, ...args) {
      let fn = fns[0]
      if (!fn) {
        return
      }
      fn(ctx, (...args) => {
        next(fns.slice(1), args)
      })
    }
    middlewares && middlewares.length && next(middlewares)
  }

  route(route, ctx) {
    let handlers = null
    let req = { param: {}, query: {} }
    for (let j=0, len=Object.keys(this.routeMap).length; j<len; j++) {
      let parts1 = Object.keys(this.routeMap)[j].split('/').map(p => `/${p}`)
      let parts2 = route.split('/').map(p => `/${p}`)
      let matched = true
      for (let i=0, len=parts1.length; i<len; i++) {
        let part1 = parts1[i]
        let part2 = parts2[i]
        if (part1.match(/:/)) {
          req.param[part1.replace(/\/:/, '')] = part2.replace(/\//, '')
          continue
        }
        if (part1 !== part2) {
          matched = false
          break
        }
      }
      if (matched) {
        handlers = this.routeMap[Object.keys(this.routeMap)[j]]
        break
      }
    }
    ctx.req = req
    this.doRoute(handlers, ctx)
  }

  unregister(route, middlewares) {
    if (!this.routeMap[route]) {
      return
    }
    middlewares.map(middleware => {
      this.routeMap[route] = this.routeMap[route].filter(m => m != middleware)
    })
  }

  ensureRouteMapEvent(route) {
    if (!this.routeMap[route]){
      this.routeMap[route] = []
    } 
  }
}