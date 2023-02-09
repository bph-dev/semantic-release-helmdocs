//import execa from 'execa';
//const AggregateError = require('aggregate-error');

module.exports = async (pluginConfig, context) => {
  const { prepareHelmChartDocs } = pluginConfig;
  const errors = [];

  if (prepareHelmChartDocs) {
    console.log('Searching for installation of helm-docs...');
    await findHelmDocsExecutable(pluginConfig, context);
  } else {
    console.log('Skipping helm-docs installation.');
  } 

  if (errors.length > 0) {
      throw new AggregateError(errors);
  }
}

async function findHelmDocsExecutable(pluginConfig, context) {
  const { enableHelmDocsAutoDownload } = pluginConfig;

  try {
    await execa(
      'helm-docs', 
      ['--version']
    );
    return true;

  } catch (error) {
    console.log('There was an issue with finding and executing helm-docs.');
    if (enableHelmDocsAutoDownload) {
      await invokeAutoDownload(pluginConfig, context);
    }
  }
}

function verifyChecksum() {
  // todo 
  // verify checksum with some cli tool
}

async function invokeAutoDownload(pluginConfig, context) {
  const { helmDocsVersion } = pluginConfig;
  const tmpDir = '/tmp/helmdocs';
  
  let version = helmDocsVersion;
  if (version == "" || version == undefined) {
    version = "1.11.0";
    console.log(`There were no version in plugin config, downloading version: v${version}`);
  }
  
  console.log(`Downloading helm-docs v${version}...`);
  try {
    let checksumVerified = false;
    await execa(
        'mkdir',
        [ '-p', tmpDir ]
      );
      await execa(
        'curl',
        [ '-sSLo', 'helm-docs.tar.gz', `https://github.com/norwoodj/helm-docs/releases/download/v${version}/helm-docs_${version}_Linux_x86_64.tar.gz` ]
      );

      console.log('verifying checksum');
      checksumVerified = verifyChecksum();
      if (!checksumVerified) {
        throw new AggregateError("Checksum didnt match");
      }

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
      console.log('Failed to install helm-docs: ' + error);
    }

}
