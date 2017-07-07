import schedule from 'node-schedule'
import Silent from './lib/silent'
import { EventEmitter } from 'events'
import services from './services'
import monitor from './services/monitor'
import { app } from './app'
import uuidV4 from 'uuid/v4'
import R from 'ramda'
import config from './config'

const genKey = k => `ori:${config.ip}:wkr${k}`
const project = ['id', 'status', 'origin']

export default class WorkerFactory {
  constructor(capacity = 10) {
    this.capacity = capacity
    this.workers = []
  }

  async getInstance(data) {
    let worker = new Worker()
    worker.id = 111
    worker.origin = config.ip
    worker.order = data.orderId
    await this.updateWorker(worker)
    return worker
  }

  async updateWorker(worker) {
    await app.redis.hmsetAsync(genKey(worker.id), worker.plain())
  }

  async getWorker(id) {
    return await app.redis.hgetallAsync(genKey(id))
  }

  async removeWorker(id) {
    return await app.redis.delAsync(genKey(id))
  }

}

const IDLE = 'IDLE'
const SCHEDULE = 'SCHEDULE'
const IN_SERVICE = 'IN_SERVICE'
const ABNORMAL = 'ABNORMAL'

class Worker extends Silent {
  constructor() {
    super()
    this.status = IDLE
    this.$listen('rush-concert', services.spikeKindergarten)
    this.$listen('register-doctor', 
      (ctx, next) => { ctx.body.worker = this; next() },
      services.registerDoctor,
      monitor.add.bind(monitor)
    )
  }

  async save() {
    await app.redis.hmsetAsync(genKey(this.id), this.plain())
  }

  plain() {
    return R.pick(project, this)
  }

  async doSchedule(ctx) {
    let { intention, date } = ctx
    if (!date) {
      throw new Error(`Failed to do schedule, [code]=expected a date`)
    }
    let dt = null
    try {
      dt = new Date(...date.split('-'))
    } catch(e) {
      throw new Error(`Failed to do schedule, [code]=date invalid`)
    }
    this.$dispatch(intention, ctx)
    // console.warn(intention)
    // schedule.scheduleJob(dt, )
    this.status = SCHEDULE
    await this.save()
  }
}