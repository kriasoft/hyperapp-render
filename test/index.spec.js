/** @jsx h */
import { h, app } from 'hyperapp'
import { expect } from 'chai'
import sinon from 'sinon'
import { renderer, renderToString, render } from '../src'

describe('escapeHtml(value)', () => {
  it('should escape ampersand when passed as text content', () => {
    const html = renderToString(<div>{'&'}</div>)
    expect(html).to.be.equal('<div>&amp;</div>')
  })

  it('should escape double quote when passed as text content', () => {
    const html = renderToString(<div>{'"'}</div>)
    expect(html).to.be.equal('<div>&quot;</div>')
  })

  it('should escape single quote when passed as text content', () => {
    const html = renderToString(<div>{"'"}</div>)
    expect(html).to.be.equal('<div>&#39;</div>')
  })

  it('should escape greater than entity when passed as text content', () => {
    const html = renderToString(<div>{'>'}</div>)
    expect(html).to.be.equal('<div>&gt;</div>')
  })

  it('should escape lower than entity when passed as text content', () => {
    const html = renderToString(<div>{'<'}</div>)
    expect(html).to.be.equal('<div>&lt;</div>')
  })

  it('should escape script tag when passed as text content', () => {
    const html = renderToString(<div>{'<script type=\'\' src=""></script>'}</div>)
    expect(html).to.be.equal(
      '<div>&lt;script type=&#39;&#39; src=&quot;&quot;&gt;&lt;/script&gt;</div>',
    )
  })

  it('should escape ampersand inside attributes', () => {
    const html = renderToString(<div data-attr="&" />)
    expect(html).to.be.equal('<div data-attr="&amp;"></div>')
  })

  it('should escape double quote inside attributes', () => {
    const html = renderToString(<div data-attr={'"'} />)
    expect(html).to.be.equal('<div data-attr="&quot;"></div>')
  })

  it('should escape single quote inside attributes', () => {
    const html = renderToString(<div data-attr="'" />)
    expect(html).to.be.equal('<div data-attr="&#39;"></div>')
  })

  it('should escape greater than entity inside attributes', () => {
    const html = renderToString(<div data-attr=">" />)
    expect(html).to.be.equal('<div data-attr="&gt;"></div>')
  })

  it('should escape lower than entity inside attributes', () => {
    const html = renderToString(<div data-attr="<" />)
    expect(html).to.be.equal('<div data-attr="&lt;"></div>')
  })

  it('should escape script tag inside attributes', () => {
    const html = renderToString(<div data-attr={'<script type=\'\' src=""></script>'} />)
    expect(html).to.be.equal(
      '<div data-attr="&lt;script type=&#39;&#39; src=&quot;&quot;&gt;&lt;/script&gt;"></div>',
    )
  })

  it('should not escape innerHTML', () => {
    const html = renderToString(<div innerHTML={'<!--comment-->'} />)
    expect(html).to.be.equal('<div><!--comment--></div>')
  })
})

describe('stringifyStyles(styles)', () => {
  it('should generate markup for style attribute', () => {
    const styles = {
      left: 0,
      margin: 16,
      opacity: 0.5,
      padding: '4px',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="left:0;margin:16;opacity:0.5;padding:4px"></div>')
  })

  it('should not trim values', () => {
    const styles = {
      left: '16 ',
      opacity: 0.5,
      right: ' 4 ',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="left:16 ;opacity:0.5;right: 4 "></div>')
  })

  it('should create vendor-prefixed markup correctly', () => {
    const styles = {
      msTransition: 'none',
      MozTransition: 'none',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="-ms-transition:none;-moz-transition:none"></div>')
  })

  it('should render style attribute when styles exist', () => {
    const styles = {
      backgroundColor: '#000',
      display: 'none',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="background-color:#000;display:none"></div>')
  })

  it('should not render style attribute when no styles exist', () => {
    const styles = {
      backgroundColor: null,
      display: undefined,
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should render hyphenated style names', () => {
    const styles = {
      'background-color': 'Orange',
      '-webkit-transform': 'translateX(0)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal(
      '<div style="background-color:Orange;-webkit-transform:translateX(0)"></div>',
    )
  })

  it('should render custom properties', () => {
    const styles = {
      '--foo': 'red',
      color: 'var(--foo)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="--foo:red;color:var(--foo)"></div>')
  })

  it('should render invalid values', () => {
    const styles = {
      height: NaN,
      fontSize: 1 / 0,
      backgroundImage: 'url(foo;bar)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal(
      '<div style="height:NaN;font-size:Infinity;background-image:url(foo;bar)"></div>',
    )
  })

  it('should not add units', () => {
    const styles = {
      '--foo': 5,
      flex: 0,
      opacity: 0.5,
    }
    const html = renderToString(<div style={styles} />)
    expect(html).to.be.equal('<div style="--foo:5;flex:0;opacity:0.5"></div>')
  })
})

describe('renderAttribute(name, value)', () => {
  it('should render attribute', () => {
    const html = renderToString(<div title="foo" />)
    expect(html).to.be.equal('<div title="foo"></div>')
  })
  it('should render boolean attribute', () => {
    const html = renderToString(<input checked />)
    expect(html).to.be.equal('<input checked/>')
  })

  it('should render attribute with empty string value', () => {
    const html = renderToString(<div data-attrName="" />)
    expect(html).to.be.equal('<div data-attrName=""></div>')
  })

  it('should render attribute with number value', () => {
    const html = renderToString(<div data-attr={12} />)
    expect(html).to.be.equal('<div data-attr="12"></div>')
  })

  it('should render attribute with NaN value', () => {
    const html = renderToString(<div data-attr={NaN} />)
    expect(html).to.be.equal('<div data-attr="NaN"></div>')
  })

  it('should render attribute with Infinity value', () => {
    const html = renderToString(<div data-attr={Infinity} />)
    expect(html).to.be.equal('<div data-attr="Infinity"></div>')
  })

  it('should render attribute with array value', () => {
    const html = renderToString(<div data-attr={[0, 1, '2']} />)
    expect(html).to.be.equal('<div data-attr="0,1,2"></div>')
  })

  it('should render attribute with object value', () => {
    const sampleObject = {
      toString() {
        return 'sample'
      },
    }
    const html = renderToString(<div data-attr={sampleObject} />)
    expect(html).to.be.equal('<div data-attr="sample"></div>')
  })

  it('should not render attribute with falsey value', () => {
    const html = renderToString(<div data-attr={false} />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render attribute with null value', () => {
    const html = renderToString(<div data-attr={null} />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render attribute with undefined value', () => {
    const html = renderToString(<div data-attr={undefined} />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render key attribute', () => {
    const html = renderToString(<div key />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render innerHTML attribute', () => {
    const html = renderToString(<div innerHTML="" />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render __source attribute', () => {
    const source = { fileName: 'this/file.js', lineNumber: 10 }
    const html = renderToString(<div __source={source} />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should not render event attribute', () => {
    const html = renderToString(<button onclick={() => {}} />)
    expect(html).to.be.equal('<button></button>')
  })
})

describe('renderer(node)(bytes)', () => {
  it('should create a reader function', () => {
    const read = renderer(<div />)
    expect(read).to.be.a('function')
    expect(read(0)).to.be.equal('')
  })

  it('should render chunks', () => {
    const read = renderer(
      <div>
        <input />
      </div>,
    )
    expect(read(1)).to.be.equal('<div>')
    expect(read(1)).to.be.equal('<input/>')
    expect(read(1)).to.be.equal('</div>')
  })

  it('should return null at the end', () => {
    const read = renderer(<div />)
    expect(read(Infinity)).to.be.equal('<div></div>')
    expect(read(Infinity)).to.be.equal(null)
  })
})

describe('renderToString(node)', () => {
  it('should render simple markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).to.be.equal('<div>hello world</div>')
  })

  it('should render closing tags for empty elements', () => {
    const html = renderToString(<div />)
    expect(html).to.be.equal('<div></div>')
  })

  it('should render markup for self-closing tags', () => {
    const html = renderToString(<input />)
    expect(html).to.be.equal('<input/>')
  })

  it('should render empty markup for components which return null', () => {
    const NullComponent = () => null
    const html = renderToString(<NullComponent />)
    expect(html).to.be.equal('')
  })

  it('should render composite components', () => {
    const Child = (props) => <h1>Hello {props.name}</h1>
    const Parent = () => (
      <div>
        <Child name="World" />
      </div>
    )
    const html = renderToString(<Parent />)
    expect(html).to.be.equal('<div><h1>Hello World</h1></div>')
  })

  it('should render web components', () => {
    const html = renderToString(<custom-element-name arabicForm="foo" />)
    expect(html).to.be.equal('<custom-element-name arabicForm="foo"></custom-element-name>')
  })

  it('should render undefined, null and booleans as empty string', () => {
    const html = renderToString(<div>{[undefined, null, false, true, 0]}</div>)
    expect(html).to.be.equal('<div>0</div>')
  })

  it('should render content of JSX fragment', () => {
    const html = renderToString(h('', {}, [<meta />, <link />]))
    expect(html).to.be.equal('<meta/><link/>')
  })

  it('should render raw html without extra markup', () => {
    const html = renderToString(h('', { innerHTML: '<sciprt>alert("hello world")</sciprt>' }))
    expect(html).to.be.equal('<sciprt>alert("hello world")</sciprt>')
  })
})

describe('render(app)(state, actions, view, container)', () => {
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

  it('should render app with current state', () => {
    const main = render(app)(initialState, actions, view)
    expect(main.toString).to.be.a('function')
    expect(main.toString()).to.be.equal('<h1>0</h1>')
    main.up()
    expect(main.toString()).to.be.equal('<h1>1</h1>')
    main.up(100)
    expect(main.toString()).to.be.equal('<h1>101</h1>')
  })
})
