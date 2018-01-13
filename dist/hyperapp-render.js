/*! Hyperapp Render | MIT License | https://github.com/frenzzy/hyperapp-render */

(function (exports) {
'use strict';

var cache = new Map();
var uppercasePattern = /([A-Z])/g;
var msPattern = /^ms-/;

// https://www.w3.org/TR/html/syntax.html#void-elements
var voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

// https://www.w3.org/International/questions/qa-escapes#use
var escapeRegExp = /["&'<>]/g;
var escapeLookup = new Map([['"', '&quot;'], ['&', '&amp;'], ["'", '&#39;'], ['<', '&lt;'], ['>', '&gt;']]);

function escaper(match) {
  return escapeLookup.get(match);
}

function escapeHtml(value) {
  return String(value).replace(escapeRegExp, escaper);
}

// "backgroundColor" => "background-color"
// "MozTransition" => "-moz-transition"
// "msTransition" => "-ms-transition"
function hyphenateStyleName(styleName) {
  if (!cache.has(styleName)) {
    cache.set(styleName, styleName.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-'));
  }
  return cache.get(styleName);
}

function stringifyStyles(styles) {
  var serialized = '';
  var delimiter = '';
  var styleNames = Object.keys(styles);
  for (var i = 0, len = styleNames.length; i < len; i++) {
    var styleName = styleNames[i];
    var styleValue = styles[styleName];

    // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.0.2/src/index.js#L134
    if (styleValue != null) {
      serialized += delimiter + hyphenateStyleName(styleName) + ':' + styleValue;
      delimiter = ';';
    }
  }
  return serialized || null;
}

function renderAttribute(name, value) {
  var val = value;
  if (name === 'style' && val) {
    val = stringifyStyles(val);
  }
  if (val == null || val === false) {
    return '';
  }
  if (val === true) {
    return name;
  }
  return name + '="' + escapeHtml(val) + '"';
}

function renderFragment(node, stack) {
  // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.0.2/src/index.js#L149
  if (node == null) {
    return '';
  }

  var props = node.props;
  if (!props) {
    // text node
    return escapeHtml(node);
  }

  var tag = node.name;
  var out = '';
  var footer = '';
  if (tag) {
    // https://www.w3.org/TR/html51/syntax.html#serializing-html-fragments
    out += '<' + tag;
    var propNames = Object.keys(props);
    for (var i = 0, len = propNames.length; i < len; i++) {
      var name = propNames[i];
      var value = props[name];

      // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.0.2/src/index.js#L130
      if (name !== 'key' && name !== 'innerHTML' && typeof value !== 'function') {
        var attr = renderAttribute(name, value);
        if (attr) {
          out += ' ' + attr;
        }
      }
    }

    if (voidElements.has(tag)) {
      out += '/>';
    } else {
      out += '>';
      footer = '</' + tag + '>';
    }
  }

  var html = props.innerHTML;
  if (html != null) {
    out += html;
  }

  var children = node.children;
  if (children.length > 0) {
    stack.push({
      childIndex: 0,
      children: children,
      footer: footer
    });
  } else {
    out += footer;
  }

  return out;
}

function renderer(node) {
  var stack = [{
    childIndex: 0,
    children: [node],
    footer: ''
  }];
  var end = false;
  return function (bytes) {
    if (end) {
      return null;
    }
    var out = '';
    while (out.length < bytes) {
      if (stack.length === 0) {
        end = true;
        break;
      }
      var frame = stack[stack.length - 1];
      if (frame.childIndex >= frame.children.length) {
        out += frame.footer;
        stack.pop();
      } else {
        var child = frame.children[frame.childIndex++];
        out += renderFragment(child, stack);
      }
    }
    return out;
  };
}

function renderToString(node) {
  return renderer(node)(Infinity);
}

function render(app) {
  return function (initialState, actionsTemplate, view, container) {
    return app(initialState, Object.assign({}, actionsTemplate, {
      toString: function toString() {
        return function (state, actions) {
          return renderToString(view(state, actions));
        };
      }
    }), view, container);
  };
}

exports.renderer = renderer;
exports.renderToString = renderToString;
exports.render = render;

}((this.self = this.self || {})));
//# sourceMappingURL=hyperapp-render.js.map
