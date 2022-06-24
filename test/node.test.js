/** @jsx h */
import { h } from 'hyperapp'
import { Readable, Writable } from 'stream'
import { renderToString, renderToStream } from '../src/node'

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

describe('renderToString(view, state, actions)', () => {
  it('should render simple markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })
})

describe('renderToStream(view, state, actions)', () => {
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
    expect(err.message).toMatch(
      /^Cannot read property 'length' of null|Cannot read properties of null \(reading 'length'\)$/,
    )
  })

  it('should render markup', async () => {
    const stream = renderToStream(<div>hello world</div>)
    const html = await readFromStream(stream)
    expect(html).toBe('<div>hello world</div>')
  })
})
