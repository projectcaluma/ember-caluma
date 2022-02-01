# [@projectcaluma/ember-distribution-v1.0.0-beta.2](https://github.com/projectcaluma/ember-caluma/compare/@projectcaluma/ember-distribution-v1.0.0-beta.1...@projectcaluma/ember-distribution-v1.0.0-beta.2) (2022-02-01)


### chore

* **deps:** update ember-uikit to v5 beta ([6568d39](https://github.com/projectcaluma/ember-caluma/commit/6568d398216d33b44da5b659830ca3c200dd7012))


### BREAKING CHANGES

* **deps:** All `@projectcaluma/ember-*` packages now require
`ember-uikit` v5+.

# @projectcaluma/ember-distribution-v1.0.0-beta.1 (2022-01-18)


### Bug Fixes

* **core:** override apollo service instead of serving a mixin ([e86796e](https://github.com/projectcaluma/ember-caluma/commit/e86796e801dc5a2a5b1331b87bc9261509443605)), closes [#529](https://github.com/projectcaluma/ember-caluma/issues/529)
* **deps:** update @projectcaluma/ember-core [skip ci] ([1e6af2d](https://github.com/projectcaluma/ember-caluma/commit/1e6af2dc2f29347897e605cc7144721abc2b44d7))
* **deps:** update @projectcaluma/ember-core [skip ci] ([27fb674](https://github.com/projectcaluma/ember-caluma/commit/27fb674f465bb78f3aed48c896259879d54a4de5))
* **deps:** update @projectcaluma/ember-core [skip ci] ([d2accca](https://github.com/projectcaluma/ember-caluma/commit/d2accca7678fe49cba53b1aef3224ff7a055b631))
* **deps:** update @projectcaluma/ember-core [skip ci] ([397f5ba](https://github.com/projectcaluma/ember-caluma/commit/397f5bae7fe2795a1e5824f450f666dee4a030d5))
* **deps:** update @projectcaluma/ember-form [skip ci] ([2f80820](https://github.com/projectcaluma/ember-caluma/commit/2f80820e5930fef578c8294255fef21ab137b333))
* **deps:** update @projectcaluma/ember-testing [skip ci] ([371d144](https://github.com/projectcaluma/ember-caluma/commit/371d1440a69cad682c1274ddbaeb46deef62376d))
* **deps:** update @projectcaluma/ember-testing [skip ci] ([0c339df](https://github.com/projectcaluma/ember-caluma/commit/0c339df93880ffba0023552fa326b313df7bcec3))
* **deps:** update @projectcaluma/ember-workflow [skip ci] ([e1232c8](https://github.com/projectcaluma/ember-caluma/commit/e1232c8d6929360b30a5c2a6777203f24255da94))
* **deps:** update @projectcaluma/ember-workflow [skip ci] ([07686c1](https://github.com/projectcaluma/ember-caluma/commit/07686c1e061fc4fc13715a3638cfad7b0a1197fe))
* **distribution:** fix infinte loop when fetching groups with ember-data ([f18ec33](https://github.com/projectcaluma/ember-caluma/commit/f18ec333908e669b24db764d1aa2a3396d8f25a7))
* **form:** fix dependencies for ember-autoresize-modifier ([242007a](https://github.com/projectcaluma/ember-caluma/commit/242007a9b5010fc99824b7f03d8102095904403f))


### chore

* **deps:** update dependencies and drop support for node 10 ([51d6dee](https://github.com/projectcaluma/ember-caluma/commit/51d6deeda9811518622ba0cefd8d3876651dab4f))


### Features

* **distribution:** add mask for creating new inquiries ([c90c5e7](https://github.com/projectcaluma/ember-caluma/commit/c90c5e72dd300899f2d209216d0b893968ce6b20))
* **distribution:** add masks for editing and answering inquiries ([14a743b](https://github.com/projectcaluma/ember-caluma/commit/14a743bbfa7a349a58f72b44ed6eed0843bd6d13))
* **distribution:** add read only view of distribution engine ([ac2c46a](https://github.com/projectcaluma/ember-caluma/commit/ac2c46aeec9c3f6aec4e450a84f2469d38ba6c14))
* **form:** enable autoresize for textarea questions ([428820f](https://github.com/projectcaluma/ember-caluma/commit/428820f2bdf842ebeb0393a70c5556ceceab9e4e))


### BREAKING CHANGES

* **core:** The apollo service mixin was removed in favor of
directly overriding the service. For more information on how to migrate,
please visit the v11 migration guide.
* **deps:** Remove support for node v10
