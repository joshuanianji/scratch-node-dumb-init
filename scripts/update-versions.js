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
        exec(
            'docker',
            ['load', '--input', `${parentPath}/${folder}/${folder}.tar`],
            true
        );
    }

    const output = exec(
        'docker',
        [
            'image',
            'ls',
            '-a',
            '--format',
            '{{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.ID}}',
        ],
        false
    );

    // create some data structures to hold the image information
    // note we want the images to be sorted in descending order according to the node version
    const images = new Map();

    // skip the first line
    for (const line of output.split('\n').slice(1)) {
        [repo, tag, size, id] = line.split('\t');
        if (repo != 'mcr.microsoft.com/devcontainers/miniconda') {
            continue;
        }

        const meta = images.get(id);
        if (meta == undefined) {
            images.set(id, { tags: [tag], size: size });
        } else {
            images.set(id, { tags: [tag, ...meta.tags], size: size });
        }
    }

    console.log(images);

    for (const [id, meta] of images.entries()) {
        meta.tags.sort((a, b) => b.length - a.length);
    }

    console.log(images);

    const metadatas = Array.from(images.entries()).map(([id, meta]) => meta);
    metadatas.sort(
        (a, b) => Number.parseInt(a.tags[0]) - Number.parseInt(b.tags[0])
    );
    console.log(metadatas);
};
