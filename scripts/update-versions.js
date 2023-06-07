// Ref: https://github.com/vercel/vercel/blob/9890255dcfec743274a3521b603a67eda3f5fca0/utils/update-gatsby-fixtures.js
const fs = require('node:fs/promises');
const { exec } = require('./exec');
/**
 * invoked by ../.github/workflows/update-docs.yml
 * @param {{ github: ReturnType<import('@actions/github').getOctokit>, context: import('@actions/github').context, core: import('@actions/core') }} param0 Defined by https://github.com/actions/github-script
 * @returns
 */
module.exports = async ({ github, context, core }) => {
    const data = [];
    let counter = 0;
    let page_idx = 1;

    // get all versions and their tags
    // to do this, we iterate through ALL the package versions (a lot of SHA hashes)
    // while finding those versions with tags
    // this ASSUMES that we care about all the tags
    while (true) {
        const { data: versions } =
            await github.rest.packages.getAllPackageVersionsForPackageOwnedByAuthenticatedUser(
                {
                    username: 'joshuanianji',
                    package_name: 'scratch-node-dumb-init',
                    package_type: 'container',
                    per_page: 100,
                    page: page_idx,
                }
            );

        if (versions.length == 0) {
            break;
        }

        for (const version of versions) {
            const tags = version.metadata.container?.tags;
            if (tags && tags.length > 0) {
                console.log(`Version ${version.name} has tags:\n\t${tags}`);
                data.push({
                    name: version.name,
                    tags: tags,
                });
            }
        }

        counter += versions.length;
        page_idx += 1;
    }

    console.log(`Looked at ${counter} versions and ${page_idx} pages`);
    console.log(data);

    for (const datum of data) {
        const imageName = `ghcr.io/joshuanianji/scratch-node-dumb-init:${datum.tags[0]}`;
        exec('docker', ['pull', imageName], true);
        const size = exec(
            'docker',
            ['image', 'inspect', imageName, '--format', '{{.Size}}'],
            true
        );
    }
};
