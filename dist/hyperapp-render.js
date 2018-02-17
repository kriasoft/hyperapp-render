/*! Hyperapp Render | MIT License | https://github.com/frenzzy/hyperapp-render */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.self = global.self || {})));
}(this, (function (exports) { 'use strict';

var cache = new Map();
var uppercasePattern = /([A-Z])/g;
var msPattern = /^ms-/;
var voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var ignoreAttributes = new Set(['key', 'innerHTML', '__source']);
var escapeRegExp = /["&'<>]/g;
var escapeLookup = new Map([['"', '&quot;'], ['&', '&amp;'], ["'", '&#39;'], ['<', '&lt;'], ['>', '&gt;']]);

function escaper(match) {
  return escapeLookup.get(match);
}

function escapeHtml(value) {
  return String(value).replace(escapeRegExp, escaper);
}

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
  if (node == null) {
    return '';
  }

  var attributes = node.attributes;

  if (!attributes) {
    return escapeHtml(node);
  }

  var tag = node.nodeName;
  var out = '';
  var footer = '';

  if (tag) {
    out += '<' + tag;
    var keys = Object.keys(attributes);

    for (var i = 0, len = keys.length; i < len; i++) {
      var name = keys[i];
      var value = attributes[name];

      if (!ignoreAttributes.has(name) && typeof value !== 'function') {
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

  var innerHTML = attributes.innerHTML;

  if (innerHTML != null) {
    out += innerHTML;
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

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=hyperapp-render.js.map
