process.on('unhandledRejection', (error) => {
  throw error
})

const lint = require('./lint')
const test = require('./test')

async function precommit() {
  await lint()
  await test()
}

module.exports = precommit().catch(process.exit)
