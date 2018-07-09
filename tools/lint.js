process.on('unhandledRejection', (error) => {
  throw error
})

const cp = require('child_process')

function spawn(command, args) {
  return new Promise((resolve, reject) => {
    cp.spawn(command, args, { stdio: 'inherit' }).on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(code)
      }
    })
  })
}

async function lint() {
  const fix = process.argv.includes('--fix')
  const eslintOptions = fix ? '--fix' : ''
  const prettierOptions = fix ? '--write' : '--list-different'
  await spawn('eslint', [eslintOptions, '{benchmark,src,test,tools}/**/*.js'])
  await spawn('prettier', [prettierOptions, '{benchmark,src,test,tools}/**/*.{js,ts,tsx,md}'])
}

module.exports = module.parent ? lint : lint().catch(process.exit)
