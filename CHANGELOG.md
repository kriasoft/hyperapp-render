# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - [Unreleased]

* Rename higher-order app from `render` to `withRender` (breaking change).
* Rename global exports from `window.*` to `window.hyperappRender.*` (breaking change).
* Rename server package from `@hyperapp/render/server` to `@hyperapp/render` (breaking change).
* Add support for
  [lazy components](https://github.com/hyperapp/hyperapp/tree/d91e4667ee4e684eb874235e46ce919f502d4aae#lazy-components).

## [1.3.0] - 2018-02-24

* Scoped npm package name. Use `@hyperapp/render` instead of `hyperapp-render`.
* Render `style` attribute with `cssText` correctly.
* Better performance for numeric attributes.

## [1.2.0] - 2018-02-14

* Ignore [jsx `__source`](https://babeljs.io/docs/plugins/transform-react-jsx-source/) attribute.

## [1.1.0] - 2018-02-07

* Compatibility with Hyperapp [v1.1.0](https://github.com/hyperapp/hyperapp/releases/tag/1.1.0)
  after internal VNode schema change.

## 1.0.0 - 2018-01-24

* Initial public release.

[Unreleased]: https://github.com/hyperapp/render/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/hyperapp/render/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/hyperapp/render/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/hyperapp/render/compare/v1.0.0...v1.1.0
