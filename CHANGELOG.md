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
