/*! Hyperapp Render v3.5.0 | MIT Licence | https://github.com/kriasoft/hyperapp-render */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hyperappRender = {}));
}(this, (function (exports) { 'use strict';

  var isArray = Array.isArray;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var styleNameCache = new Map();
  var uppercasePattern = /[A-Z]/g;
  var msPattern = /^ms-/;
  var escapeRegExp = /["&'<>]/;
  var voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  function escapeHtml(value) {
    var str = '' + value;

    if (typeof value === 'number') {
      return str;
    }

    var match = escapeRegExp.exec(str);

    if (!match) {
      return str;
    }

    var index = match.index;
    var lastIndex = 0;
    var out = '';

    for (var _escape = ''; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34:
          _escape = '&quot;';
          break;

        case 38:
          _escape = '&amp;';
          break;

        case 39:
          _escape = '&#39;';
          break;

        case 60:
          _escape = '&lt;';
          break;

        case 62:
          _escape = '&gt;';
          break;

        default:
          continue;
      }

      if (lastIndex !== index) {
        out += str.substring(lastIndex, index);
      }

      lastIndex = index + 1;
      out += _escape;
    }

    return lastIndex !== index ? out + str.substring(lastIndex, index) : out;
  }
  function concatClassNames(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      return value || '';
    }

    var out = '';
    var delimiter = '';

    if (isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        var name = concatClassNames(value[i]);

        if (name !== '') {
          out += delimiter + name;
          delimiter = ' ';
        }
      }
    } else {
      for (var _name in value) {
        if (hasOwnProperty.call(value, _name) && value[_name]) {
          out += delimiter + _name;
          delimiter = ' ';
        }
      }
    }

    return out;
  }

  function hyphenateStyleName(styleName) {
    if (!styleNameCache.has(styleName)) {
      var name = styleName.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-');
      styleNameCache.set(styleName, name);
    }

    return styleNameCache.get(styleName);
  }

  function stringifyStyles(style) {
    var out = '';
    var delimiter = '';

    for (var name in style) {
      if (hasOwnProperty.call(style, name)) {
        var value = style[name];

        if (value != null) {
          if (name === 'cssText') {
            out += delimiter + value;
          } else {
            out += delimiter + hyphenateStyleName(name) + ':' + value;
          }

          delimiter = ';';
        }
      }
    }

    return out;
  }

  function renderFragment(name, props, children, stack) {
    var out = '';
    var footer = '';

    if (name) {
      out += '<' + name;

      for (var prop in props) {
        if (hasOwnProperty.call(props, prop)) {
          var value = props[prop];

          if (value != null && prop !== 'key' && prop !== 'innerHTML' && prop !== '__source' && !(prop[0] === 'o' && prop[1] === 'n')) {
            if (prop === 'class' || prop === 'className') {
              prop = 'class';
              value = concatClassNames(value) || false;
            } else if (prop === 'style' && typeof value === 'object') {
              value = stringifyStyles(value) || false;
            }

            if (value !== false) {
              out += ' ' + prop;

              if (value !== true) {
                out += '="' + escapeHtml(value) + '"';
              }
            }
          }
        }
      }

      if (voidElements.has(name)) {
        out += '/>';
      } else {
        out += '>';
        footer = '</' + name + '>';
      }
    }

    if (children.length > 0) {
      stack.push({
        childIndex: 0,
        children: children,
        footer: footer
      });
    } else {
      var innerHTML = props.innerHTML;

      if (innerHTML != null) {
        out += innerHTML;
      }

      out += footer;
    }

    return out;
  }

  function resolveNode(node, state, actions) {
    if (typeof node === 'function') {
      return resolveNode(node(state, actions), state, actions);
    }

    if (node && node.type === 2) {
      return resolveNode(node.lazy.view(node.lazy), state, actions);
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
            if (isArray(node)) {
              stack.push({
                childIndex: 0,
                children: node,
                footer: ''
              });
            } else if (node.tag === 3) {
              out += escapeHtml(node.type);
            } else if (node.type === 3) {
              out += escapeHtml(node.name);
            } else if (typeof node === 'object') {
              out += renderFragment(node.name || node.type || node.nodeName, node.props || node.attributes, node.children, stack);
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

  exports.renderToString = renderToString;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=hyperapp-render.js.map
