import { View } from 'hyperapp'

export function renderer<View, State, Actions> (
  view: View,
  state?: State,
  actions?: Actions
): (bytes: number) => string

export function renderToString<View, State, Actions> (
  view: View,
  state?: State,
  actions?: Actions
): string
