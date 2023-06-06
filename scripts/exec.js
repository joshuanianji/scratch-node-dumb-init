const { execFileSync } = require('node:child_process');

/**
 * Executes a command in bash.
 * Using JSDoc for type interence poggers
 *
 * ttps://github.com/vercel/vercel/blob/9890255dcfec743274a3521b603a67eda3f5fca0/utils/exec.js
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {boolean | undefined} logOutput
 * @param {any} opts
 * @returns {string} output
 */
function exec(cmd, args, logOutput, opts) {
    console.log({ input: `${cmd} ${args.join(' ')}` });
    const output = execFileSync(cmd, args, {
        encoding: 'utf-8',
        ...opts,
    }).trim();
    if (logOutput) {
        console.log({ output });
        console.log();
    }
    return output;
}

module.exports = {
    exec,
};
