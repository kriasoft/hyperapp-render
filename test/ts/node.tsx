import { h, app, ActionsType, View } from 'hyperapp'
import { renderToStream, withRender, App, Render, renderToString } from '../../src/node'

namespace Counter {
  export interface State {
    count: number
  }

  export interface Actions {
    down(): State
    up(value: number): State
  }

  export const state: State = {
    count: 0,
  }

  export const actions: ActionsType<State, Actions> = {
    down: () => (state) => ({ count: state.count - 1 }),
    up: (value: number) => (state) => ({
      count: state.count + value,
    }),
  }
}

const view: View<Counter.State, Counter.Actions> = (state, actions) => (
  <main>
    <div>{state.count}</div>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)

const counterString = renderToString(view, Counter.state, Counter.actions)

const counterStream = renderToStream(view, Counter.state, Counter.actions)

const counterRender = withRender<
  App<Counter.State, Counter.Actions>,
  Render<Counter.State, Counter.Actions>
>(app)(Counter.state, Counter.actions, view, document.body)

console.log(counterString)
console.log(counterStream)
console.log(counterRender.toString())
console.log(counterRender.toStream())
