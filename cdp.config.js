exports.config = {
    runner: 'local',
    specs: [
        './wdio/*.spec.js',
    ],
    automationProtocol: 'devtools',
    exclude: [],
    path: '/wd/hub',
    maxInstances: 2,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--window-size=1900,900'],
        },
        'wdio:devtoolsOptions': {
            headless: false,
        },
    }],

    logLevel: 'info',
    bail: 0,

    baseUrl: 'http://localhost',

    waitforTimeout: 10000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,
    services: ['devtools'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
};
