import { Readable } from 'stream'
import { renderToString } from './index'

export { renderToString }

export function renderToStream<View, State, Actions>(
  view: View,
  state?: State,
  actions?: Actions,
): Readable
