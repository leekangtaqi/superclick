import { spawn } from 'child_process'
import path from 'path'

export default async function registerDoctor(ctx, next) {
  let { body } = ctx
  let { telephone } = body
  // do validate
  let childProcess = spawn('node', ['register-doctor.js'], 
    { 
      cwd: path.join(__dirname, './tasks'), 
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'] 
    })

  childProcess.on('message', ({ type }) => {
    if (type === 'shake') {
      childProcess.send({type: 'init', payload: Object.assign(body, { worker: body.worker.worker })})
    }
  })

  ctx.body.worker = {
    worker: ctx.body.worker,
    target: childProcess
  }
  next()
}