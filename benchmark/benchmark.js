/** @jsx h */
import { h } from 'hyperapp'
import { escapeHtml, concatClassNames, stringifyStyles, renderToString } from '../src/index'

suite('escapeHtml(value)', () => {
  benchmark('numeric value', () => {
    escapeHtml(123456789.012)
  })

  benchmark('no special characters', () => {
    escapeHtml('hello world')
  })

  benchmark('single special character', () => {
    escapeHtml('hello wor&d')
  })

  benchmark('many special characters', () => {
    escapeHtml('<b>"&&"</b>')
  })
})

suite('concatClassNames(value)', () => {
  benchmark('string value', () => {
    concatClassNames('foo bar baz')
  })

  benchmark('values array', () => {
    concatClassNames(['foo', 'bar', 'baz', null])
  })

  benchmark('values map', () => {
    concatClassNames({ foo: true, bar: 'ok', baz: 1, qux: null })
  })

  benchmark('mixed values', () => {
    concatClassNames(['foo', false, 0, null, { bar: 'ok', baz: 1, qux: null }])
  })

  benchmark('nested values', () => {
    concatClassNames(['foo', ['bar', { baz: 1 }, [false, { qux: null }]]])
  })
})

suite('stringifyStyles(style)', () => {
  benchmark('no values', () => {
    stringifyStyles({
      color: null,
      border: null,
      opacity: null,
    })
  })

  benchmark('basic styles', () => {
    stringifyStyles({
      color: '#000',
      border: '1px solid',
      opacity: 0.5,
    })
  })

  benchmark('camel-case styles', () => {
    stringifyStyles({
      backgroundColor: '#000',
      borderTop: '1px solid',
      lineHeight: 1.23,
    })
  })

  benchmark('vendor specific', () => {
    stringifyStyles({
      webkitTransform: 'rotate(5deg)',
      MozTransform: 'rotate(5deg)',
      msTransform: 'rotate(5deg)',
    })
  })
})

suite('renderAttributes(props)', () => {
  benchmark('no value', () => {
    renderToString(<div data-foo={null} />)
  })

  benchmark('boolean value', () => {
    renderToString(<div data-foo />)
  })

  benchmark('string value', () => {
    renderToString(<div data-foo="bar" />)
  })

  benchmark('special attributes', () => {
    renderToString(<div key="foo" innerHTML="<p>bar</p>" />)
  })
})

suite('renderToString(node)', () => {
  const Fragment = ''
  function Component(attributes, children) {
    return <h1 {...attributes}>{children}</h1>
  }

  benchmark('basic', () => {
    renderToString(<h1>Hello World</h1>)
  })

  benchmark('fragment', () => {
    renderToString(<Fragment>Hello World</Fragment>)
  })

  benchmark('component', () => {
    renderToString(<Component>Hello World</Component>)
  })

  benchmark('array', () => {
    renderToString(
      <Fragment>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Fragment>,
    )
  })

  benchmark('nested', () => {
    renderToString(
      <span>
        A
        <span>
          B<span>C</span>
        </span>
      </span>,
    )
  })
})
