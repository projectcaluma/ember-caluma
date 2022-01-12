# [@projectcaluma/ember-core-v11.0.0-beta.1](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v10.1.0...@projectcaluma/ember-core-v11.0.0-beta.1) (2022-01-07)


### Bug Fixes

* **core:** override apollo service instead of serving a mixin ([e86796e](https://github.com/projectcaluma/ember-caluma/commit/e86796e801dc5a2a5b1331b87bc9261509443605)), closes [#529](https://github.com/projectcaluma/ember-caluma/issues/529)
* **core:** update has-question-type helper to work with the new form lib ([217ec34](https://github.com/projectcaluma/ember-caluma/commit/217ec34c71f4176da33306a2d322bf3b5936f15b))
* **deps:** update @projectcaluma/ember-testing [skip ci] ([0c339df](https://github.com/projectcaluma/ember-caluma/commit/0c339df93880ffba0023552fa326b313df7bcec3))


### chore

* remove support for IE11 ([b6d002e](https://github.com/projectcaluma/ember-caluma/commit/b6d002e002a5caf7549af19a67ecfab5e22fc3e9))


### Features

* **query:** add function for usage with ember-resources ([dd8d5b5](https://github.com/projectcaluma/ember-caluma/commit/dd8d5b594e417f7fa957d06a1d2435d4acbfa939))


### BREAKING CHANGES

* **core:** The apollo service mixin was removed in favor of
directly overriding the service. For more information on how to migrate,
please visit the v11 migration guide.
* This removes all support for Internet Explorer 11.

# [@projectcaluma/ember-core-v10.1.0](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v10.0.2...@projectcaluma/ember-core-v10.1.0) (2021-12-15)


### Features

* **distribution:** add read only view of distribution engine ([ac2c46a](https://github.com/projectcaluma/ember-caluma/commit/ac2c46aeec9c3f6aec4e450a84f2469d38ba6c14))

# [@projectcaluma/ember-core-v10.0.2](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v10.0.1...@projectcaluma/ember-core-v10.0.2) (2021-11-26)


### Bug Fixes

* **deps:** update @projectcaluma/ember-testing [skip ci] ([90a4a05](https://github.com/projectcaluma/ember-caluma/commit/90a4a056baea2fe8b4d080f5de20c774d6224ed7))

# [@projectcaluma/ember-core-v10.0.1](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v10.0.0...@projectcaluma/ember-core-v10.0.1) (2021-11-25)


### Bug Fixes

* **scheduler:** allow possible asynchronous resolver callbacks ([836ab67](https://github.com/projectcaluma/ember-caluma/commit/836ab670e59f1905490cd007cea41e9406517991))

# [@projectcaluma/ember-core-v10.0.0](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.2.0...@projectcaluma/ember-core-v10.0.0) (2021-11-25)


### Bug Fixes

* **resolver:** fix concurrency issues with resolver helper ([7f09834](https://github.com/projectcaluma/ember-caluma/commit/7f09834b07437ecd91c548601b81360176717481))


### chore

* **deps:** update dependencies and drop support for node 10 ([51d6dee](https://github.com/projectcaluma/ember-caluma/commit/51d6deeda9811518622ba0cefd8d3876651dab4f))


### BREAKING CHANGES

* **deps:** Remove support for node v10

# [@projectcaluma/ember-core-v9.2.0](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.1.0...@projectcaluma/ember-core-v9.2.0) (2021-11-16)


### Bug Fixes

* **query:** fix caluma query loop issue ([603cde0](https://github.com/projectcaluma/ember-caluma/commit/603cde047affdff9a3b009659eada6f68b8d025c))


### Features

* **form:** add new question type action button ([fab0f93](https://github.com/projectcaluma/ember-caluma/commit/fab0f93c0c2caa21fd9d05784d7fe6290eecbfe8))

# [@projectcaluma/ember-core-v9.1.0](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.0.3...@projectcaluma/ember-core-v9.1.0) (2021-11-05)


### Features

* **core:** add helpers for customizing the group and user names ([#1590](https://github.com/projectcaluma/ember-caluma/issues/1590)) ([54c0f02](https://github.com/projectcaluma/ember-caluma/commit/54c0f0223e16793a5043527ffaac73840b78e05d))

# [@projectcaluma/ember-core-v9.0.3](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.0.2...@projectcaluma/ember-core-v9.0.3) (2021-10-14)


### Bug Fixes

* update version numbers ([e30424f](https://github.com/projectcaluma/ember-caluma/commit/e30424f9e1387e8756f0725861205d6f5234cfab))

# [@projectcaluma/ember-core-v9.0.2](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.0.1...@projectcaluma/ember-core-v9.0.2) (2021-10-14)


### Bug Fixes

* **core:** move caluma query model blueprints to core ([d32e30f](https://github.com/projectcaluma/ember-caluma/commit/d32e30f01c15954e1c67ac8a6eaf0b4afda9f592))
* **queries:** ensure raw model data is mutable ([1606269](https://github.com/projectcaluma/ember-caluma/commit/1606269c0ea0688358dd1ef8a4df67b027ec8c57))

# [@projectcaluma/ember-core-v9.0.1](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-core-v9.0.0...@projectcaluma/ember-core-v9.0.1) (2021-09-30)


### Bug Fixes

* **form-builder:** fix default values for table questions ([1548502](https://github.com/projectcaluma/ember-caluma/commit/154850271161b06ca845286d655f38a56a298327))

# @projectcaluma/ember-core v9.0.0 (2021-09-13)

### chore

* deps: update ember-auto-import to v2 (34242f9)

### Features

* move to monorepo structure with multiple packages (676df5f)

### BREAKING CHANGES

* deps: ember-caluma now requires ember-auto-import v2+
* This will completely change the way ember-caluma is used. A migration guide will be added in time.

# [8.0.0](https://github.com/projectcaluma/ember-caluma/compare/v7.5.0...v8.0.0) (2021-08-20)


### Bug Fixes

* **gql:** replace deprecated filters and fix dynamic option filter ([e2e099a](https://github.com/projectcaluma/ember-caluma/commit/e2e099a16028dfe5192848e6a4cc4de07dc07b0e))


### Features

* **validation:** switch default for validateOnEnter ([ee57ed5](https://github.com/projectcaluma/ember-caluma/commit/ee57ed51c596c74989785ee1e8737dcc5d9a606f))


### BREAKING CHANGES

* **validation:** The `validateOnEnter` parameter for the
`DocumentValidity` component is now `false` instead of `true` since this
is the default use case.

# [7.5.0](https://github.com/projectcaluma/ember-caluma/compare/v7.4.0...v7.5.0) (2021-08-11)


### Bug Fixes

* **cfb:** improve badge styling after uikit update ([6476b4a](https://github.com/projectcaluma/ember-caluma/commit/6476b4ae2441a9984ecebc1e5a65f9326df4199f))
* **demo-app:** added required "validation" route to router and added corresponding translations. ([513e58a](https://github.com/projectcaluma/ember-caluma/commit/513e58ad093a601ce0f9a43b67959aeace082acb))
* **file upload:** don't use formdata for minio upload ([52fde60](https://github.com/projectcaluma/ember-caluma/commit/52fde60364ca82435479046be35bc33c1f488fc9)), closes [#1287](https://github.com/projectcaluma/ember-caluma/issues/1287)
* **info modal:** glimmer syntax ([b6b2b24](https://github.com/projectcaluma/ember-caluma/commit/b6b2b245fdda3a978b7c90f5833bac38345d73e3))
* **task-button:** fix filter for fetching the task ([332c480](https://github.com/projectcaluma/ember-caluma/commit/332c4807e16ba0a51407016b31163238ac9fd4ce))
* **task-button:** only render button if work item is ready ([f24191c](https://github.com/projectcaluma/ember-caluma/commit/f24191cec99502a301642113f727c2adb4f0e147))
* add ember-in-viewport to blueprint ([57d1710](https://github.com/projectcaluma/ember-caluma/commit/57d1710cd4a47741517c8bf43122c8d284a2ffc1))


### Features

* **buttons:** add willMutate hook for work item and task buttons ([3672a52](https://github.com/projectcaluma/ember-caluma/commit/3672a52e788ad9e1dc6ac2c4e9960f99f4449cb7))
* **cfb:** link sub- & rowforms in question list ([4034427](https://github.com/projectcaluma/ember-caluma/commit/4034427d2898e79d012ff9fcf5dbc7df6fdb5e41))
* **cfb:** make sub- & rowforms searchable ([66e483f](https://github.com/projectcaluma/ember-caluma/commit/66e483fcb972b300b14394d5e7eac46eb79aa003))
* **cfb:** mark conditionally required / hidden questions ([f91e07e](https://github.com/projectcaluma/ember-caluma/commit/f91e07e49cfcd33eb363f9be063d987584c4acc0))
* **document-validity:** allow manual triggering of validation ([8388a0a](https://github.com/projectcaluma/ember-caluma/commit/8388a0a99a87e1eaa780b38f3c0ff0ea1ab3cd6f))
* add widget override "hidden" ([cfa8122](https://github.com/projectcaluma/ember-caluma/commit/cfa81220326c0bda7b901a22dbe595c329f18c1a))

# [7.4.0](https://github.com/projectcaluma/ember-caluma/compare/v7.3.0...v7.4.0) (2021-07-16)


### Features

* add document validity check component ([#1448](https://github.com/projectcaluma/ember-caluma/issues/1448)) ([98ef13c](https://github.com/projectcaluma/ember-caluma/commit/98ef13c92edee11233c54f52fee1fe08fc762e15))

# [7.3.0](https://github.com/projectcaluma/ember-caluma/compare/v7.2.0...v7.3.0) (2021-06-25)


### Features

* add task button ([#1423](https://github.com/projectcaluma/ember-caluma/issues/1423)) ([823eff1](https://github.com/projectcaluma/ember-caluma/commit/823eff146dc1cea05cc44857f0850ba175aadced))

# [7.2.0](https://github.com/projectcaluma/ember-caluma/compare/v7.1.1...v7.2.0) (2021-06-22)


### Bug Fixes

* **docs:** add user documentation for workitembutton ([47ef3e1](https://github.com/projectcaluma/ember-caluma/commit/47ef3e19ec0e6673d02de75e4da55caaf1d29036))
* **work-item-button:** add docs and improve component ([71cb7a2](https://github.com/projectcaluma/ember-caluma/commit/71cb7a290f1152d6f178d2d29e2fe91bfe038f11))


### Features

* **jexl:** allow optional answer transforms with default value ([1ba4e7e](https://github.com/projectcaluma/ember-caluma/commit/1ba4e7e224f10026435251cd0d53ce35b111bf0a))
* **work-item-button:** add success and error hooks ([8d50b15](https://github.com/projectcaluma/ember-caluma/commit/8d50b1553b5d73776bd02371c0dec9fdb3d74771))
* add work item button component ([4daa9cf](https://github.com/projectcaluma/ember-caluma/commit/4daa9cfd477d4d5b5be2aa33446093fb075e4bbf))

## [7.1.1](https://github.com/projectcaluma/ember-caluma/compare/v7.1.0...v7.1.1) (2021-05-31)


### Bug Fixes

* **tests:** update graphql schema to fix testing ([c928c07](https://github.com/projectcaluma/ember-caluma/commit/c928c079dbc4ea9b1b1ac6c0153c1a259722f456))

# [7.1.0](https://github.com/projectcaluma/ember-caluma/compare/v7.0.6...v7.1.0) (2021-05-17)


### Bug Fixes

* **form-builder:** fix refreshing of page when submitting search form ([5df89ec](https://github.com/projectcaluma/ember-caluma/commit/5df89ecedfae9594a9c9747848258bdcae08c79c))
* **jexl:** fix edge case where field is not found ([769d6a8](https://github.com/projectcaluma/ember-caluma/commit/769d6a88fe7e3da8128424984045a909f5527e62))
* feedback from code review ([fdd979e](https://github.com/projectcaluma/ember-caluma/commit/fdd979e53a5c7ce7c1cf3fa10f2d3d05a8dba092))


### Features

* **form builder:** add syntax highlighting for markdown and jexl ([155c2ce](https://github.com/projectcaluma/ember-caluma/commit/155c2ce056145dc1f839f0dec9bc29ffef77f50c))

## [7.0.6](https://github.com/projectcaluma/ember-caluma/compare/v7.0.5...v7.0.6) (2021-04-09)


### Bug Fixes

* **docs:** fix broken link to snippet ([9faea24](https://github.com/projectcaluma/ember-caluma/commit/9faea240c6cdae6aed179b7a2c3cb513ce506cef))

## [7.0.5](https://github.com/projectcaluma/ember-caluma/compare/v7.0.4...v7.0.5) (2021-03-31)


### Bug Fixes

* **label:** fix optional chaining ([2db71fa](https://github.com/projectcaluma/ember-caluma/commit/2db71fae949f661e24556f61637bca0d41a9ae49))

## [7.0.4](https://github.com/projectcaluma/ember-caluma/compare/v7.0.3...v7.0.4) (2021-03-24)


### Bug Fixes

* **field:** add all table columns as dependency if followed by stringify ([44bbf29](https://github.com/projectcaluma/ember-caluma/commit/44bbf29705c27928fb99fdfca4770db780201516))
* **field:** fix field dependencies for optional property ([26e564e](https://github.com/projectcaluma/ember-caluma/commit/26e564e4a556d06db3508c65855d58ba43bf1e64))

## [7.0.3](https://github.com/projectcaluma/ember-caluma/compare/v7.0.2...v7.0.3) (2021-03-17)


### Bug Fixes

* **jexl:** remove hidden columns from table value in JEXL ([3e93019](https://github.com/projectcaluma/ember-caluma/commit/3e930193d2030292707e378e4ed0ae1942576d82))

## [7.0.2](https://github.com/projectcaluma/ember-caluma/compare/v7.0.1...v7.0.2) (2021-03-16)


### Bug Fixes

* **cfb:** fix jexl requiredness evaluation and refactor component ([745773c](https://github.com/projectcaluma/ember-caluma/commit/745773cb2e2dee0c30efecc2e710aa3201a37060))

## [7.0.1](https://github.com/projectcaluma/ember-caluma/compare/v7.0.0...v7.0.1) (2021-03-16)


### Bug Fixes

* use concurrency decorators for compatibility ([083136a](https://github.com/projectcaluma/ember-caluma/commit/083136ab5776704e12abe256a6f871f2dd6252f2))

# [7.0.0](https://github.com/projectcaluma/ember-caluma/compare/v6.10.2...v7.0.0) (2021-03-16)


### Bug Fixes

* **date:** use UTC for dates to avoid timezone problems ([4d943dd](https://github.com/projectcaluma/ember-caluma/commit/4d943dd7672f007fa17bc55ea358ef61f2db7dd6))
* **form:** display archived options if selected ([8b8e5c7](https://github.com/projectcaluma/ember-caluma/commit/8b8e5c76df840a0b8ca835434ba25f0ff03f4390))
* **helper:** allow calling has-question-type with a nullish parameter ([67886fc](https://github.com/projectcaluma/ember-caluma/commit/67886fcc186aae4605c4bc9440ebee73c91947a0))


### Features

* **cfb:** implement search and pagination of forms ([b4400c5](https://github.com/projectcaluma/ember-caluma/commit/b4400c53986d719880259bd53a9fce45d0c89050))
* **jexl:** improve mapby and add stringify transform ([9510e77](https://github.com/projectcaluma/ember-caluma/commit/9510e774057685e9d85564e6ed7595ef2324bca1))


* chore(options)!: remove getNamespace and setNamespace methods ([613bf36](https://github.com/projectcaluma/ember-caluma/commit/613bf3657b7bff29f4e3329d0d87d27957507cb0))
* chore(deps)!: drop support for older ember LTS version 2.20 ([018a689](https://github.com/projectcaluma/ember-caluma/commit/018a6899b9f835b59dbe1a115aaf4d432682d719))
* chore(deps)!: update ember-apollo-client and migrate to apollo client v3 ([b914262](https://github.com/projectcaluma/ember-caluma/commit/b914262b5ced3a027d4fd8390c72aa0ade94e4a8))


### BREAKING CHANGES

* This removes the `getNamespace` and `setNamespace` methods on the options service and replaces them with real getters and setters:
```js
// before

calumaOptions.setNamespace("Test Test");
calumaOptions.getNamespace(); // "test-test"

// after

calumaOptions.namespace = "Test Test";
calumaOptions.namespace; // "test-test"
```
* This removes guaranteed support for ember LTS 2.20 and adds support for the newly active LTS 2.24
* This updates `ember-apollo-client` and therefore `apollo-client` to v3 which introduces various breaking changes. Read the [migration guide](tests/dummy/app/templates/docs/migration.md) for further instructions.

## [6.10.2](https://github.com/projectcaluma/ember-caluma/compare/v6.10.1...v6.10.2) (2021-02-15)


### Bug Fixes

* **field:** some questions do not have an answer, handle this correctly ([#1240](https://github.com/projectcaluma/ember-caluma/issues/1240)) ([f163748](https://github.com/projectcaluma/ember-caluma/commit/f1637489d590936bf20ffd2a98a96145f9a84c6e))

## [6.10.1](https://github.com/projectcaluma/ember-caluma/compare/v6.10.0...v6.10.1) (2021-02-15)


### Bug Fixes

* **jexl:** fix jexl dependency gathering for empty tables ([#1239](https://github.com/projectcaluma/ember-caluma/issues/1239)) ([22c68d3](https://github.com/projectcaluma/ember-caluma/commit/22c68d395129c653112e26fa4d760d3ad661ec39))

# [6.10.0](https://github.com/projectcaluma/ember-caluma/compare/v6.9.3...v6.10.0) (2021-02-15)


### Bug Fixes

* **jexl:** fix division by 0 in avg transform ([#1233](https://github.com/projectcaluma/ember-caluma/issues/1233)) ([0f7ef59](https://github.com/projectcaluma/ember-caluma/commit/0f7ef596159e9fd2d3e9929b596bc0dd6e803132))
* **jexl:** fix validation of numbers in transforms ([#1234](https://github.com/projectcaluma/ember-caluma/issues/1234)) ([27f3324](https://github.com/projectcaluma/ember-caluma/commit/27f3324ac382eed221eba807cc4220cfd09ef20b))
* **navigation:** set validated fields to dirty and check for that ([2975356](https://github.com/projectcaluma/ember-caluma/commit/29753561d0b9d53fd6c0a05fb5e0b96a1376cf5b))


### Features

* **jexl:** add transforms for mathematical functions ([#1230](https://github.com/projectcaluma/ember-caluma/issues/1230)) ([e7c1974](https://github.com/projectcaluma/ember-caluma/commit/e7c1974f079cfba18997cc23d9465d3dcdc6b4e2))

## [6.9.3](https://github.com/projectcaluma/ember-caluma/compare/v6.9.2...v6.9.3) (2021-02-04)


### Bug Fixes

* pin uikit ([12523f4](https://github.com/projectcaluma/ember-caluma/commit/12523f456fcaf343b0fc39593c908cfada535cfe))
* **deps:** add resolution to fix @babel/parser to 7.12.11 ([2333c88](https://github.com/projectcaluma/ember-caluma/commit/2333c8873dd1e97b66b17981d3a2dfe3103e5722))
* **form:** add fields used in mapby transforms to dependencies ([adedd7e](https://github.com/projectcaluma/ember-caluma/commit/adedd7e50c3e848481949c6413c5268bce575680))
* **question/default:** ignore question's widgetOverride ([0e0f9cc](https://github.com/projectcaluma/ember-caluma/commit/0e0f9cc98a5d7b98d200938db62269103ef6d46b))

## [6.9.2](https://github.com/projectcaluma/ember-caluma/compare/v6.9.1...v6.9.2) (2021-01-28)


### Bug Fixes

* **form-builder:** fix missing question on answer for default value ([#1204](https://github.com/projectcaluma/ember-caluma/issues/1204)) ([c1c6173](https://github.com/projectcaluma/ember-caluma/commit/c1c6173638da7dfca275c97158733c5dca441ad5))

## [6.9.1](https://github.com/projectcaluma/ember-caluma/compare/v6.9.0...v6.9.1) (2021-01-26)


### Bug Fixes

* **form-builder:** fix fieldset on generated field for the default value ([a5f9dcd](https://github.com/projectcaluma/ember-caluma/commit/a5f9dcde7ad04c97eaed982447e8595f698739fe))

# [6.9.0](https://github.com/projectcaluma/ember-caluma/compare/v6.8.0...v6.9.0) (2021-01-22)


### Features

* **jexl:** allow usage of form meta in question jexl ([2956db5](https://github.com/projectcaluma/ember-caluma/commit/2956db5ef74f896f7234b641d7e15da6336067cc))

# [6.8.0](https://github.com/projectcaluma/ember-caluma/compare/v6.7.0...v6.8.0) (2021-01-22)


### Bug Fixes

* **cfb:** clean up options code ([5a4073d](https://github.com/projectcaluma/ember-caluma/commit/5a4073d0297a7782f1a2655e653c601c5f236c88))
* **cfb:** fix recalculation issue in default values ([f549637](https://github.com/projectcaluma/ember-caluma/commit/f549637735596b215849d9170188cae28516e839))
* **cfb:** improve options sorting code ([d5a2591](https://github.com/projectcaluma/ember-caluma/commit/d5a25912d694f66d69ace55d61fea777bf9b5a33))


### Features

* **cfb:** implement reordering of question options ([3928a7c](https://github.com/projectcaluma/ember-caluma/commit/3928a7cd797127672f61d65179b3bd38a44d5fcf))
* **cfb:** use uk-sortable component for options sorting ([eba83f7](https://github.com/projectcaluma/ember-caluma/commit/eba83f7382f9cd5dabd80c833958df4ae684c04a))

# [6.7.0](https://github.com/projectcaluma/ember-caluma/compare/v6.6.1...v6.7.0) (2021-01-14)


### Features

* **cfb:** add input for default values ([48a6a7b](https://github.com/projectcaluma/ember-caluma/commit/48a6a7b4aee78e718e3b7dd8b580b659361a2cb4))
* **form:** show calculated fields in form and compute their value live ([2f47be2](https://github.com/projectcaluma/ember-caluma/commit/2f47be22535cbaae7856c949efc6c5b2ba38663c))
* **form-builder:** add calculated fields for the form builder ([dab9ee8](https://github.com/projectcaluma/ember-caluma/commit/dab9ee84708642bc054d2a98da15b5f9b14dd5d6))

## [6.6.1](https://github.com/projectcaluma/ember-caluma/compare/v6.6.0...v6.6.1) (2020-11-30)


### Bug Fixes

* **nav:** fix navigation hidden state and computed key in field ([2a149ca](https://github.com/projectcaluma/ember-caluma/commit/2a149cad7c2302311a854ecb631b70ba87eb73f4))

# [6.6.0](https://github.com/projectcaluma/ember-caluma/compare/v6.5.2...v6.6.0) (2020-11-26)


### Features

* **nav:** implement navigation states for default answers ([0e32e9e](https://github.com/projectcaluma/ember-caluma/commit/0e32e9eac486a6c22e0d11304a149ffbdfc97e50))

## [6.5.2](https://github.com/projectcaluma/ember-caluma/compare/v6.5.1...v6.5.2) (2020-11-24)


### Bug Fixes

* **config:** fix power select limit default config ([1a1dec1](https://github.com/projectcaluma/ember-caluma/commit/1a1dec1217ef284471474be714264b1502face9d))

## [6.5.1](https://github.com/projectcaluma/ember-caluma/compare/v6.5.0...v6.5.1) (2020-11-18)


### Bug Fixes

* **deps:** update ember-changeset and ember-changeset-validations ([c66cc8e](https://github.com/projectcaluma/ember-caluma/commit/c66cc8ec485513d1fb9b90ed520990b2f30dca72))

# [6.5.0](https://github.com/projectcaluma/ember-caluma/compare/v6.4.0...v6.5.0) (2020-11-17)


### Bug Fixes

* **form:** don't throw when typename is undefined in cf-field/input ([34b4a36](https://github.com/projectcaluma/ember-caluma/commit/34b4a36bd2c0e20d20bd81c556fd8fb8688d7988))
* **test:** fix test selector ([2c15fa5](https://github.com/projectcaluma/ember-caluma/commit/2c15fa5dba46e766fd6dcf8c58ea9ab5470a2483))
* change maximum slug length to fit backend implementation ([1da4e29](https://github.com/projectcaluma/ember-caluma/commit/1da4e297525577640b1377ab86cefe7a798601a2))


### Features

* **cf-field:** make options limit configurable ([#1097](https://github.com/projectcaluma/ember-caluma/issues/1097)) ([2a819c0](https://github.com/projectcaluma/ember-caluma/commit/2a819c081830054f36cf891bf31909e6a2b92b67))
* **cfb:** add paging to question list ([#1064](https://github.com/projectcaluma/ember-caluma/issues/1064)) ([2c80035](https://github.com/projectcaluma/ember-caluma/commit/2c80035e52ab00c7b023c95241d44d91cc112362))
* **cfb:** add seperation between archived and active forms ([#1054](https://github.com/projectcaluma/ember-caluma/issues/1054)) ([bda4c79](https://github.com/projectcaluma/ember-caluma/commit/bda4c79fe4778f36786b7dcac819fcc0806fff87))
* **lib:** add a debug transform which logs to console ([#1098](https://github.com/projectcaluma/ember-caluma/issues/1098)) ([8ed447b](https://github.com/projectcaluma/ember-caluma/commit/8ed447b64a830b6b3b4419fe2d2d8682642021f9))


### Reverts

* Revert "chore(deps): bump moment from 2.24.0 to 2.29.1 (#1059)" (#1100) ([dc404e6](https://github.com/projectcaluma/ember-caluma/commit/dc404e63a2190f7b13cf44a06e14261581ab05e5)), closes [#1059](https://github.com/projectcaluma/ember-caluma/issues/1059) [#1100](https://github.com/projectcaluma/ember-caluma/issues/1100)

# [6.4.0](https://github.com/projectcaluma/ember-caluma/compare/v6.3.0...v6.4.0) (2020-10-19)


### Features

* **caluma-query:** allow `queryOptions` to be set on `fetch` ([547d08d](https://github.com/projectcaluma/ember-caluma/commit/547d08d7897d85242a8524b61bc0d2a494f4cfa8))

# [6.3.0](https://github.com/projectcaluma/ember-caluma/compare/v6.2.1...v6.3.0) (2020-10-06)


### Bug Fixes

* **blueprints:** add ember-composable-helpers to host app dependencies ([9526fff](https://github.com/projectcaluma/ember-caluma/commit/9526fff961b2adb50beae87787a437fd1cb74970))
* **dependencies:** update @glimmer/component and pin jexl ([8e9471d](https://github.com/projectcaluma/ember-caluma/commit/8e9471df6f9bf5bc39818a81d2c3ebbd7c577706))
* **deps:** update jexl to 2.3.0 ([da041bc](https://github.com/projectcaluma/ember-caluma/commit/da041bc5d41b3034e3252ae27754c09a31d5021e))


### Features

* **caluma-query:** allow passing of options to apollo query method ([9b27d14](https://github.com/projectcaluma/ember-caluma/commit/9b27d145110bef10970feb11083efc206d55754b))
* **query:** add a case query ([d63228b](https://github.com/projectcaluma/ember-caluma/commit/d63228bbe127a8d646d6c84b84b406d14dc32dc8))

## [6.2.1](https://github.com/projectcaluma/ember-caluma/compare/v6.2.0...v6.2.1) (2020-09-02)


### Bug Fixes

* **embed:** render power select in place ([20d7f76](https://github.com/projectcaluma/ember-caluma/commit/20d7f76971549298ce677afa2e51aa759feb1546))
* **queries:** fix pagination parameters ([c1cf6c9](https://github.com/projectcaluma/ember-caluma/commit/c1cf6c91c69e118f4c9fb4b445c002720bcb72fe))

# [6.2.0](https://github.com/projectcaluma/ember-caluma/compare/v6.1.2...v6.2.0) (2020-08-26)


### Features

* add queries for fetching work items ([ef2daff](https://github.com/projectcaluma/ember-caluma/commit/ef2daff7a573298e09db5fa94ca10b74a5f73d85))

## [6.1.2](https://github.com/projectcaluma/ember-caluma/compare/v6.1.1...v6.1.2) (2020-07-23)


### Bug Fixes

* fix ember-power-select ([6a0ce3c](https://github.com/projectcaluma/ember-caluma/commit/6a0ce3ca2959392f5fa086c708568c0dfed7ac2c))

## [6.1.1](https://github.com/projectcaluma/ember-caluma/compare/v6.1.0...v6.1.1) (2020-06-04)


### Bug Fixes

* **deps:** add resolutions to fix build ([2fa230c](https://github.com/projectcaluma/ember-caluma/commit/2fa230cefb8622ebf2b8b3ea22d9f0561b18ee3e))
* **dummy:** fix moment config for dummy app ([e335fe2](https://github.com/projectcaluma/ember-caluma/commit/e335fe2ed63f1d4127acd509ebfead1fc717ed11))
* **i18n:** only use primary locale in http headers ([7f36264](https://github.com/projectcaluma/ember-caluma/commit/7f3626463ae74ad99e189733cf8e6df7d6acc823))

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

# [0.1.0](https://github.com/projectcaluma/ember-caluma/compare/v0.0.4...v0.1.0) (2019-05-08)


### Bug Fixes

* **cf-navigation:** auto-link empty form sections to first subsection ([#185](https://github.com/projectcaluma/ember-caluma/issues/185)) ([a50a442](https://github.com/projectcaluma/ember-caluma/commit/a50a442))
* **deps:** downgrade to jexl 1.x for IE 11 compat ([#197](https://github.com/projectcaluma/ember-caluma/issues/197)) ([cca7d03](https://github.com/projectcaluma/ember-caluma/commit/cca7d03))
* **deps:** Move ember-cli-showdown to dependencies ([#171](https://github.com/projectcaluma/ember-caluma/issues/171)) ([2dca978](https://github.com/projectcaluma/ember-caluma/commit/2dca978))
* **deps:** update dependency ember-cli-sass to v10 ([#32](https://github.com/projectcaluma/ember-caluma/issues/32)) ([2877c64](https://github.com/projectcaluma/ember-caluma/commit/2877c64))
* **deps:** update dependency ember-composable-helpers to v2.3.1 ([#156](https://github.com/projectcaluma/ember-caluma/issues/156)) ([0a1498d](https://github.com/projectcaluma/ember-caluma/commit/0a1498d))
* **info:** replace drop by modal ([#193](https://github.com/projectcaluma/ember-caluma/issues/193)) ([ea2a026](https://github.com/projectcaluma/ember-caluma/commit/ea2a026))
* **jexl:** add custom intersects operator to jexl AST parser ([#183](https://github.com/projectcaluma/ember-caluma/issues/183)) ([30ddf10](https://github.com/projectcaluma/ember-caluma/commit/30ddf10))
* **jexl:** don't consider the value of hidden fields in JEXL expr. ([#198](https://github.com/projectcaluma/ember-caluma/issues/198)) ([f934741](https://github.com/projectcaluma/ember-caluma/commit/f934741))
* **table:** render download links for file questions in tables ([#187](https://github.com/projectcaluma/ember-caluma/issues/187)) ([25cfd80](https://github.com/projectcaluma/ember-caluma/commit/25cfd80))
* **translations:** add missing german translations ([#152](https://github.com/projectcaluma/ember-caluma/issues/152)) ([dba21ec](https://github.com/projectcaluma/ember-caluma/commit/dba21ec))
* **validation:** ignore hidden required fields ([#175](https://github.com/projectcaluma/ember-caluma/issues/175)) ([2d1f490](https://github.com/projectcaluma/ember-caluma/commit/2d1f490))


### Features

* **form:** add support for static question ([#169](https://github.com/projectcaluma/ember-caluma/issues/169)) ([17afa26](https://github.com/projectcaluma/ember-caluma/commit/17afa26))
* **jexl:** add "interesects" binary operator ([#176](https://github.com/projectcaluma/ember-caluma/issues/176)) ([502c747](https://github.com/projectcaluma/ember-caluma/commit/502c747))
* **jexl:** add cross-form jexl resolution ([#154](https://github.com/projectcaluma/ember-caluma/issues/154)) ([c137e29](https://github.com/projectcaluma/ember-caluma/commit/c137e29)), closes [/github.com/projectcaluma/caluma/pull/398#discussion_r279346810](https://github.com//github.com/projectcaluma/caluma/pull/398/issues/discussion_r279346810)
* **jexl:** add support for multiline expressions ([#177](https://github.com/projectcaluma/ember-caluma/issues/177)) ([8fb2b6b](https://github.com/projectcaluma/ember-caluma/commit/8fb2b6b))
* **tooling:** add semantic release ([#200](https://github.com/projectcaluma/ember-caluma/issues/200)) ([64b943c](https://github.com/projectcaluma/ember-caluma/commit/64b943c))
