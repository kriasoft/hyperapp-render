/** @jsx h */
import { h, app } from 'hyperapp'
import { expect } from 'chai'
import sinon from 'sinon'
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
    expect(read(Infinity)).to.be.equal('<div></div>')
    expect(read(Infinity)).to.be.equal(null)
  })
})

describe('server/renderToString(node)', () => {
  it('should render markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).to.be.equal('<div>hello world</div>')
  })
})

describe('server/renderToStream(node)', () => {
  it('should return a readable stream', () => {
    const stream = renderToStream(<div>hello world</div>)
    expect(stream).to.be.an.instanceof(Readable)
  })

  it('should emit an error for invalid input', async () => {
    const node = { name: 'InvalidVNode', props: {}, children: null }
    const stream = renderToStream(node)
    let err
    try {
      await readFromStream(stream)
    } catch (e) {
      err = e
    }
    expect(err).to.be.an('error')
    expect(err.message).to.be.equal("Cannot read property 'length' of null")
  })

  it('should render markup', async () => {
    const stream = renderToStream(<div>hello world</div>)
    const html = await readFromStream(stream)
    expect(html).to.be.equal('<div>hello world</div>')
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
    const spyApp = sinon.spy(() => 'result')
    const renderApp = render(spyApp)
    expect(renderApp).to.be.a('function')
    expect(spyApp.called).to.be.equal(false)
    const main = renderApp(initialState, actions, view, 'container')
    expect(spyApp.calledOnce).to.be.equal(true)
    expect(spyApp.args[0][0]).to.be.equal(initialState)
    expect(spyApp.args[0][1]).to.not.be.equal(actions)
    expect(spyApp.args[0][2]).to.be.equal(view)
    expect(spyApp.args[0][3]).to.be.equal('container')
    expect(main).to.be.equal('result')
  })

  it('should not mutate original actions', () => {
    render(app)(initialState, actions, view)
    expect(actions).to.have.all.keys('up')
    expect(actions).to.not.have.own.property('toString')
  })

  it('should render app with current state to string', () => {
    const main = render(app)(initialState, actions, view)
    expect(main.toString).to.be.a('function')
    expect(main.toString()).to.be.equal('<h1>0</h1>')
    main.up()
    expect(main.toString()).to.be.equal('<h1>1</h1>')
    main.up(100)
    expect(main.toString()).to.be.equal('<h1>101</h1>')
  })

  it('should render app with current state to stream', async () => {
    const main = render(app)(initialState, actions, view)
    expect(main.toStream).to.be.a('function')
    expect(await readFromStream(main.toStream())).to.be.equal('<h1>0</h1>')
    main.up()
    expect(await readFromStream(main.toStream())).to.be.equal('<h1>1</h1>')
    main.up(100)
    expect(await readFromStream(main.toStream())).to.be.equal('<h1>101</h1>')
  })
})
