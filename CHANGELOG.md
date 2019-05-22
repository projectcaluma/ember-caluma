# [0.2.0](https://github.com/projectcaluma/ember-caluma/compare/v0.1.0...v0.2.0) (2019-05-22)


### Bug Fixes

* **cf-navigation:** add compute watcher on hidden state ([#225](https://github.com/projectcaluma/ember-caluma/issues/225)) ([41ba470](https://github.com/projectcaluma/ember-caluma/commit/41ba470))
* **cf-navigation:** add minor safety checks ([#217](https://github.com/projectcaluma/ember-caluma/issues/217)) ([cf3ca9e](https://github.com/projectcaluma/ember-caluma/commit/cf3ca9e))
* **deps:** remove obsolete dependency ([be4dbad](https://github.com/projectcaluma/ember-caluma/commit/be4dbad))
* **deps:** update @adfinis-sygroup/semantic-release-config ([2225e00](https://github.com/projectcaluma/ember-caluma/commit/2225e00))
* **deps:** update dependency ember-uikit to ^0.8.0 ([#219](https://github.com/projectcaluma/ember-caluma/issues/219)) ([28a841b](https://github.com/projectcaluma/ember-caluma/commit/28a841b))
* **deps:** update dependency ember-uikit to v0.8.1 ([#223](https://github.com/projectcaluma/ember-caluma/issues/223)) ([b892a50](https://github.com/projectcaluma/ember-caluma/commit/b892a50))
* **deps:** update dependency graphql to v14.3.0 ([#208](https://github.com/projectcaluma/ember-caluma/issues/208)) ([6cf38cc](https://github.com/projectcaluma/ember-caluma/commit/6cf38cc))
* **deps:** update dependency sass to v1.20.1 ([#196](https://github.com/projectcaluma/ember-caluma/issues/196)) ([1d7a944](https://github.com/projectcaluma/ember-caluma/commit/1d7a944))
* **field:** drop running requests on next ([aa5f99c](https://github.com/projectcaluma/ember-caluma/commit/aa5f99c))
* **field:** fix invalid state of a field ([8c3d6b4](https://github.com/projectcaluma/ember-caluma/commit/8c3d6b4))
* **form builder:** fix handling of existing metadata ([4d9071f](https://github.com/projectcaluma/ember-caluma/commit/4d9071f))
* **form builder:** fix usage of nested properties in the question editor ([97a59a5](https://github.com/projectcaluma/ember-caluma/commit/97a59a5))
* **ie 11:** add "manual" polyfill for array.flat ([#199](https://github.com/projectcaluma/ember-caluma/issues/199)) ([fde3a0f](https://github.com/projectcaluma/ember-caluma/commit/fde3a0f))
* **mirage:** update mirage schema and fix generic scalar type ([c1cdaa1](https://github.com/projectcaluma/ember-caluma/commit/c1cdaa1))
* **navigation:** fix document states in navigation ([480b67b](https://github.com/projectcaluma/ember-caluma/commit/480b67b))
* **powerselect:** render correct slected option for choice questions ([#254](https://github.com/projectcaluma/ember-caluma/issues/254)) ([837ca8c](https://github.com/projectcaluma/ember-caluma/commit/837ca8c))
* **table:** dialog didn't reopen ([#243](https://github.com/projectcaluma/ember-caluma/issues/243)) ([7754585](https://github.com/projectcaluma/ember-caluma/commit/7754585))
* **table:** disable form in table on disabled question ([c79a380](https://github.com/projectcaluma/ember-caluma/commit/c79a380))
* **table:** fix table rendering for dynamic choice fields ([#239](https://github.com/projectcaluma/ember-caluma/issues/239)) ([5d40c13](https://github.com/projectcaluma/ember-caluma/commit/5d40c13))
* **translations:** add missing translations ([e786b52](https://github.com/projectcaluma/ember-caluma/commit/e786b52))
* consider empty but required fields ([#220](https://github.com/projectcaluma/ember-caluma/issues/220)) ([3538471](https://github.com/projectcaluma/ember-caluma/commit/3538471))
* **validation:** add validation for static, fix multiple choice ([#228](https://github.com/projectcaluma/ember-caluma/issues/228)) ([7ab76a7](https://github.com/projectcaluma/ember-caluma/commit/7ab76a7))
* do not display warning if no override ([3c2bf1d](https://github.com/projectcaluma/ember-caluma/commit/3c2bf1d))
* remove jexl logic and hide toggle ([#233](https://github.com/projectcaluma/ember-caluma/issues/233)) ([9627dec](https://github.com/projectcaluma/ember-caluma/commit/9627dec))


### Features

* **cf-form:** all passing context information to cf-form, cf-navigation ([7372e4d](https://github.com/projectcaluma/ember-caluma/commit/7372e4d))
* **cf-form:** allow passing context information to cf-form, cf-navigation ([#218](https://github.com/projectcaluma/ember-caluma/issues/218)) ([2955dc6](https://github.com/projectcaluma/ember-caluma/commit/2955dc6))
* add jexl textarea for isRequired ([#232](https://github.com/projectcaluma/ember-caluma/issues/232)) ([7b3e16a](https://github.com/projectcaluma/ember-caluma/commit/7b3e16a))
* add table column display configuration ([#237](https://github.com/projectcaluma/ember-caluma/issues/237)) ([88a1ae9](https://github.com/projectcaluma/ember-caluma/commit/88a1ae9)), closes [#236](https://github.com/projectcaluma/ember-caluma/issues/236)
* **cf-navigation:** add disabled attribute ([#242](https://github.com/projectcaluma/ember-caluma/issues/242)) ([926b9de](https://github.com/projectcaluma/ember-caluma/commit/926b9de))
* **cf-navigation:** add possibility to pass custom headers ([#255](https://github.com/projectcaluma/ember-caluma/issues/255)) ([16e4448](https://github.com/projectcaluma/ember-caluma/commit/16e4448))
* **form:** enable widget overrides for forms ([581de15](https://github.com/projectcaluma/ember-caluma/commit/581de15))
* **jexl:** support jexl referencing TableQuestions ([#229](https://github.com/projectcaluma/ember-caluma/issues/229)) ([858d95e](https://github.com/projectcaluma/ember-caluma/commit/858d95e))
* **table:** remove action buttons in disabled state ([#238](https://github.com/projectcaluma/ember-caluma/issues/238)) ([9037a3b](https://github.com/projectcaluma/ember-caluma/commit/9037a3b))
* **table:** show spinner while saving ([fe4fc33](https://github.com/projectcaluma/ember-caluma/commit/fe4fc33))

## [0.1.0](https://github.com/projectcaluma/ember-caluma/compare/v0.0.4...v0.1.0) (2019-05-08)

### Bug Fixes

- **cf-navigation:** auto-link empty form sections to first subsection ([#185](https://github.com/projectcaluma/ember-caluma/issues/185)) ([a50a442](https://github.com/projectcaluma/ember-caluma/commit/a50a442))
- **deps:** downgrade to jexl 1.x for IE 11 compat ([#197](https://github.com/projectcaluma/ember-caluma/issues/197)) ([cca7d03](https://github.com/projectcaluma/ember-caluma/commit/cca7d03))
- **deps:** Move ember-cli-showdown to dependencies ([#171](https://github.com/projectcaluma/ember-caluma/issues/171)) ([2dca978](https://github.com/projectcaluma/ember-caluma/commit/2dca978))
- **deps:** update dependency ember-cli-sass to v10 ([#32](https://github.com/projectcaluma/ember-caluma/issues/32)) ([2877c64](https://github.com/projectcaluma/ember-caluma/commit/2877c64))
- **deps:** update dependency ember-composable-helpers to v2.3.1 ([#156](https://github.com/projectcaluma/ember-caluma/issues/156)) ([0a1498d](https://github.com/projectcaluma/ember-caluma/commit/0a1498d))
- **info:** replace drop by modal ([#193](https://github.com/projectcaluma/ember-caluma/issues/193)) ([ea2a026](https://github.com/projectcaluma/ember-caluma/commit/ea2a026))
- **jexl:** add custom intersects operator to jexl AST parser ([#183](https://github.com/projectcaluma/ember-caluma/issues/183)) ([30ddf10](https://github.com/projectcaluma/ember-caluma/commit/30ddf10))
- **jexl:** don't consider the value of hidden fields in JEXL expr. ([#198](https://github.com/projectcaluma/ember-caluma/issues/198)) ([f934741](https://github.com/projectcaluma/ember-caluma/commit/f934741))
- **table:** render download links for file questions in tables ([#187](https://github.com/projectcaluma/ember-caluma/issues/187)) ([25cfd80](https://github.com/projectcaluma/ember-caluma/commit/25cfd80))
- **translations:** add missing german translations ([#152](https://github.com/projectcaluma/ember-caluma/issues/152)) ([dba21ec](https://github.com/projectcaluma/ember-caluma/commit/dba21ec))
- **validation:** ignore hidden required fields ([#175](https://github.com/projectcaluma/ember-caluma/issues/175)) ([2d1f490](https://github.com/projectcaluma/ember-caluma/commit/2d1f490))

### Features

- **form:** add support for static question ([#169](https://github.com/projectcaluma/ember-caluma/issues/169)) ([17afa26](https://github.com/projectcaluma/ember-caluma/commit/17afa26))
- **jexl:** add "interesects" binary operator ([#176](https://github.com/projectcaluma/ember-caluma/issues/176)) ([502c747](https://github.com/projectcaluma/ember-caluma/commit/502c747))
- **jexl:** add cross-form jexl resolution ([#154](https://github.com/projectcaluma/ember-caluma/issues/154)) ([c137e29](https://github.com/projectcaluma/ember-caluma/commit/c137e29)), closes [/github.com/projectcaluma/caluma/pull/398#discussion_r279346810](https://github.com//github.com/projectcaluma/caluma/pull/398/issues/discussion_r279346810)
- **jexl:** add support for multiline expressions ([#177](https://github.com/projectcaluma/ember-caluma/issues/177)) ([8fb2b6b](https://github.com/projectcaluma/ember-caluma/commit/8fb2b6b))
- **tooling:** add semantic release ([#200](https://github.com/projectcaluma/ember-caluma/issues/200)) ([64b943c](https://github.com/projectcaluma/ember-caluma/commit/64b943c))

## [0.0.4](https://github.com/projectcaluma/ember-caluma/compare/v0.0.3...v0.0.4) (2019-04-18)

### Breaking changes

- The new service `caluma-options` needs to be added to the engine config in `app.js`:
  ```js
  engines: {
    emberCaluma: {
      dependencies: {
        services: [
          "apollo",
          "notification",
          "router",
          "intl",
          "caluma-options"
        ];
      }
    }
  }
  ```

### Added

- Form and question namespacing support (#115, #116)
- `caluma-options` service for dynamic configuration (#97)
- Component overrides (#66, #96)
- cf-navigation for nested forms (#69, #103, #119, #131)
- Table question rendering (#59)

## [0.0.3](https://github.com/projectcaluma/ember-caluma/compare/v0.0.2...v0.0.3) (2019-03-13)

### Breaking changes

- Fix 'missing translations' errors by adding `intl` to the dependencies.

  Migration guide: Add the `intl` service to the `dependencies` list in `app.js`:

  ```js
  engines: {
    emberCaluma: {
      dependencies: {
        services: ["apollo", "notification", "router", "intl"];
      }
    }
  }
  ```

### Added

- Single and multiple choice questions now offer a dropdown widget.
- New question type "Table" (just administration, no rendering yet)

### Changed

- Archived questions now visible (and marked as archived) on assigned forms.

## [0.0.2](https://github.com/projectcaluma/ember-caluma/compare/v0.0.1...v0.0.2) (2019-03-01)

### Added

- Archived and published toggles for forms and questions.

## 0.0.1 (2019-01-18)
