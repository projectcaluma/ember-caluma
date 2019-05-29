import Component from "@ember/component";
import layout from "../templates/components/cf-pagination";
import { computed } from "@ember/object";
import { filterBy } from "@ember/object/computed";

const buildParams = (section, subSections) => {
  if (!section) {
    return [];
  }

  return subSections.length
    ? subSections.map(s => ({
        section: section.question.slug,
        subSection: s.question.slug
      }))
    : [{ section: section.question.slug, subSection: undefined }];
};

export default Component.extend({
  layout,

  _sections: filterBy(
    "rootDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _currentSection: computed("_sections.[]", "section", function() {
    return this._sections.find(s => s.question.slug === this.section);
  }),

  _currentSubSection: computed(
    "_currentSubSections.[]",
    "subSection",
    function() {
      return this._currentSubSections.find(
        s => s.question.slug === this.subSection
      );
    }
  ),

  _currentSubSections: filterBy(
    "_currentSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _currentSectionIndex: computed("_sections.[]", "section", function() {
    return this._sections.indexOf(this._currentSection);
  }),

  _previousSection: computed("_currentSectionIndex", function() {
    return this._currentSectionIndex > 0
      ? this._sections[this._currentSectionIndex - 1]
      : null;
  }),

  _nextSection: computed(
    "_currentSectionIndex",
    "_sections.length",
    function() {
      return this._currentSectionIndex < this._sections.length
        ? this._sections[this._currentSectionIndex + 1]
        : null;
    }
  ),

  _previousSubSections: filterBy(
    "_previousSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _nextSubSections: filterBy(
    "_nextSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  adjacentSections: computed(
    "_previousSubSections.[]",
    "_currentSubSections.[]",
    "_nextSubSections.[]",
    function() {
      return [
        ...buildParams(this._previousSection, this._previousSubSections),
        ...buildParams(this._currentSection, this._currentSubSections),
        ...buildParams(this._nextSection, this._nextSubSections)
      ];
    }
  ),

  sectionIndex: computed(
    "adjacentSections.[]",
    "section",
    "subSection",
    function() {
      return this.adjacentSections.findIndex(
        s => s.section === this.section && s.subSection === this.subSection
      );
    }
  ),

  previousSection: computed("adjacentSections.[]", "sectionIndex", function() {
    return this.sectionIndex > 0
      ? this.adjacentSections[this.sectionIndex - 1]
      : null;
  }),

  nextSection: computed("adjacentSections.[]", "sectionIndex", function() {
    return this.sectionIndex < this.adjacentSections.length
      ? this.adjacentSections[this.sectionIndex + 1]
      : null;
  })
});
