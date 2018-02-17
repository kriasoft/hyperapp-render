/** @jsx h */
import { h, app } from 'hyperapp'
import { Readable, Writable } from 'stream'
import { renderer, renderToString, renderToStream, render } from '../src/server'

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

describe('server/renderer(node)(bytes)', () => {
  it('should render markup', () => {
    const read = renderer(<div />)
    expect(read(Infinity)).toBe('<div></div>')
    expect(read(Infinity)).toBe(null)
  })
})

describe('server/renderToString(node)', () => {
  it('should render markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })
})

describe('server/renderToStream(node)', () => {
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

describe('server/render(app)(state, actions, view, container)', () => {
  const initialState = {
    count: 0,
  }
  const actions = {
    up: (count = 1) => (state) => ({ count: state.count + count }),
  }
  const view = (state) => <h1>{state.count}</h1>

  it('should create a higher-order app', () => {
    const spyApp = jest.fn(() => 'result')
    const renderApp = render(spyApp)
    expect(renderApp).toBeInstanceOf(Function)
    expect(spyApp).not.toBeCalled()
    const main = renderApp(initialState, actions, view, 'container')
    expect(spyApp).toBeCalled()
    expect(spyApp.mock.calls[0][0]).toBe(initialState)
    expect(spyApp.mock.calls[0][1]).not.toBe(actions)
    expect(spyApp.mock.calls[0][2]).toBe(view)
    expect(spyApp.mock.calls[0][3]).toBe('container')
    expect(main).toBe('result')
  })

  it('should not mutate original actions', () => {
    render(app)(initialState, actions, view)
    expect(actions).toEqual({ up: actions.up })
  })

  it('should render app with current state to string', () => {
    const main = render(app)(initialState, actions, view)
    expect(main.toString).toBeInstanceOf(Function)
    expect(main.toString()).toBe('<h1>0</h1>')
    main.up()
    expect(main.toString()).toBe('<h1>1</h1>')
    main.up(100)
    expect(main.toString()).toBe('<h1>101</h1>')
  })

  it('should render app with current state to stream', async () => {
    const main = render(app)(initialState, actions, view)
    expect(main.toStream).toBeInstanceOf(Function)
    expect(await readFromStream(main.toStream())).toBe('<h1>0</h1>')
    main.up()
    expect(await readFromStream(main.toStream())).toBe('<h1>1</h1>')
    main.up(100)
    expect(await readFromStream(main.toStream())).toBe('<h1>101</h1>')
  })
})
