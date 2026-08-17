module.exports = {
    default: {

        require: [
            'step-definitions/**/*.js',
            'support/**/*.js'
        ],

        paths: [
            'features/**/*.feature'
        ],

        format: [
            'progress',
            'html:reports/cucumber-report.html',
            'junit:reports/cucumber-results.xml'
        ],

        publishQuiet: true
    }
};