/** @jsx h */
import { h, app } from 'hyperapp'
import { renderToString, withRender } from '../src/browser'

describe('renderToString(view, state, actions)', () => {
  it('should render markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })
})

describe('withRender(app)(state, actions, view, container)', () => {
  const testState = { count: 0 }
  const testActions = {
    up: (count = 1) => (state) => ({ count: state.count + count }),
    getState: () => (state) => state,
  }
  const testView = (state) => <h1>{state.count}</h1>

  it('should create a higher-order app', () => {
    const mockApp = jest.fn(() => ({ result: true }))
    const renderApp = withRender(mockApp)
    expect(renderApp).toBeInstanceOf(Function)
    expect(mockApp).not.toBeCalled()
    const actions = renderApp(testState, testActions, testView, 'container')
    expect(mockApp).toBeCalled()
    expect(mockApp.mock.calls[0][0]).toBe(testState)
    expect(mockApp.mock.calls[0][1]).not.toBe(testActions)
    expect(mockApp.mock.calls[0][2]).toBe(testView)
    expect(mockApp.mock.calls[0][3]).toBe('container')
    expect(actions).toHaveProperty('result', true)
  })

  it('should not mutate original actions', () => {
    withRender(app)(testState, testActions, testView)
    expect(testActions).toEqual({
      up: testActions.up,
      getState: testActions.getState,
    })
  })

  it('should not mutate store', () => {
    const actions = withRender(app)(testState, testActions, testView)
    expect(actions.getState()).toEqual({ count: 0 })
    expect(actions.toString()).toBe('<h1>0</h1>')
    expect(actions.getState()).toEqual({ count: 0 })
  })

  it('should render app with current state', () => {
    const actions = withRender(app)(testState, testActions, testView)
    expect(actions.toString).toBeInstanceOf(Function)
    expect(actions.toString()).toBe('<h1>0</h1>')
    actions.up()
    expect(actions.toString()).toBe('<h1>1</h1>')
    actions.up(100)
    expect(actions.toString()).toBe('<h1>101</h1>')
  })

  it('should provide state and actions to nested views', () => {
    const Component = () => (state, actions) => {
      expect(actions).toBeInstanceOf(Object)
      return <h1>{state.count}</h1>
    }
    const view = () => <Component />
    const actions = withRender(app)(testState, testActions, view)
    expect(actions.toString()).toBe('<h1>0</h1>')
    actions.up(5)
    expect(actions.toString()).toBe('<h1>5</h1>')
  })
})
