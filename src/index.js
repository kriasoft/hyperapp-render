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
  for (let i = 0, len = styleNames.length; i < len; i++) {
    const styleName = styleNames[i]
    const styleValue = styles[styleName]

    // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.1.2/src/index.js#L135
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

function renderFragment(node, stack) {
  // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.1.2/src/index.js#L150
  if (node == null || typeof node === 'boolean') {
    return ''
  }

  const { attributes } = node
  if (!attributes) {
    // text node
    return escapeHtml(node)
  }

  const tag = node.nodeName
  let out = ''
  let footer = ''
  if (tag) {
    // https://www.w3.org/TR/html51/syntax.html#serializing-html-fragments
    out += '<' + tag
    const keys = Object.keys(attributes)
    for (let i = 0, len = keys.length; i < len; i++) {
      const name = keys[i]
      let value = attributes[name]

      if (name === 'style' && value && typeof value === 'object') {
        value = stringifyStyles(value)
      }

      // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.1.2/src/index.js#L131
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

    if (voidElements.has(tag)) {
      out += '/>'
    } else {
      out += '>'
      footer = '</' + tag + '>'
    }
  }

  const { innerHTML } = attributes
  if (innerHTML != null) {
    out += innerHTML
  }

  const { children } = node
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

export function renderer(node) {
  const stack = [
    {
      childIndex: 0,
      children: [node],
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
        const child = frame.children[frame.childIndex++]
        out += renderFragment(child, stack)
      }
    }
    return out
  }
}

export function renderToString(node) {
  return renderer(node)(Infinity)
}

export function render(app) {
  return (initialState, actionsTemplate, view, container) =>
    app(
      initialState,
      Object.assign({}, actionsTemplate, {
        toString: () => (state, actions) => renderToString(view(state, actions)),
      }),
      view,
      container,
    )
}
