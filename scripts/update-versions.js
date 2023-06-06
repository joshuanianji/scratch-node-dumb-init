// Ref: https://github.com/vercel/vercel/blob/9890255dcfec743274a3521b603a67eda3f5fca0/utils/update-gatsby-fixtures.js
/**
 * invoked by ../.github/workflows/update-docs.yml
 * @param {{ github: ReturnType<import('@actions/github').getOctokit>, context: import('@actions/github').context, core: import('@actions/core') }} param0 Defined by https://github.com/actions/github-script
 * @returns
 */
module.exports = async ({ github, context, core }) => {
    const packageVersions =
        await github.rest.packages.getAllPackageVersionsForPackageOwnedByUser({
            username: context.repo.owner,
            package_name: context.repo.repo,
            package_type: 'docker',
        });

    for (const version of packageVersions.data) {
        console.log(version);
    }
};
