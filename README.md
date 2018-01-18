<a href="https://hyperapp.js.org/" target="_blank">
  <img width="64" height="64" align="right" alt="Hyperapp"
  src="https://rawgit.com/frenzzy/hyperapp-render/master/logo.svg" />
</a>

# Hyperapp Render

[![NPM version](http://img.shields.io/npm/v/hyperapp-render.svg?style=flat-square)](https://www.npmjs.com/package/hyperapp-render)
[![NPM downloads](http://img.shields.io/npm/dm/hyperapp-render.svg?style=flat-square)](https://www.npmjs.com/package/hyperapp-render)
[![Build Status](http://img.shields.io/travis/frenzzy/hyperapp-render/master.svg?style=flat-square)](https://travis-ci.org/frenzzy/hyperapp-render)
[![Coverage Status](https://img.shields.io/coveralls/frenzzy/hyperapp-render.svg?style=flat-square)](https://coveralls.io/github/frenzzy/hyperapp-render)
[![Dependency Status](http://img.shields.io/david/frenzzy/hyperapp-render.svg?style=flat-square)](https://david-dm.org/frenzzy/hyperapp-render)
[![Online Chat](http://img.shields.io/badge/chat-slack-blue.svg?style=flat-square)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that allows to render views to an HTML string.

## Installation

Using [npm](https://www.npmjs.com/package/hyperapp-render):

```bash
$ npm install hyperapp-render --save
```

Or using a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) like
[unpkg.com](https://unpkg.com/hyperapp-render@latest/hyperapp-render.min.js) or
[jsDelivr](https://cdn.jsdelivr.net/npm/hyperapp-render@latest/hyperapp-render.min.js)
with the following script tag:

```html
<script src="https://unpkg.com/hyperapp-render@latest/hyperapp-render.min.js"></script>
```

You can find the library in `window.render` and `window.renderToString`.

## Usage

[The basic usage example](https://codepen.io/frenzzy/pen/zpmRQY?editors=0010) is to use the `render` function,
which adds the `toString` action to be able to render your application to an HTML string at any given time.
That could be useful for server-side rendering or creating HTML snippets based on current application state.

```js
import { h, app } from 'hyperapp'
import { render } from 'hyperapp-render'

const state = {
  count: 0
}

const actions = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 })
}

const view = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)

const main = render(app)(state, actions, view, document.body)

main.toString()
// => <main><h1>0</h1><button>-</button><button>+</button></main>

main.up() // call any sync or async actions to change the application state

main.toString()
// => <main><h1>1</h1><button>-</button><button>+</button></main>
```

You also can use `renderToString` function to generate an HTML markup from any of your components without
app initialization. That could be useful to generate an HTML markup from static views.

```js
import { renderToString } from 'hyperapp-render'

const Component = (props) => <h1>Hello {props.name}</h1>

renderToString(<Component name="world" />)
// => <h1>Hello world</h1>
```

The library also provide [Node.js streaming](https://nodejs.org/api/stream.html) support for performant
server-side rendering. Render to stream is available from `hyperapp-render/server` npm package.

```js
import { render, renderToString, renderToStream } from 'hyperapp-render/server'

const main = render(app)(state, actions, view)

// render to stream
main.toStream()
renderToStream(<Component />)

// render to string
main.toString()
renderToString(<Component />)
```

## Browser Support

We support all ES5-compliant browsers, including Internet Explorer 9 and above
but depending on your target browsers you may need to include
[polyfills](https://en.wikipedia.org/wiki/Polyfill_(programming)) for
[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set),
[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and
[`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
before any other code.

Also consider the list of browsers supported by [hyperapp](https://github.com/hyperapp/hyperapp) itself.

**Note:** `hyperapp-render/server` is for [Node.js](https://nodejs.org/en/) environment only (v6 or newer).

## Caveats

The library automatically escapes text content and attribute/prop values
of [virtual nodes](https://github.com/hyperapp/hyperapp/blob/1.0.2/docs/concepts/vnodes.md)
to protect your application against [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

However, it is not safe to allow "user input" for tag/node names or attribute/prop keys
because the library does not reject injection attack on markup, see:

```js
const tagName = 'div onclick="alert(1)"'
renderToString({ name: tagName, props: {}, children: ['Hi'] })
// => <div onclick="alert(1)">Hi</div>

const propName = 'onclick="alert(1)" title'
renderToString({ name: 'div', props: { [propName]: 'Hey' }, children: ['Hi'] })
// => <div onclick="alert(1)" title="Hey">Hi</div>

const userInput = '<script>alert(1)</script>'
renderToString({ name: 'div', props: { innerHTML: userInput }, children: ['Hi'] })
// => <div><script>alert(1)</script></div>
```

## License

This source code is licensed under the MIT license found in the
[LICENSE.txt](https://github.com/frenzzy/hyperapp-render/blob/master/LICENSE.txt) file.

---
Made with ♥ by
[Vladimir Kutepov](https://github.com/frenzzy) and
[contributors](https://github.com/frenzzy/hyperapp-render/graphs/contributors)
