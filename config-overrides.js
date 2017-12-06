const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess(config, env, {
        modifyVars: { "@primary-color": "#4A0627", "@normal-color": "#331507" },
    });
    return config;
};