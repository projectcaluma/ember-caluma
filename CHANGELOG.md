# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.0.3] - 2019-03-13

### Breaking changes

* Fix 'missing translations' errors by adding `intl` to the dependencies.
  
  Migration guide: Add the `intl` service to the `dependencies` list in `app.js`:
  ```js
    engines: {
      emberCaluma: {
        dependencies: {
          services: ["apollo", "notification", "router", "intl"]
        }
      }
    }
  ```

### Added
* Single and multiple choice questions now offer a dropdown widget.
* New question type "Table" (just administration, no rendering yet)

### Changed
* Archived questions now visible (and marked as archived) on assigned forms.

## [0.0.2] - 2019-03-01

### Added
* Archived and published toggles for forms and questions.

## [0.0.1] - 2019-01-18
