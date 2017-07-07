import WorkerFactory from './worker'
import R from 'ramda'

const genKey = () => `ori:${config.ip}`
const project = ['capacity', 'occupied', 'origin']

export default class WorkersManager {
  constructor(capacity = 10, app) {
    this.app = app
    this.capacity = capacity
    this.workers = []
    this.workerFactory = new WorkerFactory()
    this.occupied = 0
  }

  async save() {
    this.occupied = this.workers.length
    await this.app.redis.hmsetAsync(genKey(config.ip), this.plain())
  }

  plain() {
    let project = ['capacity', 'occupied', 'origin']
    return R.pick(project, this)
  }

  async noIdleWorker() {
    return this.workers.length > this.capacity
  }

  async getWorker(id) {
    return await this.workerFactory.getWorker(id)
  }

  async removeWorker(id) {
    this.workers = this.workers.filter(w => w.id === id)
    return await this.workerFactory.removeWorker(id)
  }

  async spawn(data) {
    if (await this.noIdleWorker()) {
      throw new Error(`Failed to spawn a worker, [code] = no idle worker.`)
    }
    const worker = await this.workerFactory.getInstance(data)
    
    this.workers.push(worker)
    return worker
  }
}