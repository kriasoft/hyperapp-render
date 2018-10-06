const fs = require('fs-extra')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const { uglify } = require('rollup-plugin-uglify')
const pkg = require('../package.json')

// The source files to be compiled by Rollup
const files = [
  {
    input: 'dist/src/browser.js',
    output: 'dist/hyperapp-render.js',
    format: 'umd',
    name: 'hyperappRender',
  },
  {
    input: 'dist/src/browser.js',
    output: 'dist/hyperapp-render.min.js',
    format: 'umd',
    name: 'hyperappRender',
  },
  {
    input: 'dist/src/browser.js',
    output: 'dist/browser/index.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/browser.js',
    output: 'dist/browser/module.js',
    format: 'es',
  },
  {
    input: 'dist/src/node.js',
    output: 'dist/node/index.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/node.js',
    output: 'dist/node/module.js',
    format: 'es',
  },
]

async function build() {
  // Clean up the output directory
  await fs.emptyDir('dist')

  // Copy source code, readme and license
  await fs.copy('src', 'dist/src')
  await fs.copy('README.md', 'dist/README.md')
  await fs.copy('LICENSE.md', 'dist/LICENSE.md')

  // Compile source code into a distributable format with Babel
  await Promise.all(
    files.map(async (file) => {
      const bundle = await rollup.rollup({
        input: file.input,
        external: ['stream'],
        plugins: [
          babel({
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  loose: true,
                  useBuiltIns: 'entry',
                  exclude: ['transform-typeof-symbol'],
                },
              ],
            ],
            comments: false,
          }),
          ...(file.output.endsWith('.min.js') ? [uglify({ output: { comments: '/^!/' } })] : []),
        ],
      })

      bundle.write({
        file: file.output,
        format: file.format,
        sourcemap: true,
        exports: 'named',
        name: file.name,
        banner:
          '/*! Hyperapp Render | MIT Licence | https://github.com/kriasoft/hyperapp-render */\n',
      })
    }),
  )

  // Create package.json for npm publishing
  const libPkg = Object.assign({}, pkg)
  delete libPkg.private
  delete libPkg.devDependencies
  delete libPkg.scripts
  await fs.outputJson('dist/package.json', libPkg, { spaces: 2 })

  // Create browser/package.json for convenient import
  await fs.outputJson(
    'dist/browser/package.json',
    {
      private: true,
      name: 'browser',
      version: pkg.version,
      main: 'index.js',
      module: 'module.js',
      typings: '../src/browser.d.ts',
      esnext: '../src/browser.js',
    },
    { spaces: 2 },
  )

  // Create node/package.json for convenient import
  await fs.outputJson(
    'dist/node/package.json',
    {
      private: true,
      name: 'node',
      version: pkg.version,
      main: 'index.js',
      module: 'module.js',
      typings: '../src/node.d.ts',
      esnext: '../src/node.js',
    },
    { spaces: 2 },
  )
}

module.exports = build()
