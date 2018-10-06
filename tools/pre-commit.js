const lint = require('./lint')
const test = require('./test')

async function preCommit() {
  await lint()
  await test()
}

module.exports = preCommit().catch(process.exit)
