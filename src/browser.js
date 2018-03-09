const styleNameCache = new Map()
const uppercasePattern = /([A-Z])/g
const msPattern = /^ms-/

// https://www.w3.org/TR/html/syntax.html#void-elements
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const ignoreAttributes = new Set([
  'key',
  'innerHTML',
  '__source', // https://babeljs.io/docs/plugins/transform-react-jsx-source/
])

// https://www.w3.org/International/questions/qa-escapes#use
const escapeRegExp = /["&'<>]/g
const escapeLookup = new Map([
  ['"', '&quot;'],
  ['&', '&amp;'],
  ["'", '&#39;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
])

function escaper(match) {
  return escapeLookup.get(match)
}

function escapeHtml(value) {
  if (typeof value === 'number') {
    // better performance for safe values
    return '' + value
  }

  return ('' + value).replace(escapeRegExp, escaper)
}

// "backgroundColor" => "background-color"
// "MozTransition" => "-moz-transition"
// "msTransition" => "-ms-transition"
function hyphenateStyleName(styleName) {
  return (
    styleNameCache.get(styleName) ||
    styleNameCache
      .set(
        styleName,
        styleName
          .replace(uppercasePattern, '-$&')
          .toLowerCase()
          .replace(msPattern, '-ms-'),
      )
      .get(styleName)
  )
}

function stringifyStyles(styles) {
  let out = ''
  let delimiter = ''
  const styleNames = Object.keys(styles)

  for (let i = 0; i < styleNames.length; i++) {
    const styleName = styleNames[i]
    const styleValue = styles[styleName]

    if (styleValue != null) {
      if (styleName === 'cssText') {
        out += delimiter + styleValue
      } else {
        out += delimiter + hyphenateStyleName(styleName) + ':' + styleValue
      }

      delimiter = ';'
    }
  }

  return out || null
}

// https://www.w3.org/TR/html51/syntax.html#serializing-html-fragments
function renderFragment({ nodeName, attributes, children }, stack) {
  let out = ''
  let footer = ''

  if (nodeName) {
    out += '<' + nodeName
    const keys = Object.keys(attributes)

    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      let value = attributes[name]

      if (name === 'style' && value && typeof value === 'object') {
        value = stringifyStyles(value)
      }

      if (
        value != null &&
        value !== false &&
        typeof value !== 'function' &&
        !ignoreAttributes.has(name)
      ) {
        out += ' ' + name

        if (value !== true) {
          out += '="' + escapeHtml(value) + '"'
        }
      }
    }

    if (voidElements.has(nodeName)) {
      out += '/>'
    } else {
      out += '>'
      footer = '</' + nodeName + '>'
    }
  }

  const { innerHTML } = attributes

  if (innerHTML != null) {
    out += innerHTML
  }

  if (children.length > 0) {
    stack.push({
      childIndex: 0,
      children,
      footer,
    })
  } else {
    out += footer
  }

  return out
}

function resolveNode(node, state, actions) {
  if (typeof node === 'function') {
    return resolveNode(node(state, actions), state, actions)
  }

  return node
}

export function renderer(view, state, actions) {
  const stack = [
    {
      childIndex: 0,
      children: [view],
      footer: '',
    },
  ]
  let end = false
  return (bytes) => {
    if (end) {
      return null
    }

    let out = ''

    while (out.length < bytes) {
      if (stack.length === 0) {
        end = true
        break
      }

      const frame = stack[stack.length - 1]

      if (frame.childIndex >= frame.children.length) {
        out += frame.footer
        stack.pop()
      } else {
        const node = resolveNode(frame.children[frame.childIndex++], state, actions)

        if (node != null && typeof node !== 'boolean') {
          if (node.pop) {
            // array
            stack.push({
              childIndex: 0,
              children: node,
              footer: '',
            })
          } else if (node.attributes) {
            // element
            out += renderFragment(node, stack)
          } else {
            // text node
            out += escapeHtml(node)
          }
        }
      }
    }

    return out
  }
}

export function renderToString(view, state, actions) {
  return renderer(view, state, actions)(Infinity)
}

export function withRender(nextApp) {
  return (initialState, actionsTemplate, view, container) => {
    const actions = nextApp(
      initialState,
      Object.assign({}, actionsTemplate, { getState: () => (state) => state }),
      view,
      container,
    )

    actions.toString = () => renderToString(view, actions.getState(), actions)

    return actions
  }
}
