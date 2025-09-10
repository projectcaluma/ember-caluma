import { setApplication } from "@ember/test-helpers";
import { start, setupEmberOnerrorValidation } from "ember-qunit";
import { loadTests } from "ember-qunit/test-loader";
import * as QUnit from "qunit";
import { setup } from "qunit-dom";

import Application from "dummy/app";
import config from "dummy/config/environment";
import setupUIkitHelpers from "dummy/tests/helpers/uikit";
setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupUIkitHelpers(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();
start();
