/** @jsx h */
import { h } from 'hyperapp'
import { renderToString } from '../src'

suite('escape', () => {
  benchmark('empty', () => {
    renderToString(<div>{null}</div>)
  })

  benchmark('number', () => {
    renderToString(<div>{1.23}</div>)
  })

  benchmark('string', () => {
    renderToString(<div>text</div>)
  })

  benchmark('special characters', () => {
    renderToString(<div>{`"&'<>`}</div>)
  })
})

suite('styles', () => {
  benchmark('empty', () => {
    const style = {
      color: null,
      border: null,
      opacity: null,
    }
    renderToString(<div style={style} />)
  })

  benchmark('basic', () => {
    const style = {
      color: '#000',
      border: '1px solid',
      opacity: 0.5,
    }
    renderToString(<div style={style} />)
  })

  benchmark('camel-case', () => {
    const style = {
      backgroundColor: '#000',
      borderTop: '1px solid',
      lineHeight: 1.23,
    }
    renderToString(<div style={style} />)
  })

  benchmark('vendor specific', () => {
    const style = {
      MozTransform: 'rotate(5deg)',
      msTransform: 'rotate(5deg)',
      transform: 'rotate(5deg)',
    }
    renderToString(<div style={style} />)
  })
})

suite('attributes', () => {
  benchmark('empty', () => {
    renderToString(<div data-empty={null} />)
  })

  benchmark('boolean', () => {
    renderToString(<div data-boolean />)
  })

  benchmark('regular', () => {
    renderToString(<div data-regular="text" />)
  })

  benchmark('special', () => {
    renderToString(<div key="key" innerHTML="<p>text</p>" />)
  })
})

suite('elements', () => {
  const Fragment = (attributes, children) => h('', attributes, children)
  const Component = (attributes, children) => <h1 {...attributes}>{children}</h1>

  benchmark('basic', () => {
    renderToString(
      <div>
        <h1>Hello World</h1>
      </div>,
    )
  })

  benchmark('fragment', () => {
    renderToString(
      <div>
        <Fragment>Hello World</Fragment>
      </div>,
    )
  })

  benchmark('component', () => {
    renderToString(
      <div>
        <Component>Hello World</Component>
      </div>,
    )
  })

  benchmark('array', () => {
    renderToString(
      <div>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </div>,
    )
  })

  benchmark('nested', () => {
    renderToString(
      <div>
        <span>
          A
          <span>
            B
            <span>C</span>
          </span>
        </span>
      </div>,
    )
  })
})
