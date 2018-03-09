/** @jsx h */
import { h, app } from 'hyperapp'
import { Readable, Writable } from 'stream'
import { renderer, renderToString, renderToStream, withRender } from '../src/server'

function readFromStream(stream) {
  return new Promise((resolve, reject) => {
    let buffer = ''
    const writable = new Writable({
      write(chunk, encoding, callback) {
        buffer += chunk
        callback()
      },
    })
    writable.on('finish', () => resolve(buffer))
    stream.on('error', reject)
    stream.pipe(writable)
  })
}

describe('server/renderer(view, state, actions)(bytes)', () => {
  it('should render markup', () => {
    const read = renderer(<div />)
    expect(read(Infinity)).toBe('<div></div>')
    expect(read(Infinity)).toBe(null)
  })
})

describe('server/renderToString(view, state, actions)', () => {
  it('should render markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })
})

describe('server/renderToStream(view, state, actions)', () => {
  it('should return a readable stream', () => {
    const stream = renderToStream(<div>hello world</div>)
    expect(stream).toBeInstanceOf(Readable)
  })

  it('should emit an error for invalid input', async () => {
    const node = { nodeName: 'InvalidVNode', attributes: {}, children: null }
    const stream = renderToStream(node)
    let err
    try {
      await readFromStream(stream)
    } catch (e) {
      err = e
    }
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe("Cannot read property 'length' of null")
  })

  it('should render markup', async () => {
    const stream = renderToStream(<div>hello world</div>)
    const html = await readFromStream(stream)
    expect(html).toBe('<div>hello world</div>')
  })
})

describe('server/withRender(app)(state, actions, view, container)', () => {
  const testState = { count: 0 }
  const testActions = {
    up: (count = 1) => (state) => ({ count: state.count + count }),
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
    expect(testActions).toEqual({ up: testActions.up })
  })

  it('should render app with current state to string', () => {
    const acitons = withRender(app)(testState, testActions, testView)
    expect(acitons.toString).toBeInstanceOf(Function)
    expect(acitons.toString()).toBe('<h1>0</h1>')
    acitons.up()
    expect(acitons.toString()).toBe('<h1>1</h1>')
    acitons.up(100)
    expect(acitons.toString()).toBe('<h1>101</h1>')
  })

  it('should render app with current state to stream', async () => {
    const actions = withRender(app)(testState, testActions, testView)
    expect(actions.toStream).toBeInstanceOf(Function)
    expect(await readFromStream(actions.toStream())).toBe('<h1>0</h1>')
    actions.up()
    expect(await readFromStream(actions.toStream())).toBe('<h1>1</h1>')
    actions.up(100)
    expect(await readFromStream(actions.toStream())).toBe('<h1>101</h1>')
  })
})
