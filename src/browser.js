import { renderToString } from './index'

export { renderToString }

export function withRender(nextApp) {
  return (initialState, actionsTemplate, view, container) => {
    const actions = nextApp(
      initialState,
      Object.assign({}, actionsTemplate, { getState: () => (state) => state }),
      view,
      container,
    )

    actions.toString = () => renderToString(view, actions.getState(), actions)

    return actions
  }
}
