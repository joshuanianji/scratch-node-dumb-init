const { execFileSync } = require('node:child_process');

// https://github.com/vercel/vercel/blob/9890255dcfec743274a3521b603a67eda3f5fca0/utils/exec.js
function exec(cmd, args, opts) {
    console.log({ input: `${cmd} ${args.join(' ')}` });
    const output = execFileSync(cmd, args, {
        encoding: 'utf-8',
        ...opts,
    }).trim();
    console.log({ output });
    console.log();
    return output;
}

module.exports = {
    exec,
};
