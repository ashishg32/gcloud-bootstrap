module.exports = {
    presets: [
        '@babel/preset-env', // For compiling modern JavaScript
        '@babel/preset-typescript', // For compiling TypeScript
    ],
    plugins: [
        '@babel/plugin-transform-modules-commonjs', // To use CommonJS modules in Node.js
    ],
};
