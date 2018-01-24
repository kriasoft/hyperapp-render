import { Readable } from 'stream'
import { renderer, renderToString } from './index'

export { renderer, renderToString }

export function renderToStream(node) {
  const read = renderer(node)
  // https://nodejs.org/api/stream.html
  return new Readable({
    read(size) {
      try {
        this.push(read(size))
      } catch (err) {
        this.emit('error', err)
      }
    },
  })
}

export function render(app) {
  return (initialState, actionsTemplate, view, container) =>
    app(
      initialState,
      Object.assign({}, actionsTemplate, {
        toString: () => (state, actions) => renderToString(view(state, actions)),
        toStream: () => (state, actions) => renderToStream(view(state, actions)),
      }),
      view,
      container,
    )
}
