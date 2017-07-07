import mount from '../framework/route-mounter'

export default function mountRoutes(app) {

  mount('/order', require('./order').default)(app)
  

}