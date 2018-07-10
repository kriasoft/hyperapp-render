export as namespace hyperappRender

import { ActionsType, View } from 'hyperapp'
import { renderToString } from './index'

export { renderToString }

export type RenderActions = {
  toString(): string
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
