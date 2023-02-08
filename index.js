const verify = require('./lib/verifyHelmDocsInstallation');
const render = require('./lib/prepareHelmChartDocumentation');

let verified = false;

async function verifyConditions(pluginConfig, context) {
  await verify(pluginConfig, context);
  verified = true;
}

async function prepare(pluginConfig, context) {
  if (!verified) {
    await verifyConditions(pluginConfig, context);
  }

  await render(pluginConfig, context);
}

module.exports = { 
  verifyConditions, 
  prepare 
} 
