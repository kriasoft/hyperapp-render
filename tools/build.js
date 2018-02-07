process.on('unhandledRejection', (error) => {
  throw error
})

const fs = require('fs-extra')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const pkg = require('../package.json')

// The source files to be compiled by Rollup
const files = [
  {
    input: 'dist/src/index.js',
    output: 'dist/index.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/index.js',
    output: 'dist/module.js',
    format: 'es',
  },
  {
    input: 'dist/src/index.js',
    output: 'dist/hyperapp-render.js',
    format: 'umd',
    name: 'self',
    extend: true,
  },
  {
    input: 'dist/src/index.js',
    output: 'dist/hyperapp-render.min.js',
    format: 'umd',
    name: 'self',
    extend: true,
  },
  {
    input: 'dist/src/server.js',
    output: 'dist/server/index.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/server.js',
    output: 'dist/server/module.js',
    format: 'es',
  },
]

async function run() {
  // Clean up the output directory
  await fs.emptyDir('dist')

  // Copy source code, readme and license
  await Promise.all([
    fs.copy('src', 'dist/src'),
    fs.copy('README.md', 'dist/README.md'),
    fs.copy('LICENSE.txt', 'dist/LICENSE.txt'),
  ])

  // Compile source code into a distributable format with Babel
  await Promise.all(
    files.map(async (file) => {
      const bundle = await rollup.rollup({
        input: file.input,
        external: ['stream'],
        plugins: [
          babel({
            babelrc: false,
            presets: [['@babel/preset-env', { modules: false }]],
            comments: false,
          }),
          ...(file.output.endsWith('.min.js') ? [uglify({ output: { comments: '/^!/' } })] : []),
        ],
      })

      bundle.write({
        file: file.output,
        format: file.format,
        extend: file.extend,
        sourcemap: true,
        exports: 'named',
        name: file.name,
        banner:
          '/*! Hyperapp Render | MIT License | https://github.com/frenzzy/hyperapp-render */\n',
      })
    }),
  )

  // Create package.json for npm publishing
  const libPkg = Object.assign({}, pkg)
  delete libPkg.private
  delete libPkg.devDependencies
  delete libPkg.scripts
  await fs.outputJson('dist/package.json', libPkg, { spaces: 2 })

  // Create server/package.json for convenient import
  const serverPkg = Object.assign({}, pkg, {
    name: 'server',
    esnext: '../src/server.js',
  })
  delete serverPkg.devDependencies
  delete serverPkg.scripts
  await fs.outputJson('dist/server/package.json', serverPkg, { spaces: 2 })
}

module.exports = run()
