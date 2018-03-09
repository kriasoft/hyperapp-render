# <img height="24" src="https://cdn.rawgit.com/hyperapp/render/master/logo.svg"> Hyperapp Render

[![npm version](https://img.shields.io/npm/v/@hyperapp/render.svg?maxAge=3600)](https://www.npmjs.com/package/@hyperapp/render)
[![library size](http://img.badgesize.io/hyperapp/render/master/dist/hyperapp-render.min.js.svg?compression=gzip&label=size&maxAge=3600)](https://bundlephobia.com/result?p=@hyperapp/render)
[![npm downloads](https://img.shields.io/npm/dm/@hyperapp/render.svg?maxAge=3600)](https://npm-stat.com/charts.html?package=@hyperapp/render)
[![slack chat](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app`
that allows you to render views to an HTML string.

* **User experience** — Generate HTML on the server and send the markup
  down on the initial request for faster page loads. Built-in
  [mounting](https://github.com/hyperapp/hyperapp/tree/d91e4667ee4e684eb874235e46ce919f502d4aae#mounting)
  feature in Hyperapp is allowing you to have a very performant first-load experience.
* **Accessibility** — Allow search engines to crawl your pages for
  [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization) purposes.
* **Testability** — [Check HTML validity](https://en.wikipedia.org/wiki/Validator) and use
  [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)
  to improve quality of your software.

## Getting Started

Our first example is an interactive app from which you can generate an HTML markup for different purposes
at any given time. Go ahead and [try it online](https://codepen.io/frenzzy/pen/zpmRQY/left/?editors=0010).

```js
import { h, app } from 'hyperapp'
import { withRender } from '@hyperapp/render'

const state = {
  text: 'Hello'
}

const actions = {
  setText: text => ({ text })
}

const view = (state, actions) => (
  <main>
    <h1>{state.text.trim() === '' ? '👋' : state.text}</h1>
    <input value={state.text} oninput={e => actions.setText(e.target.value)} />
  </main>
)

const main = withRender(app)(state, actions, view, document.body)

main.toString()       // => <main><h1>Hello</h1><input value="Hello"/></main>
main.setText('World') // <= here could be any sync or async action call!
main.toString()       // => <main><h1>World</h1><input value="World"/></main>
```

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

You can find the library in `window.hyperappRender`.

## Usage

The library provides a few functions which you can use depending on your needs or personal preferences.

```js
import { withRender, renderToString, renderToStream } from '@hyperapp/render/server'

const main = withRender(app)(state, actions, view, container)

main.toString()                      // => <string>
renderToString(<Component />)        // => <string>
renderToString(view, state, actions) // => <string>

main.toStream()                      // => <stream.Readable>
renderToStream(<Component />)        // => <stream.Readable>
renderToStream(view, state, actions) // => <stream.Readable>
```

**Note:** functions `toStream` and `renderToStream` are available in
[Node.js](https://nodejs.org/en/) environment only (v6 or newer).

## Examples

The basic usage example is to use the `withRender` function,
which adds the `toString` action to be able to render your application to an HTML string at any given time.
This can be useful for server-side rendering or creating HTML snippets based on current application state.

```js
import { h, app } from 'hyperapp'
import { withRender } from '@hyperapp/render'

const state = { name: 'World' }
const actions = { setName: name => ({ name }) }
const view = (state, actions) => <h1>Hello {state.name}</h1>

const main = withRender(app)(state, actions, view)

main.toString()          // => <h1>Hello World</h1>
main.setName('Hyperapp') // <= any sync or async action call
main.toString()          // => <h1>Hello Hyperapp</h1>
```

You also can use `renderToString` function to generate HTML markup from any of your views without
app initialization. That could be useful to generate HTML markup from static views.

```js
import { renderToString } from '@hyperapp/render'

const Component = ({ name }) => <h1>Hello {name}</h1>

renderToString(<Component name="World" />)
// => <h1>Hello World</h1>
```

Functions `toStream` and `renderToStream` returns a
[Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string.
The HTML output by this stream is exactly equal to what `toString` or `renderToString` would return.

```js
app.get('/', (req, res) => {
  res.write('<!doctype html><html><head>')
  res.write('<title>Page</title>')
  res.write('</head><body><div id="app">')
  const main = withRender(app)(state, actions, view)
  const stream = main.toStream()
  stream.pipe(res, { end: false })
  stream.on('end', () => {
    res.write('</div></body></html>')
    res.end()
  })
})
```

```js
app.get('/', (req, res) => {
  res.write('<!doctype html>')
  const stream = renderToStream(
    <html>
      <head><title>Page</title></head>
      <body>
        <div id="app">{view(state, actions)}</div>
      </body>
    </html>
  )
  stream.pipe(res)
})
```

## Browser Support

We support all ES5-compliant browsers, including Internet Explorer 9 and above,
but depending on your target browsers you may need to include
[polyfills](https://en.wikipedia.org/wiki/Polyfill_(programming)) for
[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set),
[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and
[`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
before any other code.

## Caveats

The library automatically escapes text content and attribute values
of [virtual DOM nodes](https://github.com/hyperapp/hyperapp/blob/1.1.2/README.md#virtual-dom)
to protect your application against [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

However, it is not safe to allow "user input" for node names or attribute keys because
the library does not reject injection attack on markup due to performance reasons.
See:

```js
const Element = 'div onclick="alert()"'
renderToString(<Element title="XSS">Hi</Element>)
// => <div onclick="alert()" title="XSS">Hi</div>

const attributes = { 'onclick="alert()" title': 'XSS' }
renderToString(<div {...attributes}>Hi</div>)
// => <div onclick="alert()" title="XSS">Hi</div>

const userInput = '<script>alert()</script>'
renderToString(<div innerHTML={userInput} title="XSS">Hi</div>)
// => <div title="XSS"><script>alert()</script></div>
```

## License

Hyperapp Render is MIT licensed. See [LICENSE](https://github.com/hyperapp/render/blob/master/LICENSE.md).
