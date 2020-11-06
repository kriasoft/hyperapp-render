const { isArray } = Array
const { hasOwnProperty } = Object.prototype
const styleNameCache = new Map()
const uppercasePattern = /[A-Z]/g
const msPattern = /^ms-/

// https://www.w3.org/International/questions/qa-escapes#use
const escapeRegExp = /["&'<>]/

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

// credits to https://github.com/component/escape-html
export function escapeHtml(value) {
  const str = '' + value
  if (typeof value === 'number') {
    // better performance for safe values
    return str
  }

  const match = escapeRegExp.exec(str)
  if (!match) {
    return str
  }

  let { index } = match
  let lastIndex = 0
  let out = ''

  for (let escape = ''; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 39: // '
        escape = '&#39;' // shorter than "&apos;" and "&#x27;" plus supports HTML4
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      out += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    out += escape
  }

  return lastIndex !== index ? out + str.substring(lastIndex, index) : out
}

// credits to https://github.com/jorgebucaran/classcat
export function concatClassNames(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value || ''
  }

  let out = ''
  let delimiter = ''

  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const name = concatClassNames(value[i])
      if (name !== '') {
        out += delimiter + name
        delimiter = ' '
      }
    }
  } else {
    for (const name in value) {
      if (hasOwnProperty.call(value, name) && value[name]) {
        out += delimiter + name
        delimiter = ' '
      }
    }
  }

  return out
}

// "backgroundColor" => "background-color"
// "MozTransition" => "-moz-transition"
// "msTransition" => "-ms-transition"
function hyphenateStyleName(styleName) {
  if (!styleNameCache.has(styleName)) {
    const name = styleName.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-')

    // returns 'undefined' instead of the 'Map' object in IE11
    styleNameCache.set(styleName, name)
  }
  return styleNameCache.get(styleName)
}

export function stringifyStyles(style) {
  let out = ''
  let delimiter = ''

  for (const name in style) {
    if (hasOwnProperty.call(style, name)) {
      const value = style[name]

      if (value != null) {
        if (name === 'cssText') {
          out += delimiter + value
        } else {
          out += delimiter + hyphenateStyleName(name) + ':' + value
        }
        delimiter = ';'
      }
    }
  }

  return out
}

// https://www.w3.org/TR/html51/syntax.html#serializing-html-fragments
function renderFragment(name, props, children, stack) {
  let out = ''
  let footer = ''

  if (name) {
    out += '<' + name

    for (let prop in props) {
      if (hasOwnProperty.call(props, prop)) {
        let value = props[prop]

        if (
          value != null &&
          prop !== 'key' &&
          prop !== 'innerHTML' &&
          prop !== '__source' && // babel-plugin-transform-react-jsx-source
          !(prop[0] === 'o' && prop[1] === 'n')
        ) {
          if (prop === 'class' || prop === 'className') {
            prop = 'class'
            value = concatClassNames(value) || false
          } else if (prop === 'style' && typeof value === 'object') {
            value = stringifyStyles(value) || false
          }

          if (value !== false) {
            out += ' ' + prop

            if (value !== true) {
              out += '="' + escapeHtml(value) + '"'
            }
          }
        }
      }
    }

    if (voidElements.has(name)) {
      out += '/>'
    } else {
      out += '>'
      footer = '</' + name + '>'
    }
  }

  if (children.length > 0) {
    stack.push({
      childIndex: 0,
      children,
      footer,
    })
  } else {
    const { innerHTML } = props

    if (innerHTML != null) {
      out += innerHTML
    }

    out += footer
  }

  return out
}

function resolveNode(node, state, actions) {
  if (typeof node === 'function') {
    return resolveNode(node(state, actions), state, actions)
  }
  if (node && node.type === 2) {
    return resolveNode(node.lazy.view(node.lazy), state, actions)
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
          if (isArray(node)) {
            stack.push({
              childIndex: 0,
              children: node,
              footer: '',
            })
          } else if (node.tag === 3) {
            out += escapeHtml(node.type)
          } else if (node.type === 3) {
            out += escapeHtml(node.name)
          } else if (typeof node === 'object') {
            out += renderFragment(
              node.name || node.type || node.nodeName,
              node.props || node.attributes,
              node.children,
              stack,
            )
          } else {
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
