import Koa from 'koa'
// import ampq from 'ampq'
import Silent from './lib/Silent'
import message from './message'
import WorkersManager from './workers-manager'
import redisMainCreator from '../app/redis'
import Ar from '../framework/allready'

export const app = new Koa()

const ar = new Ar()
const redis = redisMainCreator()
const { PLACE_REQUEST, TERMINATE_REQUEST, COMPLETE_RESPONSE } = message

ar.add('redis', ar.redis(redis))

app.redis = redis
app.emitter = new Silent()
app.workersManager = new WorkersManager(100, app)

ar.ready(() => {
  app.listen(3030, async () => {

    app.emitter.$subsribe(COMPLETE_RESPONSE, async () => {
      console.warn('complete response ....')
    })

    app.emitter.$subsribe(PLACE_REQUEST,
      async (ctx, next) => {
        try {
          let worker = await app.workersManager.spawn(ctx)
          await worker.doSchedule(ctx)
          next()
        } catch(e) {
          throw e
        }
      }, 
      async (ctx, next) => {
        // ack request
        console.warn('ack!')
        next()
      }
    )

    /**
     * @param type {String}
     * @param payload {Object}
     *    @param intention {String}
     *    @param date {String}
     */
    app.emitter.$emit(PLACE_REQUEST, {
      intention: 'register-doctor',
      date: '2017-5-12 20:10',
      telephone: '15210383276',
      username: 'leekangtaqi',
      orderId: 1111
    })
  })
})
