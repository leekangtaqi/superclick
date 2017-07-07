import { app } from '../app'
import message from '../message'

class Monitor {

  add({ body }, next) {
    
    let { worker } = body
    let { target } = worker
    
    target.on('message', ({type, payload}) => {
      if (type === 'heart-beat') {
        worker.isAlive = true
        this.checkHeartbeat(worker, target)
      }
    })

    target.on('disconnect', () => {
      // console.warn('disconnect ********', xx)
    })

    target.on('exit', state => {
      this.exit(worker)
    })

    target.on('error', () => {
      // console.warn('error ********', xx)
    })

    worker.isAlive = false
    this.checkHeartbeat(worker, target)

    next()
  }

  async checkHeartbeat(worker, target) {
    let timeout = setTimeout(async () => {
      clearTimeout(timeout)
      if (!worker.isAlive) {
        target.kill()
        await this.kill(worker)
      }
      worker.isAlive = false
    }, 2000)
  }

  async exit(worker) {
    await app.workersManager.removeWorker(worker.worker.id)
    app.emitter.$emit(message.COMPLETE_RESPONSE, worker.worker.plain())
  }

  async kill(worker) {
    await app.workersManager.removeWorker(worker.worker.id)
    app.emitter.$emit(message.ABORT_RESPONSE, worker.worker.plain())
  }
}





export default new Monitor()