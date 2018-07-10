export as namespace hyperappRender

import { ActionsType, View } from 'hyperapp'
import { Readable } from 'stream'
import { renderToString } from './index'

export { renderToString }

export function renderToStream<View, State, Actions>(
  view: View,
  state?: State,
  actions?: Actions,
): Readable

export type RenderActions = {
  toString(): string
  toStream(): Readable
}

export interface Render<State, Actions> {
  (
    state: State,
    actions: ActionsType<State, Actions>,
    view: View<State, Actions>,
    container: Element | null,
  ): RenderActions
}

export interface App<State, Actions> {
  (
    state: State,
    actions: ActionsType<State, Actions>,
    view: View<State, Actions>,
    container: Element | null,
  ): Actions
}

export function withRender<App, Render>(app: App): Render
