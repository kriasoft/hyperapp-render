/** @jsx h */
import { h } from 'hyperapp'
import { renderToString } from '../src/browser'

describe('renderToString(view, state, actions)', () => {
  it('should render simple markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })
})
