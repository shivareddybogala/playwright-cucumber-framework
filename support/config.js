require('dotenv').config();

const environments = {

    LOCAL: {
        baseUrl: 'https://www.saucedemo.com'
    },

    QA: {
        baseUrl: 'https://www.saucedemo.com'
    },

    UAT: {
        baseUrl: 'https://www.saucedemo.com'
    }
};

const environment =
    process.env.TEST_ENV || 'LOCAL';

const selectedEnvironment =
    environments[environment];

if (!selectedEnvironment) {
    throw new Error(
        `Unknown environment: ${environment}`
    );
}

module.exports = {

    environment,

    baseUrl:
        process.env.BASE_URL ||
        selectedEnvironment.baseUrl,

    browser:
        process.env.BROWSER ||
        'chromium',

    headless:
        process.env.HEADLESS !== 'false'
};