# <img height="24" src="https://cdn.rawgit.com/hyperapp/render/master/logo.svg"> Hyperapp Render

[![npm version](https://img.shields.io/npm/v/@hyperapp/render.svg?maxAge=3600)](https://www.npmjs.com/package/@hyperapp/render)
[![npm downloads](https://img.shields.io/npm/dm/@hyperapp/render.svg?maxAge=3600)](https://npm-stat.com/charts.html?package=@hyperapp/render)
[![library size](http://img.badgesize.io/hyperapp/render/master/dist/hyperapp-render.min.js.svg?compression=gzip&label=size&maxAge=3600)](https://bundlephobia.com/result?p=@hyperapp/render)
[![slack chat](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that allows you to render views to an HTML string.

[Try it Online](https://codepen.io/frenzzy/pen/zpmRQY/left/?editors=0010)

<a href="#usage">
  <img width="622" height="270" alt="Examples"
  src="https://cdn.rawgit.com/hyperapp/render/master/demo.gif">
</a>

## Installation

Using [npm](https://www.npmjs.com/package/@hyperapp/render):

```bash
npm install @hyperapp/render --save
```

Or using a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) like
[unpkg.com](https://unpkg.com/@hyperapp/render@latest/hyperapp-render.min.js) or
[jsDelivr](https://cdn.jsdelivr.net/npm/@hyperapp/render@latest/hyperapp-render.min.js)
with the following script tag:

```html
<script src="https://unpkg.com/@hyperapp/render@latest/hyperapp-render.min.js"></script>
```

You can find the library in `window.render` and `window.renderToString`.

## Usage

The basic usage example is to use the `render` function,
which adds the `toString` action to be able to render your application to an HTML string at any given time.
This can be useful for server-side rendering or creating HTML snippets based on current application state.

```js
import { h, app } from 'hyperapp'
import { render } from '@hyperapp/render'

const state = { name: 'World' }
const actions = { setName: name => ({ name }) }
const view = (state, actions) => <h1>Hello {state.name}</h1>

const main = render(app)(state, actions, view)

main.toString()          // => <h1>Hello World</h1>
main.setName('Hyperapp') // <= any sync or async action call
main.toString()          // => <h1>Hello Hyperapp</h1>
```

You also can use `renderToString` function to generate HTML markup from any of your components without
app initialization. That could be useful to generate HTML markup from static views.

```js
import { renderToString } from '@hyperapp/render'

const Component = ({ name }) => <h1>Hello {name}</h1>

renderToString(<Component name="World" />)
// => <h1>Hello World</h1>
```

The library also provides [Node.js streaming](https://nodejs.org/api/stream.html) support for efficient
server-side rendering. Render-to-stream functionality is available from `@hyperapp/render/server` npm package.

```js
import { render, renderToString, renderToStream } from '@hyperapp/render/server'

const main = render(app)(state, actions, view)

main.toStream() // => <stream.Readable>
main.toString() // => <string>

renderToStream(<Component />) // => <stream.Readable>
renderToString(<Component />) // => <string>
```

## Browser Support

We support all ES5-compliant browsers, including Internet Explorer 9 and above,
but depending on your target browsers you may need to include
[polyfills](https://en.wikipedia.org/wiki/Polyfill_(programming)) for
[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set),
[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and
[`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
before any other code.

Also consider the list of browsers supported by [hyperapp](https://github.com/hyperapp/hyperapp) itself.

**Note:** `@hyperapp/render/server` is for [Node.js](https://nodejs.org/en/) environment only (v6 or newer).

## Caveats

The library automatically escapes text content and attribute values
of [virtual DOM nodes](https://github.com/hyperapp/hyperapp/blob/1.1.2/README.md#virtual-dom)
to protect your application against [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

However, it is not safe to allow "user input" for node names or attribute keys because
the library does not reject injection attack on markup due to performance reasons.
See:

```js
const tagName = 'div onclick="alert(1)"'
renderToString(h(tagName, { title: 'Hey' }, 'Hi'))
// => <div onclick="alert(1)" title="Hey︎">Hi</div>

const attributeName = 'onclick="alert(1)" title'
renderToString(h('div', { [attributeName]: 'Hey' }, 'Hi'))
// => <div onclick="alert(1)" title="Hey︎">Hi</div>

const userInput = '<script>alert(1)</script>'
renderToString(h('div', { innerHTML: userInput }, 'Hi'))
// => <div><script>alert(1)</script></div>
```

## License

Hyperapp Render is MIT licensed. See [LICENSE](https://github.com/hyperapp/render/blob/master/LICENSE.md).
