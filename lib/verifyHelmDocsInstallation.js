import execa from 'execa';
const AggregateError = require('aggregate-error');

module.exports = async (pluginConfig, context) => {
  const { logger } = context;
  const { prepareHelmChartDocs } = pluginConfig;
  const errors = [];

  if (prepareHelmChartDocs) {
    logger.log('Searching for installation of helm-docs...');
    await findHelmDocsExecutable(context);
  } else {
    logger.log('Skipping helm-docs installation.');
  } finally {
    if (errors.length > 0) {
      throw new AggregateError(errors);
  }
}

async function findHelmDocsExecutable(pluginConfig, context) {
  const { logger } = context.logger;
  const { enableHelmDocsAutoDownload } = pluginConfig;

  try {
    await execa(
      'helm-docs', 
      ['--version']
    );
    return true;

  } catch (error) {
    logger.warn('There was an issue with finding and executing helm-docs.');
    if (enableHelmDocsAutoDownload) {
      await envokeAutoDownload(context);
    }
  }
}

function verifyChecksum() {
 // todo 
  // verify checksum with some cli tool
}

async function invokeAutoDownload(pluginConfig, context) {
  const { logger } = context;
  const { helmDocsVersion } = pluginConfig;

  const version = helmDocsVersion;
  const tmpDir = '/tmp/helmdocs';
  logger.log('Downloading helm-docs...');

    try {
      await execa(
        'mkdir',
        [ '-p', tmpDir ]
      );
      await execa(
        'curl',
        [ '-sSLo', 'helm-docs.tar.gz', `https://github.com/norwoodj/helm-docs/releases/download/v${version}/helm-docs_${version}_Linux_x86_64.tar.gz` ]
      );
      await execa(
        'tar',
        [ '-xzf', 'helm-docs.tar.gz', '-C', tmpDir ]
      );
      await execa(
        'rm',
        [ '-f', 'helm-docs.tar.gz' ]
      );
      await execa(
        `${tmpDir}/helm-docs`,
        [ '-- version' ]
      );
      return
    } catch (error) {
      logger.error('Failed to install helm-docs: ' + error);
    }

}
