import { h, ActionsType, View } from 'hyperapp'
import {
  escapeHtml,
  concatClassNames,
  stringifyStyles,
  renderer,
  renderToString,
} from '../src/index'

export namespace Counter {
  export interface State {
    count: number
  }

  export interface Actions {
    up(): State
  }

  export const state: State = {
    count: 0,
  }

  export const actions: ActionsType<State, Actions> = {
    up: () => (state) => ({ count: state.count + 1 }),
  }

  export const view: View<Counter.State, Counter.Actions> = (state, actions) => (
    <button type="button" onclick={actions.up}>
      {state.count}
    </button>
  )
}

export function print(message: string) {
  console.log(message)
}

print(escapeHtml(100500))
print(escapeHtml('hello world'))

print(concatClassNames('foo bar baz'))
print(concatClassNames({ foo: true, bar: 'ok', baz: null }))
print(concatClassNames(['foo', ['bar', 0], { baz: 'ok' }, false, null]))

print(stringifyStyles({ color: 'red', backgroundColor: null }))

print(renderer(Counter.view, Counter.state, Counter.actions)(Infinity))
print(renderToString(Counter.view, Counter.state, Counter.actions))
print(renderToString(<h1>hello world</h1>))
