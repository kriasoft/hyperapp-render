# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.4.0] - 2020-05-25

- Hybrid npm package with both CommonJS and ESM versions
  ([#20](https://github.com/kriasoft/hyperapp-render/pull/20)).

## [3.3.0] - 2020-05-20

- Add `unpkg`, `jsdelivr` and `exports` fields to package.json
  ([#18](https://github.com/kriasoft/hyperapp-render/pull/18)).

## [3.2.0] - 2020-05-14

- Add support for `Lazy` component from Hyperapp v2
  ([#16](https://github.com/kriasoft/hyperapp-render/pull/16)).

## [3.1.0] - 2019-03-18

- Ignore `innerHTML` attribute when child nodes exist.
- Fix styles rendering in IE11 ([#14](https://github.com/kriasoft/hyperapp-render/pull/14)).

## [3.0.0] - 2018-11-15

- [BREAKING] Remove higher-order app `withRender` from the library due to redundancy.
- Support for `className` attribute and allow to use array and object as a value.
- Compatibility with upcoming [Hyperapp V2](https://github.com/hyperapp/hyperapp/pull/726).
- Various performance optimizations.

## [2.1.0] - 2018-07-11

- Add [TypeScript](https://www.typescriptlang.org/) typings.

## [2.0.0] - 2018-03-19

- [BREAKING] Rename higher-order app from `render` to `withRender`.
- [BREAKING] Rename global exports from `window.*` to `window.hyperappRender.*`.
- [BREAKING] Rename server package from `hyperapp-render/server` to `hyperapp-render`.
- Add support for [lazy components](https://github.com/hyperapp/hyperapp/tree/1.2.0#lazy-components).

## [1.3.0] - 2018-02-24

- Render `style` attribute with `cssText` correctly.
- Better performance for numeric attributes.

## [1.2.0] - 2018-02-14

- Ignore [jsx `__source`](https://babeljs.io/docs/plugins/transform-react-jsx-source/) attribute.

## [1.1.0] - 2018-02-07

- Compatibility with Hyperapp [v1.1.0](https://github.com/hyperapp/hyperapp/releases/tag/1.1.0)
  after internal VNode schema change.

## 1.0.0 - 2018-01-24

- Initial public release.

[unreleased]: https://github.com/kriasoft/hyperapp-render/compare/v3.4.0...HEAD
[3.4.0]: https://github.com/kriasoft/hyperapp-render/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/kriasoft/hyperapp-render/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/kriasoft/hyperapp-render/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/kriasoft/hyperapp-render/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/kriasoft/hyperapp-render/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/kriasoft/hyperapp-render/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/kriasoft/hyperapp-render/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/kriasoft/hyperapp-render/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/kriasoft/hyperapp-render/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/kriasoft/hyperapp-render/compare/v1.0.0...v1.1.0
