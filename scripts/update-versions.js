// Ref: https://github.com/vercel/vercel/blob/9890255dcfec743274a3521b603a67eda3f5fca0/utils/update-gatsby-fixtures.js
const fs = require('node:fs/promises');
const { exec } = require('./exec');
/**
 * invoked by ../.github/workflows/update-docs.yml
 * @param {{ github: ReturnType<import('@actions/github').getOctokit>, context: import('@actions/github').context, core: import('@actions/core') }} param0 Defined by https://github.com/actions/github-script
 * @returns
 */
module.exports = async ({ github, context, core }) => {
    // we first load all the artifacts into docker using docker --load
    // artifacts are located in /tmp/artifacts/image-{NODE_VERSION}/image-{NODE_VERSION}.tar
    const parentPath = '/tmp/artifacts';
    const contents = await fs.readdir(parentPath);
    for (const folder of contents) {
        exec('docker', [
            'load',
            '--input',
            `${parentPath}/${folder}/${folder}.tar`,
        ]);
    }

    exec('docker', ['image', 'ls', '-a']);
};
