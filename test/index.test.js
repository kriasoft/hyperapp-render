/** @jsx h */
import { h, app } from 'hyperapp'
import { renderer, renderToString, withRender } from '../src'

describe('escape', () => {
  it('should escape ampersand when passed as text content', () => {
    const html = renderToString(<div>{'&'}</div>)
    expect(html).toBe('<div>&amp;</div>')
  })

  it('should escape double quote when passed as text content', () => {
    const html = renderToString(<div>{'"'}</div>)
    expect(html).toBe('<div>&quot;</div>')
  })

  it('should escape single quote when passed as text content', () => {
    const html = renderToString(<div>{"'"}</div>)
    expect(html).toBe('<div>&#39;</div>')
  })

  it('should escape greater than entity when passed as text content', () => {
    const html = renderToString(<div>{'>'}</div>)
    expect(html).toBe('<div>&gt;</div>')
  })

  it('should escape lower than entity when passed as text content', () => {
    const html = renderToString(<div>{'<'}</div>)
    expect(html).toBe('<div>&lt;</div>')
  })

  it('should escape script tag when passed as text content', () => {
    const html = renderToString(<div>{'<script type=\'\' src=""></script>'}</div>)
    expect(html).toBe('<div>&lt;script type=&#39;&#39; src=&quot;&quot;&gt;&lt;/script&gt;</div>')
  })

  it('should escape ampersand inside attributes', () => {
    const html = renderToString(<div data-attr="&" />)
    expect(html).toBe('<div data-attr="&amp;"></div>')
  })

  it('should escape double quote inside attributes', () => {
    const html = renderToString(<div data-attr={'"'} />)
    expect(html).toBe('<div data-attr="&quot;"></div>')
  })

  it('should escape single quote inside attributes', () => {
    const html = renderToString(<div data-attr="'" />)
    expect(html).toBe('<div data-attr="&#39;"></div>')
  })

  it('should escape greater than entity inside attributes', () => {
    const html = renderToString(<div data-attr=">" />)
    expect(html).toBe('<div data-attr="&gt;"></div>')
  })

  it('should escape lower than entity inside attributes', () => {
    const html = renderToString(<div data-attr="<" />)
    expect(html).toBe('<div data-attr="&lt;"></div>')
  })

  it('should escape script tag inside attributes', () => {
    const html = renderToString(<div data-attr={'<script type=\'\' src=""></script>'} />)
    expect(html).toBe(
      '<div data-attr="&lt;script type=&#39;&#39; src=&quot;&quot;&gt;&lt;/script&gt;"></div>',
    )
  })

  it('should not escape innerHTML', () => {
    const html = renderToString(<div innerHTML={'<!--comment-->'} />)
    expect(html).toBe('<div><!--comment--></div>')
  })
})

describe('styles', () => {
  it('should generate markup for style attribute', () => {
    const styles = {
      left: 0,
      margin: 16,
      opacity: 0.5,
      padding: '4px',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="left:0;margin:16;opacity:0.5;padding:4px"></div>')
  })

  it('should not trim values', () => {
    const styles = {
      left: '16 ',
      opacity: 0.5,
      right: ' 4 ',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="left:16 ;opacity:0.5;right: 4 "></div>')
  })

  it('should create vendor-prefixed markup correctly', () => {
    const styles = {
      msTransition: 'none',
      MozTransition: 'none',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="-ms-transition:none;-moz-transition:none"></div>')
  })

  it('should render style attribute when styles exist', () => {
    const styles = {
      backgroundColor: '#000',
      display: 'none',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="background-color:#000;display:none"></div>')
  })

  it('should not render style attribute when no styles exist', () => {
    const styles = {
      backgroundColor: null,
      display: undefined,
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div></div>')
  })

  it('should render hyphenated style names', () => {
    const styles = {
      'background-color': 'Orange',
      '-webkit-transform': 'translateX(0)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="background-color:Orange;-webkit-transform:translateX(0)"></div>')
  })

  it('should render custom properties', () => {
    const styles = {
      '--foo': 'red',
      color: 'var(--foo)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="--foo:red;color:var(--foo)"></div>')
  })

  it('should render invalid values', () => {
    const styles = {
      height: NaN,
      fontSize: 1 / 0,
      backgroundImage: 'url(foo;bar)',
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe(
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
    expect(html).toBe('<div style="--foo:5;flex:0;opacity:0.5"></div>')
  })

  it('should render cssText', () => {
    const styles = {
      top: 0,
      cssText: 'color:blue;font-size:10px',
      bottom: 0,
    }
    const html = renderToString(<div style={styles} />)
    expect(html).toBe('<div style="top:0;color:blue;font-size:10px;bottom:0"></div>')
  })

  it('should render non-object style', () => {
    const html = renderToString(<div style="color:red;font-size:12px" />)
    expect(html).toBe('<div style="color:red;font-size:12px"></div>')
  })
})

describe('attributes', () => {
  it('should render attribute', () => {
    const html = renderToString(<div title="foo" />)
    expect(html).toBe('<div title="foo"></div>')
  })
  it('should render boolean attribute', () => {
    const html = renderToString(<input checked />)
    expect(html).toBe('<input checked/>')
  })

  it('should render attribute with empty string value', () => {
    const html = renderToString(<div data-attrName="" />)
    expect(html).toBe('<div data-attrName=""></div>')
  })

  it('should render attribute with number value', () => {
    const html = renderToString(<div data-attr={12} />)
    expect(html).toBe('<div data-attr="12"></div>')
  })

  it('should render attribute with NaN value', () => {
    const html = renderToString(<div data-attr={NaN} />)
    expect(html).toBe('<div data-attr="NaN"></div>')
  })

  it('should render attribute with Infinity value', () => {
    const html = renderToString(<div data-attr={Infinity} />)
    expect(html).toBe('<div data-attr="Infinity"></div>')
  })

  it('should render attribute with array value', () => {
    const html = renderToString(<div data-attr={[0, 1, '2']} />)
    expect(html).toBe('<div data-attr="0,1,2"></div>')
  })

  it('should render attribute with object value', () => {
    const sampleObject = {
      toString() {
        return 'sample'
      },
    }
    const html = renderToString(<div data-attr={sampleObject} />)
    expect(html).toBe('<div data-attr="sample"></div>')
  })

  it('should not render attribute with falsey value', () => {
    const html = renderToString(<div data-attr={false} />)
    expect(html).toBe('<div></div>')
  })

  it('should not render attribute with null value', () => {
    const html = renderToString(<div data-attr={null} />)
    expect(html).toBe('<div></div>')
  })

  it('should not render attribute with undefined value', () => {
    const html = renderToString(<div data-attr={undefined} />)
    expect(html).toBe('<div></div>')
  })

  it('should not render key attribute', () => {
    const html = renderToString(<div key />)
    expect(html).toBe('<div></div>')
  })

  it('should not render innerHTML attribute', () => {
    const html = renderToString(<div innerHTML="" />)
    expect(html).toBe('<div></div>')
  })

  it('should not render __source attribute', () => {
    const source = { fileName: 'this/file.js', lineNumber: 10 }
    const html = renderToString(<div __source={source} />)
    expect(html).toBe('<div></div>')
  })

  it('should not render event attribute', () => {
    const html = renderToString(<button onclick={() => {}} />)
    expect(html).toBe('<button></button>')
  })
})

describe('renderer(view, state, actions)(bytes)', () => {
  it('should create a reader function', () => {
    const read = renderer(<div />)
    expect(read).toBeInstanceOf(Function)
    expect(read(0)).toBe('')
  })

  it('should render chunks', () => {
    const read = renderer(
      <div>
        <input />
      </div>,
    )
    expect(read(1)).toBe('<div>')
    expect(read(1)).toBe('<input/>')
    expect(read(1)).toBe('</div>')
  })

  it('should return null at the end', () => {
    const read = renderer(<div />)
    expect(read(Infinity)).toBe('<div></div>')
    expect(read(Infinity)).toBe(null)
  })
})

describe('renderToString(view, state, actions)', () => {
  it('should render simple markup', () => {
    const html = renderToString(<div>hello world</div>)
    expect(html).toBe('<div>hello world</div>')
  })

  it('should render closing tags for empty elements', () => {
    const html = renderToString(<div />)
    expect(html).toBe('<div></div>')
  })

  it('should render markup for self-closing tags', () => {
    const html = renderToString(<input />)
    expect(html).toBe('<input/>')
  })

  it('should render empty markup for components which return null', () => {
    const NullComponent = () => null
    const html = renderToString(<NullComponent />)
    expect(html).toBe('')
  })

  it('should render composite components', () => {
    const Child = ({ name }) => <h1>Hello {name}</h1>
    const Parent = () => (
      <div>
        <Child name="World" />
      </div>
    )
    const html = renderToString(<Parent />)
    expect(html).toBe('<div><h1>Hello World</h1></div>')
  })

  it('should render web components', () => {
    const html = renderToString(<custom-element-name arabicForm="foo" />)
    expect(html).toBe('<custom-element-name arabicForm="foo"></custom-element-name>')
  })

  it('should render undefined, null and booleans as an empty string', () => {
    const html = renderToString({
      nodeName: 'div',
      attributes: {},
      children: [undefined, null, false, true, 0],
    })
    expect(html).toBe('<div>0</div>')
  })

  it('should render content of JSX fragment', () => {
    const html = renderToString(h('', {}, [<meta />, <link />]))
    expect(html).toBe('<meta/><link/>')
  })

  it('should render raw html without extra markup', () => {
    const html = renderToString(h('', { innerHTML: '<sciprt>alert("hello world")</sciprt>' }))
    expect(html).toBe('<sciprt>alert("hello world")</sciprt>')
  })

  it('should render an array of elements', () => {
    const html = renderToString([<meta />, <link />])
    expect(html).toBe('<meta/><link/>')
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
