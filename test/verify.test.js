const index = require('../index');
const verifyConditions = index.verifyConditions;

test('calls verifyConditions from index', () => {
  pluginConfig = {
    "prepareHelmChartDocs": true
  }
  verifyConditions(pluginConfig, "");
});

test('skip prepare helm chart docs', () => {
  pluginConfig = {
    "prepareHelmChartDocs": false
  }
  verifyConditions(pluginConfig, "");
});

test('download new version 1.12.0', () => {
  pluginConfig = {
    "prepareHelmChartDocs": true,
    "enableHelmDocsAutoDownload": true,
    "helmDocsVersion": "1.12.0"
  }
  verifyConditions(pluginConfig, "");
});

test('download default version 1.11.0', () => {
  pluginConfig = {
    "prepareHelmChartDocs": true,
    "enableHelmDocsAutoDownload": true
  }
  verifyConditions(pluginConfig, "");
});

test('verify sha256checksum', () => {
  pluginConfig = {
    "prepareHelmChartDocs": true,
    "enableHelmDocsAutoDownload": true
  }
  verifyConditions(pluginConfig, "");
});

test('issue when finding and executing helm-docs', () => {
  pluginConfig = {
    "prepareHelmChartDocs": true
  }
  verifyConditions(pluginConfig, "");
});
