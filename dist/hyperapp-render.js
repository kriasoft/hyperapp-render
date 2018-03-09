/*! Hyperapp Render | MIT Licence | https://github.com/hyperapp/render */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.hyperappRender = {})));
}(this, (function (exports) { 'use strict';

var styleNameCache = new Map();
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
  if (typeof value === 'number') {
    return '' + value;
  }

  return ('' + value).replace(escapeRegExp, escaper);
}

function hyphenateStyleName(styleName) {
  return styleNameCache.get(styleName) || styleNameCache.set(styleName, styleName.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-')).get(styleName);
}

function stringifyStyles(styles) {
  var out = '';
  var delimiter = '';
  var styleNames = Object.keys(styles);

  for (var i = 0; i < styleNames.length; i++) {
    var styleName = styleNames[i];
    var styleValue = styles[styleName];

    if (styleValue != null) {
      if (styleName === 'cssText') {
        out += delimiter + styleValue;
      } else {
        out += delimiter + hyphenateStyleName(styleName) + ':' + styleValue;
      }

      delimiter = ';';
    }
  }

  return out || null;
}

function renderFragment(_ref, stack) {
  var nodeName = _ref.nodeName,
      attributes = _ref.attributes,
      children = _ref.children;
  var out = '';
  var footer = '';

  if (nodeName) {
    out += '<' + nodeName;
    var keys = Object.keys(attributes);

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      var value = attributes[name];

      if (name === 'style' && value && typeof value === 'object') {
        value = stringifyStyles(value);
      }

      if (value != null && value !== false && typeof value !== 'function' && !ignoreAttributes.has(name)) {
        out += ' ' + name;

        if (value !== true) {
          out += '="' + escapeHtml(value) + '"';
        }
      }
    }

    if (voidElements.has(nodeName)) {
      out += '/>';
    } else {
      out += '>';
      footer = '</' + nodeName + '>';
    }
  }

  var innerHTML = attributes.innerHTML;

  if (innerHTML != null) {
    out += innerHTML;
  }

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

function resolveNode(node, state, actions) {
  if (typeof node === 'function') {
    return resolveNode(node(state, actions), state, actions);
  }

  return node;
}

function renderer(view, state, actions) {
  var stack = [{
    childIndex: 0,
    children: [view],
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
        var node = resolveNode(frame.children[frame.childIndex++], state, actions);

        if (node != null && typeof node !== 'boolean') {
          if (node.pop) {
            stack.push({
              childIndex: 0,
              children: node,
              footer: ''
            });
          } else if (node.attributes) {
            out += renderFragment(node, stack);
          } else {
            out += escapeHtml(node);
          }
        }
      }
    }

    return out;
  };
}
function renderToString(view, state, actions) {
  return renderer(view, state, actions)(Infinity);
}
function withRender(nextApp) {
  return function (initialState, actionsTemplate, view, container) {
    var actions = nextApp(initialState, Object.assign({}, actionsTemplate, {
      getState: function getState() {
        return function (state) {
          return state;
        };
      }
    }), view, container);

    actions.toString = function () {
      return renderToString(view, actions.getState(), actions);
    };

    return actions;
  };
}

exports.renderer = renderer;
exports.renderToString = renderToString;
exports.withRender = withRender;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=hyperapp-render.js.map
