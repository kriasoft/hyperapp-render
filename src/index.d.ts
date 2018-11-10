export function escapeHtml(value: any): string

export function concatClassNames(value: any): string

export function stringifyStyles(style: any): string

export function renderer<View, State, Actions>(
  view: View,
  state?: State,
  actions?: Actions,
): (bytes: number) => string

export function renderToString<View, State, Actions>(
  view: View,
  state?: State,
  actions?: Actions,
): string
