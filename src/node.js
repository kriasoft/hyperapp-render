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

export function withRender(nextApp) {
  return (initialState, actionsTemplate, view, container) => {
    const actions = nextApp(
      initialState,
      { ...actionsTemplate, getState: () => (state) => state },
      view,
      container,
    )

    actions.toString = () => renderToString(view, actions.getState(), actions)
    actions.toStream = () => renderToStream(view, actions.getState(), actions)

    return actions
  }
}
