import { Readable } from 'stream'
import { renderer, renderToString } from './index'

export { renderToString }

export function renderToStream(view, state, actions) {
  const read = renderer(view, state, actions)

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
