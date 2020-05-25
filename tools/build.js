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
    output: 'dist/commonjs/browser.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/node.js',
    output: 'dist/commonjs/node.js',
    format: 'cjs',
  },
  {
    input: 'dist/src/browser.js',
    output: 'dist/esm/browser.js',
    format: 'es',
  },
  {
    input: 'dist/src/node.js',
    output: 'dist/esm/node.js',
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
                  corejs: 3,
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
        banner: `/*! Hyperapp Render v${pkg.version} | MIT Licence | https://github.com/kriasoft/hyperapp-render */\n`,
      })
    }),
  )

  // Create package.json for npm publishing
  await fs.outputJson(
    'dist/package.json',
    {
      ...pkg,
      private: undefined,
      devDependencies: undefined,
      scripts: undefined,
    },
    { spaces: 2 },
  )
  await fs.outputJson('dist/commonjs/package.json', { type: 'commonjs' }, { spaces: 2 })
  await fs.outputJson('dist/esm/package.json', { type: 'module' }, { spaces: 2 })
}

module.exports = build()
