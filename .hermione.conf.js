module.exports = {
    browsers: {
        chrome: {
            automationProtocol: 'devtools',
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },
    plugins: {
        "html-reporter/hermione": {
            path: 'hermione-html-reporter'
        }
    }
};