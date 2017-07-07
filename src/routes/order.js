import mount, { Router } from '../framework/route-mounter'
import { logger } from '../middlewares'
import context from '../app/context'

export default function Api(router) {

  router.use(logger)

  // router.post('/', )

  router.get('/', context.controllers.orderController.order)

  return router 
}