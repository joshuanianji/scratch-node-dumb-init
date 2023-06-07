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

    let markdown = `| Tags | Size | Architectures |\n| ---- | ---- | ------------- |\n`;

    for (const datum of data) {
        const imageName = `ghcr.io/joshuanianji/scratch-node-dumb-init:${datum.tags[0]}`;
        exec('docker', ['pull', imageName], true);
        const size = exec(
            'docker',
            ['image', 'inspect', imageName, '--format', '{{.Size}}'],
            true
        );
        markdown += `| ${datum.tags
            .map((a) => `\`${a}\``)
            .join(' ')} | ${formatBytes(size)} | \`amd64\` \`arm64\``;
    }
    console.log('METADATA:', metadata);

    // edit METADATA.md with markdown file
    console.log('Editing METADATA.md');
    await fs.writeFile('METADATA.md', markdown);
    console.log('Write file: showing contents');
    exec('cat', ['MARKDOWN.md']);
};

// https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
        'Bytes',
        'KiB',
        'MiB',
        'GiB',
        'TiB',
        'PiB',
        'EiB',
        'ZiB',
        'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
