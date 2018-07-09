export as namespace render

import { ActionsType, View } from 'hyperapp'
import { Readable } from 'stream'

export interface App<State, Actions> {
  (
    state: State,
    actions: ActionsType<State, Actions>,
    view: View<State, Actions>,
    container: Element | null
  ): Actions
}

export type RenderActions = {
  toString (): string
  toStream (): Readable
}

export interface Render<State, Actions> {
  (
    state: State,
    actions: ActionsType<State, Actions>,
    view: View<State, Actions>,
    container: Element | null
  ): RenderActions
}

export function renderer<View, State, Actions> (
  view: View,
  state?: State,
  actions?: Actions
): (bytes: number) => string

export function withRender<App, Render> (app: App): Render

export function renderToString<View, State, Actions> (
  view: View,
  state?: State,
  actions?: Actions
): string

export function renderToStream<View, State, Actions> (
  view: View,
  state?: State,
  actions?: Actions
): Readable
