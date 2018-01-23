<a href="https://hyperapp.js.org/" target="_blank">
  <img width="128" height="128" align="right" alt="Hyperapp"
  src="https://rawgit.com/frenzzy/hyperapp-render/master/logo.svg" />
</a>

# Hyperapp Render

[![NPM version](https://img.shields.io/npm/v/hyperapp-render.svg?style=flat-square)](https://www.npmjs.com/package/hyperapp-render)
[![NPM downloads](https://img.shields.io/npm/dm/hyperapp-render.svg?style=flat-square)](https://www.npmjs.com/package/hyperapp-render)
[![Build Status](https://img.shields.io/travis/frenzzy/hyperapp-render/master.svg?style=flat-square)](https://travis-ci.org/frenzzy/hyperapp-render)
[![Coverage Status](https://img.shields.io/coveralls/frenzzy/hyperapp-render.svg?style=flat-square)](https://coveralls.io/github/frenzzy/hyperapp-render)
[![Dependency Status](https://img.shields.io/david/frenzzy/hyperapp-render.svg?style=flat-square)](https://david-dm.org/frenzzy/hyperapp-render)
[![Online Chat](https://img.shields.io/badge/slack-join_chat-e01563.svg?style=flat-square)](https://hyperappjs.herokuapp.com)

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that allows you to render views to an HTML string.

[Try it Online](https://codepen.io/frenzzy/pen/zpmRQY/left/?editors=0010)

<a href="https://codepen.io/frenzzy/pen/zpmRQY/left/?editors=0010" target="_blank">
  <img width="622" height="270" alt="Demo"
  src="https://rawgit.com/frenzzy/hyperapp-render/master/demo.gif" />
</a>

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

The basic usage example is to use the `render` function,
which adds the `toString` action to be able to render your application to an HTML string at any given time.
This can be useful for server-side rendering or creating HTML snippets based on current application state.

```js
import { h, app } from 'hyperapp'
import { render } from 'hyperapp-render'

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
import { renderToString } from 'hyperapp-render'

const Component = (props) => <h1>Hello {props.name}</h1>

renderToString(<Component name="World" />)
// => <h1>Hello World</h1>
```

The library also provides [Node.js streaming](https://nodejs.org/api/stream.html) support for efficient
server-side rendering. Render-to-stream functionality is available from `hyperapp-render/server` npm package.

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

We support all ES5-compliant browsers, including Internet Explorer 9 and above,
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
because the library does not reject injection attack on markup due to performance reasons.
See:

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
