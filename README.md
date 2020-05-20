# <img height="24" src="https://cdn.rawgit.com/kriasoft/hyperapp-render/master/logo.svg"> Hyperapp Render

[![npm version](https://img.shields.io/npm/v/hyperapp-render.svg)](https://www.npmjs.com/package/hyperapp-render)
[![npm downloads](https://img.shields.io/npm/dw/hyperapp-render.svg)](https://www.npmjs.com/package/hyperapp-render)
[![library size](https://img.shields.io/bundlephobia/minzip/hyperapp-render.svg)](https://bundlephobia.com/result?p=hyperapp-render)
[![slack chat](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com 'Join us')

This library is allowing you to render
[Hyperapp](https://github.com/hyperapp/hyperapp) views to an HTML string.

- **User experience** — Generate HTML on the server and send the markup
  down on the initial request for faster page loads. Built-in
  [mounting](https://github.com/hyperapp/hyperapp/tree/1.2.9#mounting)
  feature in Hyperapp is allowing you to have a very performant first-load experience.
- **Accessibility** — Allow search engines to crawl your pages for
  [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization) purposes.
- **Testability** — [Check HTML validity](https://en.wikipedia.org/wiki/Validator) and use
  [snapshot testing](https://jestjs.io/docs/en/snapshot-testing.html)
  to improve quality of your software.

## Getting Started

Our first example is an interactive app from which you can generate an HTML markup.
Go ahead and [try it online](https://codepen.io/frenzzy/pen/zpmRQY/left/?editors=0010).

```jsx
import { h } from 'hyperapp'
import { renderToString } from 'hyperapp-render'

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

const html = renderToString(view(state, actions))

console.log(html) // => <main><h1>Hello</h1><input value="Hello"/></main>
```

Looking for a boilerplate?
Try [Hyperapp Starter](https://github.com/kriasoft/hyperapp-starter)
with pre-configured server-side rendering and many more.

## Installation

Using [npm](https://www.npmjs.com/package/hyperapp-render):

```bash
npm install hyperapp-render --save
```

Or using a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) like
[unpkg.com](https://unpkg.com/hyperapp-render) or
[jsDelivr](https://cdn.jsdelivr.net/npm/hyperapp-render)
with the following script tag:

```html
<script src="https://unpkg.com/hyperapp-render"></script>
```

You can find the library in `window.hyperappRender`.

We support all ES5-compliant browsers, including Internet Explorer 9 and above,
but depending on your target browsers you may need to include
[polyfills](<https://en.wikipedia.org/wiki/Polyfill_(programming)>) for
[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and
[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
before any other code.

## Usage

The library provides two functions
which you can use depending on your needs or personal preferences:

```jsx
import { renderToString, renderToStream } from 'hyperapp-render'

renderToString(<Component />)        // => <string>
renderToString(view(state, actions)) // => <string>
renderToString(view, state, actions) // => <string>

renderToStream(<Component />)        // => <stream.Readable> => <string>
renderToStream(view(state, actions)) // => <stream.Readable> => <string>
renderToStream(view, state, actions) // => <stream.Readable> => <string>
```

**Note:** `renderToStream` is available from
[Node.js](https://nodejs.org/en/) environment only (v6 or newer).

## Overview

You can use `renderToString` function to generate HTML on the server
and send the markup down on the initial request for faster page loads
and to allow search engines to crawl your pages for
[SEO](https://en.wikipedia.org/wiki/Search_engine_optimization) purposes.

If you call [`hyperapp.app()`](https://github.com/hyperapp/hyperapp/tree/1.2.9#mounting)
on a node that already has this server-rendered markup,
Hyperapp will preserve it and only attach event handlers, allowing you
to have a very performant first-load experience.

The `renderToStream` function returns a
[Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams)
that outputs an HTML string.
The HTML output by this stream is exactly equal to what `renderToString` would return.
By using this function you can reduce [TTFB](https://en.wikipedia.org/wiki/Time_to_first_byte)
and improve user experience even more.

## Caveats

The library automatically escapes text content and attribute values
of [virtual DOM nodes](https://github.com/hyperapp/hyperapp/tree/1.2.9#view)
to protect your application against
[XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
However, it is not safe to allow "user input" for node names or attribute keys:

```jsx
const Node = 'div onclick="alert()"'
renderToString(<Node title="XSS">Hi</Node>)
// => <div onclick="alert()" title="XSS">Hi</div>

const attributes = { 'onclick="alert()" title': 'XSS' }
renderToString(<div {...attributes}>Hi</div>)
// => <div onclick="alert()" title="XSS">Hi</div>

const userInput = '<script>alert()</script>'
renderToString(<div title="XSS" innerHTML={userInput}>Hi</div>)
// => <div title="XSS"><script>alert()</script></div>
```

## License

Hyperapp Render is MIT licensed.
See [LICENSE](https://github.com/kriasoft/hyperapp-render/blob/master/LICENSE.md).
