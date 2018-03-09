process.on('unhandledRejection', (error) => {
  throw error
})

const cp = require('child_process')

function spawn(command, args) {
  return new Promise((resolve, reject) => {
    cp.spawn(command, args, { stdio: ['ignore', 'inherit', 'inherit'] }).on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Exit with code ${code} from "${command} ${args.join(' ')}"`))
      }
    })
  })
}

async function precommit() {
  await spawn('npm', ['run', '--silent', 'lint'])
  await spawn('npm', ['run', '--silent', 'test'])
}

module.exports = precommit()
