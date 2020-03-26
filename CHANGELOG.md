# [6.1.0](https://github.com/projectcaluma/ember-caluma/compare/v6.0.0...v6.1.0) (2020-03-26)


### Features

* **jexl:** add info object to context ([#805](https://github.com/projectcaluma/ember-caluma/issues/805)) ([c8ff839](https://github.com/projectcaluma/ember-caluma/commit/c8ff83996591f762fc1037faee902ccf75118631))

# [6.0.0](https://github.com/projectcaluma/ember-caluma/compare/v5.1.0...v6.0.0) (2020-03-25)


### Features

* **deps:** drop support for ember 3.12 ([6fa06e1](https://github.com/projectcaluma/ember-caluma/commit/6fa06e14802c84949be23e670b2f505f40e940eb))
* **utils:** increase slugify max-length to 127 ([3c647ea](https://github.com/projectcaluma/ember-caluma/commit/3c647ea16bea0e88e177bc3713bc63ad1a8fc8de))
* **validation:** add minlength validation for text fields ([b34fc47](https://github.com/projectcaluma/ember-caluma/commit/b34fc47bd523e369d71871c609543838c84beed3))


### BREAKING CHANGES

* **deps:** The support for the former ember LTS version 3.12 was
dropped since we only support the latest LTS version which is now 3.16.

This change happened in 4eaecdb163a7cd6159d488c414dcf2b8afd98c27 where
we forgot to mark it as a breaking change which is why this commit is
empty.

# [5.1.0](https://github.com/projectcaluma/ember-caluma/compare/v5.0.0...v5.1.0) (2020-03-03)


### Features

* **a11y:** various improvements for accessibility ([3185fc8](https://github.com/projectcaluma/ember-caluma/commit/3185fc83e2db128847599f808b4b732e12c16e7a))
* **utils:** increase slugify max-length to 150 ([5c2093e](https://github.com/projectcaluma/ember-caluma/commit/5c2093eb7a0dd5bfd9cd0de7fd42fb673077ec71))

# [5.0.0](https://github.com/projectcaluma/ember-caluma/compare/v4.1.0...v5.0.0) (2020-02-13)


### Bug Fixes

* **form:** do not run validators on empty values ([a3d996e](https://github.com/projectcaluma/ember-caluma/commit/a3d996e36e4063a27e5173ae6da1a6821dc27ea4))


### Features

* remove support for node v8.x ([42f84d3](https://github.com/projectcaluma/ember-caluma/commit/42f84d304d4d9081839e80851d2f8cba83ce2d1b))


### BREAKING CHANGES

* Node v8.x is no longer supported

# [4.1.0](https://github.com/projectcaluma/ember-caluma/compare/v4.0.5...v4.1.0) (2020-01-06)


### Features

* **form:** include parent fields in find field method ([1e5b8ea](https://github.com/projectcaluma/ember-caluma/commit/1e5b8ea4c575c086b63553d2c4f1aa6cde6fb36c))

## [4.0.5](https://github.com/projectcaluma/ember-caluma/compare/v4.0.4...v4.0.5) (2019-12-27)


### Bug Fixes

* remove FormAnswer ([548f1b1](https://github.com/projectcaluma/ember-caluma/commit/548f1b1273f7944047b14f02008d198fcadaef5d))
* **document:** fix wrong computed property key ([544f0aa](https://github.com/projectcaluma/ember-caluma/commit/544f0aaa371f95a9b0f77f788421cf0d789e9e22))
* **form:** add proper table validation ([7c6787b](https://github.com/projectcaluma/ember-caluma/commit/7c6787bf5e78d823bf175f60024eb0ad5db0213e))
* **form:** fix isNew property for empty answers ([2491dbf](https://github.com/projectcaluma/ember-caluma/commit/2491dbf4658ff66573e1db0d815bacdcb5a731db))
* **form:** use parent documents jexl context for table row documents ([aedf903](https://github.com/projectcaluma/ember-caluma/commit/aedf903fed5ec3f3a9756f1d82daffa9b6a573ae))

## [4.0.4](https://github.com/projectcaluma/ember-caluma/compare/v4.0.3...v4.0.4) (2019-12-11)


### Bug Fixes

* **form:** fix JEXL answer transform for table values ([9049a0e](https://github.com/projectcaluma/ember-caluma/commit/9049a0e2dda46236913b84344f1892b0f30dcd58))

## [4.0.3](https://github.com/projectcaluma/ember-caluma/compare/v4.0.2...v4.0.3) (2019-12-06)


### Bug Fixes

* **deps:** update ember-uikit to v2.0.1 ([0b19859](https://github.com/projectcaluma/ember-caluma/commit/0b19859e4ea519a872be10e808becdade2c47721))

## [4.0.2](https://github.com/projectcaluma/ember-caluma/compare/v4.0.1...v4.0.2) (2019-12-02)


### Bug Fixes

* **field:** don't pass `value` to save mutation if null ([4e05609](https://github.com/projectcaluma/ember-caluma/commit/4e05609f19d80c2ad3b4f792b313e165c2908207))

## [4.0.1](https://github.com/projectcaluma/ember-caluma/compare/v4.0.0...v4.0.1) (2019-11-28)


### Bug Fixes

* **form:** fix cf-field-value for choice and multiple choice questions ([2afabb9](https://github.com/projectcaluma/ember-caluma/commit/2afabb99482309b3c4e66e88f9483ab821c536e7))
* change disabled to readonly where applicable ([15f487a](https://github.com/projectcaluma/ember-caluma/commit/15f487a94a1ef893a822909811562a40ede5960a))

# [4.0.0](https://github.com/projectcaluma/ember-caluma/compare/v3.0.1...v4.0.0) (2019-11-21)


### Bug Fixes

* **form:** transform empty string answers to null ([d3a736c](https://github.com/projectcaluma/ember-caluma/commit/d3a736c9445b5e73ba4935d9d415284641478dfe))


### Features

* **form:** allow empty values for answers ([7e52e23](https://github.com/projectcaluma/ember-caluma/commit/7e52e23440a0241d8315d16a5a492ef8ed1d4419))


### BREAKING CHANGES

* **form:** Only works with caluma v4.0.0 (https://github.com/projectcaluma/caluma/pull/791)

## [3.0.1](https://github.com/projectcaluma/ember-caluma/compare/v3.0.0...v3.0.1) (2019-11-06)


### Bug Fixes

* **form:** fix search for powerselect inputs ([34b57fb](https://github.com/projectcaluma/ember-caluma/commit/34b57fbc2861f74cecce4da076b231c9a6969092))

# [3.0.0](https://github.com/projectcaluma/ember-caluma/compare/v2.5.0...v3.0.0) (2019-11-06)


### Bug Fixes

* **jexl:** allow falsey values for intersects operator without breaking ([4fbb73f](https://github.com/projectcaluma/ember-caluma/commit/4fbb73fd790fbe10e1800d598c5df958b6040b28))
* **navigation:** fix navigation to show base form questions ([#565](https://github.com/projectcaluma/ember-caluma/issues/565)) ([5f38df0](https://github.com/projectcaluma/ember-caluma/commit/5f38df0b273bda24a78d6f43af488e5eb623d602)), closes [#460](https://github.com/projectcaluma/ember-caluma/issues/460)
* **table:** don't re-save existing rows after edit ([e5cd5ef](https://github.com/projectcaluma/ember-caluma/commit/e5cd5ef1d2c4562a55d8744a9093d6d4f23529bd))
* **table:** remove row documents on delete ([395e4e4](https://github.com/projectcaluma/ember-caluma/commit/395e4e4f162dbbd5cd28e2acddd724aadf21aaa7))
* **table:** skip empty dates in table view ([97f5758](https://github.com/projectcaluma/ember-caluma/commit/97f5758570aea2f5ff357e6edeb4dc5432a57483))


### chore

* remove support for ember 3.8 ([093d25b](https://github.com/projectcaluma/ember-caluma/commit/093d25b8cf0ee96d3d5d2148163412f1b4903e2c))


### Features

* **form:** handle old values of dynamic questions ([c9bbc36](https://github.com/projectcaluma/ember-caluma/commit/c9bbc36f82de9176ee33efe4eed1fa25864acf7c))
* **license:** switch license from MIT to LGPL-3.0-or-later ([b1163eb](https://github.com/projectcaluma/ember-caluma/commit/b1163ebf8071c1029eb867aae671dc6c059d8d98))


### BREAKING CHANGES

* **license:** Since the LGPL license is more restrictive than MIT,
this is marked as breaking
* **form:** This is a breaking change, since it will only work with
v3.0.0 or later of the caluma service.
* This will remove the support for the second last LTS
version of ember, since we support only the last LTS version which is
3.12 now.

# [2.5.0](https://github.com/projectcaluma/ember-caluma/compare/v2.4.0...v2.5.0) (2019-09-21)


### Bug Fixes

* **input/table:** add btnClose to modals ([5d1b42d](https://github.com/projectcaluma/ember-caluma/commit/5d1b42d))
* **translations:** shorten weekdays for french translations ([#533](https://github.com/projectcaluma/ember-caluma/issues/533)) ([0edca21](https://github.com/projectcaluma/ember-caluma/commit/0edca21))


### Features

* **input/options:** hide archived options ([ffbf840](https://github.com/projectcaluma/ember-caluma/commit/ffbf840))
* **options:** add (un)archive to form-builder ([d1483a3](https://github.com/projectcaluma/ember-caluma/commit/d1483a3))

# [2.4.0](https://github.com/projectcaluma/ember-caluma/compare/v2.3.1...v2.4.0) (2019-09-05)


### Bug Fixes

* **cf-content:** correct policy property name ([91e7b52](https://github.com/projectcaluma/ember-caluma/commit/91e7b52))
* **cfb-options:** options cannot be deleted from db ([3668c66](https://github.com/projectcaluma/ember-caluma/commit/3668c66))
* **ie11:** remove usage of queryManager which breaks in IE11 ([c424c0c](https://github.com/projectcaluma/ember-caluma/commit/c424c0c))


### Features

* **form:** allow forms to have a widget override ([9b25310](https://github.com/projectcaluma/ember-caluma/commit/9b25310))
* **options:** hide archived options ([5cd58d8](https://github.com/projectcaluma/ember-caluma/commit/5cd58d8))
* **table:** prompt before deleting rows ([a9e7b0c](https://github.com/projectcaluma/ember-caluma/commit/a9e7b0c))

## [2.3.1](https://github.com/projectcaluma/ember-caluma/compare/v2.3.0...v2.3.1) (2019-08-23)


### Bug Fixes

* **apollo:** remove deprecated usage of query manager ([e1cab58](https://github.com/projectcaluma/ember-caluma/commit/e1cab58))

# [2.3.0](https://github.com/projectcaluma/ember-caluma/compare/v2.2.3...v2.3.0) (2019-08-21)


### Features

* **translations:** add (partial) french translation ([961d203](https://github.com/projectcaluma/ember-caluma/commit/961d203))

## [2.2.3](https://github.com/projectcaluma/ember-caluma/compare/v2.2.2...v2.2.3) (2019-08-14)


### Bug Fixes

* **cf-content:** fix navigation teardown ([1bfc4d0](https://github.com/projectcaluma/ember-caluma/commit/1bfc4d0))
* **navigation:** truncate long navigation items ([c79c524](https://github.com/projectcaluma/ember-caluma/commit/c79c524))

## [2.2.2](https://github.com/projectcaluma/ember-caluma/compare/v2.2.1...v2.2.2) (2019-08-12)


### Bug Fixes

* **field:** don't delete non-existent answers ([53945b1](https://github.com/projectcaluma/ember-caluma/commit/53945b1))
* **multilang:** remove country code for translations ([1772591](https://github.com/projectcaluma/ember-caluma/commit/1772591))

## [2.2.1](https://github.com/projectcaluma/ember-caluma/compare/v2.2.0...v2.2.1) (2019-07-30)


### Bug Fixes

* **lib:** fix teardown of lib objects ([bd583a2](https://github.com/projectcaluma/ember-caluma/commit/bd583a2))

# [2.2.0](https://github.com/projectcaluma/ember-caluma/compare/v2.1.3...v2.2.0) (2019-07-24)


### Bug Fixes

* **deps:** fix usage of apollo for the new version ([6ec5842](https://github.com/projectcaluma/ember-caluma/commit/6ec5842))


### Features

* **multilang:** add language header to caluma requests as well ([48f976c](https://github.com/projectcaluma/ember-caluma/commit/48f976c))

## [2.1.3](https://github.com/projectcaluma/ember-caluma/compare/v2.1.2...v2.1.3) (2019-07-24)


### Bug Fixes

* **deps:** update dependency sass to v1.22.4 ([74d2810](https://github.com/projectcaluma/ember-caluma/commit/74d2810))
* **deps:** update jexl ([8040e05](https://github.com/projectcaluma/ember-caluma/commit/8040e05))
* **form:** fix premature access to validators which are not yet fetched ([df6a6e6](https://github.com/projectcaluma/ember-caluma/commit/df6a6e6))
* **form:** fix removing of table rows ([5ea7881](https://github.com/projectcaluma/ember-caluma/commit/5ea7881))
* **jexl:** fix handling of whitespace characters ([f783909](https://github.com/projectcaluma/ember-caluma/commit/f783909))
* **performance:** improve loading performance and caching ([7bcedab](https://github.com/projectcaluma/ember-caluma/commit/7bcedab))
* **performance:** improve performance of state calculations ([cb46c5b](https://github.com/projectcaluma/ember-caluma/commit/cb46c5b))
* **tests:** add failing test for whitespace jexl expressions ([ba7d236](https://github.com/projectcaluma/ember-caluma/commit/ba7d236))

## [2.1.2](https://github.com/projectcaluma/ember-caluma/compare/v2.1.1...v2.1.2) (2019-07-11)


### Bug Fixes

* **deps:** update dependency ember-auto-import to v1.5.2 ([755af94](https://github.com/projectcaluma/ember-caluma/commit/755af94))
* **form:** fix saving of table answers ([ad88efb](https://github.com/projectcaluma/ember-caluma/commit/ad88efb))
* **lib:** fix recomputing of the optional state ([13f4fee](https://github.com/projectcaluma/ember-caluma/commit/13f4fee))

## [2.1.1](https://github.com/projectcaluma/ember-caluma/compare/v2.1.0...v2.1.1) (2019-07-09)


### Bug Fixes

* **form-builder:** make sure apollo is initialized properly ([8496daa](https://github.com/projectcaluma/ember-caluma/commit/8496daa))
* **intl:** update deprecated macro to new syntax ([565f18a](https://github.com/projectcaluma/ember-caluma/commit/565f18a))

# [2.1.0](https://github.com/projectcaluma/ember-caluma/compare/v2.0.3...v2.1.0) (2019-07-09)


### Bug Fixes

* **deps:** update dependency ember-auto-import to v1.5.0 ([67a1328](https://github.com/projectcaluma/ember-caluma/commit/67a1328))
* **deps:** update dependency ember-fetch to v6.7.0 ([c2a0d5a](https://github.com/projectcaluma/ember-caluma/commit/c2a0d5a))
* **deps:** update dependency ember-intl to v4.0.1 ([2f3c772](https://github.com/projectcaluma/ember-caluma/commit/2f3c772))
* **form:** fix removing of empty answers ([bd6eb15](https://github.com/projectcaluma/ember-caluma/commit/bd6eb15))


### Features

* add format validation to text and textarea ([de6d46f](https://github.com/projectcaluma/ember-caluma/commit/de6d46f))

  This requires the host app to pass the new `validator` service to the form-builder engine:
  ```js
  // app/app.js
  const App = Application.extend({
    // ...

    engines: {
      emberCaluma: {
        dependencies: {
          services: [
            // ...
            "validator"
          ]
        }
      }
    }
  });
  ```

## [2.0.3](https://github.com/projectcaluma/ember-caluma/compare/v2.0.2...v2.0.3) (2019-07-05)


### Bug Fixes

* **deps:** update dependency graphql to v14.4.2 ([1d3c2ba](https://github.com/projectcaluma/ember-caluma/commit/1d3c2ba))
* **deps:** update dependency sass to v1.22.3 ([2f0b59e](https://github.com/projectcaluma/ember-caluma/commit/2f0b59e))
* **dummy:** change cf-form to cf-content ([46db6aa](https://github.com/projectcaluma/ember-caluma/commit/46db6aa))
* **lib:** fix library object initialization to prevent loops ([86f14dc](https://github.com/projectcaluma/ember-caluma/commit/86f14dc))
* **uk-modal:** add DDAU handler ([c0f3130](https://github.com/projectcaluma/ember-caluma/commit/c0f3130))

## [2.0.2](https://github.com/projectcaluma/ember-caluma/compare/v2.0.1...v2.0.2) (2019-07-03)


### Bug Fixes

* **form:** fix new state of fields and fieldset initialization ([03a1b7c](https://github.com/projectcaluma/ember-caluma/commit/03a1b7c))

## [2.0.1](https://github.com/projectcaluma/ember-caluma/compare/v2.0.0...v2.0.1) (2019-07-02)


### Bug Fixes

* **ie11:** fix checkboxes in IE11 ([6131128](https://github.com/projectcaluma/ember-caluma/commit/6131128))

# [2.0.0](https://github.com/projectcaluma/ember-caluma/compare/v1.2.4...v2.0.0) (2019-07-02)


### Features

* **lib:** support flat answers ([b602056](https://github.com/projectcaluma/ember-caluma/commit/b602056))


### BREAKING CHANGES

* **lib:** The whole lib layer changed since we moved to the new
API structure. However, the cf-content component still works the same
way as before.

## [1.2.4](https://github.com/projectcaluma/ember-caluma/compare/v1.2.3...v1.2.4) (2019-07-02)


### Bug Fixes

* **deps:** update dependency sass to v1.22.2 ([3881d3c](https://github.com/projectcaluma/ember-caluma/commit/3881d3c))
* **deps:** update ember infrastructure ([7a63a38](https://github.com/projectcaluma/ember-caluma/commit/7a63a38))
* **form:** fix wrong updating of the answer value ([091831e](https://github.com/projectcaluma/ember-caluma/commit/091831e))

## [1.2.3](https://github.com/projectcaluma/ember-caluma/compare/v1.2.2...v1.2.3) (2019-07-01)


### Bug Fixes

* **deps:** update dependency ember-fetch to v6.6.0 ([cfc9e85](https://github.com/projectcaluma/ember-caluma/commit/cfc9e85))
* **deps:** update dependency ember-math-helpers to v2.11.3 ([bd205da](https://github.com/projectcaluma/ember-caluma/commit/bd205da))
* **deps:** update dependency graphql to v14.4.0 ([ed9fdb4](https://github.com/projectcaluma/ember-caluma/commit/ed9fdb4))
* **deps:** update dependency graphql to v14.4.1 ([c0bf301](https://github.com/projectcaluma/ember-caluma/commit/c0bf301))
* **deps:** update dependency sass to v1.22.1 ([9a86dc0](https://github.com/projectcaluma/ember-caluma/commit/9a86dc0))
* **form:** fix resetting of values on slow input ([e07388a](https://github.com/projectcaluma/ember-caluma/commit/e07388a))

## [1.2.2](https://github.com/projectcaluma/ember-caluma/compare/v1.2.1...v1.2.2) (2019-06-25)


### Bug Fixes

* **deps:** update dependency ember-cli-string-helpers to v3 ([fc4d0c3](https://github.com/projectcaluma/ember-caluma/commit/fc4d0c3))
* **deps:** update dependency ember-math-helpers to v2.11.2 ([13241bc](https://github.com/projectcaluma/ember-caluma/commit/13241bc))
* **deps:** update dependency graphql-tools to v4.0.5 ([094f60c](https://github.com/projectcaluma/ember-caluma/commit/094f60c))
* **deps:** update dependency sass to v1.22.0 ([4d94453](https://github.com/projectcaluma/ember-caluma/commit/4d94453))
* **form:** add missing validation function for form questions ([c9a4a0f](https://github.com/projectcaluma/ember-caluma/commit/c9a4a0f))
* **form:** fix answer handling of powerselect widget ([cb37130](https://github.com/projectcaluma/ember-caluma/commit/cb37130))
* **form:** fix loading of subforms and improve error handling ([b47cd4d](https://github.com/projectcaluma/ember-caluma/commit/b47cd4d))
* **form:** fix wrong answer when clicking checkboxes too fast ([8b8bc30](https://github.com/projectcaluma/ember-caluma/commit/8b8bc30))
* **table:** allow tables to have documents as value ([017515f](https://github.com/projectcaluma/ember-caluma/commit/017515f))

## [1.2.1](https://github.com/projectcaluma/ember-caluma/compare/v1.2.0...v1.2.1) (2019-06-19)


### Bug Fixes

* **table:** fix answer handling of table questions ([7923168](https://github.com/projectcaluma/ember-caluma/commit/7923168))

# [1.2.0](https://github.com/projectcaluma/ember-caluma/compare/v1.1.0...v1.2.0) (2019-06-18)


### Bug Fixes

* **deps:** update dependency ember-cli-babel to v7.8.0 ([c46c575](https://github.com/projectcaluma/ember-caluma/commit/c46c575))


### Features

* **form:** pass form and root form as context for jexl expressions ([619ef0c](https://github.com/projectcaluma/ember-caluma/commit/619ef0c))

# [1.1.0](https://github.com/projectcaluma/ember-caluma/compare/v1.0.2...v1.1.0) (2019-06-17)


### Bug Fixes

* **babel:** remove obsolete babel config ([53846bf](https://github.com/projectcaluma/ember-caluma/commit/53846bf))
* **deps:** remove tough-cookie resolution ([9dd9506](https://github.com/projectcaluma/ember-caluma/commit/9dd9506))
* **deps:** update dependency apollo-link-context to v1.0.18 ([5449909](https://github.com/projectcaluma/ember-caluma/commit/5449909))
* **deps:** update dependency ember-auto-import to v1.4.1 ([144e81c](https://github.com/projectcaluma/ember-caluma/commit/144e81c))
* **deps:** update dependency ember-intl to v4 ([3536974](https://github.com/projectcaluma/ember-caluma/commit/3536974))
* **form builder:** fix float inputs ([6c111e5](https://github.com/projectcaluma/ember-caluma/commit/6c111e5))
* **intl:** update the ember-intl config to the latest version ([41522fa](https://github.com/projectcaluma/ember-caluma/commit/41522fa))


### Features

* **form:** prevent displaying of empty forms ([5cbf7d3](https://github.com/projectcaluma/ember-caluma/commit/5cbf7d3))

## [1.0.2](https://github.com/projectcaluma/ember-caluma/compare/v1.0.1...v1.0.2) (2019-06-13)


### Bug Fixes

* **deps:** remove dependency to liquid-fire ([d0d7d60](https://github.com/projectcaluma/ember-caluma/commit/d0d7d60))
* **deps:** update dependency ember-auto-import to v1.4.0 ([5a86384](https://github.com/projectcaluma/ember-caluma/commit/5a86384))
* **deps:** update dependency ember-changeset to v2.1.2 ([b2c2e95](https://github.com/projectcaluma/ember-caluma/commit/b2c2e95))
* **deps:** update dependency ember-concurrency to v1 ([e29c588](https://github.com/projectcaluma/ember-caluma/commit/e29c588))
* **deps:** update dependency ember-uikit to v0.8.2 ([4990142](https://github.com/projectcaluma/ember-caluma/commit/4990142))
* **deps:** update dependency sass to v1.21.0 ([ea032d5](https://github.com/projectcaluma/ember-caluma/commit/ea032d5))
* **form:** improve initial loading performance ([fa4046b](https://github.com/projectcaluma/ember-caluma/commit/fa4046b))
* **linting:** fix linting error happening since the prettier update ([9d61840](https://github.com/projectcaluma/ember-caluma/commit/9d61840))
* **table-date:** correctly render date questions in table rows ([b07aa82](https://github.com/projectcaluma/ember-caluma/commit/b07aa82))

## [1.0.1](https://github.com/projectcaluma/ember-caluma/compare/v1.0.0...v1.0.1) (2019-06-06)


### Bug Fixes

* **form:** allow stacking of info modals ([bab5166](https://github.com/projectcaluma/ember-caluma/commit/bab5166))

# [1.0.0](https://github.com/projectcaluma/ember-caluma/compare/v0.3.0...v1.0.0) (2019-05-31)


### Bug Fixes

* **deps:** update dependency ember-changeset to v2.1.1 ([e0be925](https://github.com/projectcaluma/ember-caluma/commit/e0be925))
* **deps:** update dependency ember-cli-string-helpers to v2.1.0 ([e2d77c5](https://github.com/projectcaluma/ember-caluma/commit/e2d77c5))
* **deps:** update dependency ember-concurrency to v0.10.1 ([c8259be](https://github.com/projectcaluma/ember-caluma/commit/c8259be))
* **deps:** update dependency graphql to v14.3.1 ([782a11e](https://github.com/projectcaluma/ember-caluma/commit/782a11e))
* **deps:** update ember-cli-mirage to v1.0.0 ([0ff0e23](https://github.com/projectcaluma/ember-caluma/commit/0ff0e23))


### Features

* **mirage:** add option to disable mirage support ([93531d1](https://github.com/projectcaluma/ember-caluma/commit/93531d1))
* **navigation:** add previous / next pagination ([6aea609](https://github.com/projectcaluma/ember-caluma/commit/6aea609))
* **navigation:** allow customization of the navigation ([fe61ca8](https://github.com/projectcaluma/ember-caluma/commit/fe61ca8))


### BREAKING CHANGES

* **navigation:** this changes the way a form is used in the host
application. Before, the `cf-navigation` component rendered the whole
navigation and the form in it. Now there is a wrapper component
`cf-content` which yields or renders the form and the navigation. This
way the host app is able to customize where to render the navigation and
the form. Also the host app does not need to pass the `section` and
`subSection` query parameters since they are taken directly from the
router.

Before:
```hbs
{{cf-navigation
  documentId=documentId
  context=context
  section=section
  subSection=subSection
}}
```

After:
```hbs
{{cf-content documentId=documentId context=context}}
```
* **deps:** This change requires the users of ember-caluma to
manually add faker and ember-auto-import to their devDependencies:

`yarn add -D faker ember-auto-import`

This is necessary because ember-cli-mirage stopped including faker in
their build. Since we expose factories using faker to the host app, they
need to install this.

# [0.3.0](https://github.com/projectcaluma/ember-caluma/compare/v0.2.0...v0.3.0) (2019-05-27)


### Features

* **field:** recompute optional property on value or hidden changes ([fd18d43](https://github.com/projectcaluma/ember-caluma/commit/fd18d43))

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
