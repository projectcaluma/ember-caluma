import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cfb-form-editor/dependents-tree', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CfbFormEditor::DependentsTree />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <CfbFormEditor::DependentsTree>
        template block text
      </CfbFormEditor::DependentsTree>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
