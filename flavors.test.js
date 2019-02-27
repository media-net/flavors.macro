const pluginTester = require('babel-plugin-tester')
const plugin = require("babel-plugin-macros");

pluginTester({
    plugin,
    snapshot: false,

    babelOptions: { filename: __filename },
    tests: [
        {
            code: `
                import flavors from './src/macro.js'
                import a from './asdasd'
                import b from './asdasd.default'

                flavors();
            `,
            output: `
                import a from './asdasd';
                import b from './asdasd.green';
            `
        }
    ],
})
