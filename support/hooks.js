const {
    Before,
    After,
    AfterStep,
    setDefaultTimeout
} = require('@cucumber/cucumber');

const {
    chromium,
    firefox,
    webkit
} = require('@playwright/test');

const fs = require('fs');
const path = require('path');

const config = require('./config');
setDefaultTimeout(60 * 1000);


// ======================================================
// BEFORE SCENARIO
// ======================================================

Before(async function (scenario) {

    // Reset step counter for every scenario
    this.stepCounter = 0;

    // Store scenario name in World
    this.scenarioName = scenario.pickle.name;

    console.log(`Starting browser: ${config.browser}`);

    // ------------------------------------------
    // Select browser
    // ------------------------------------------

    if (config.browser === 'firefox') {

        this.browser = await firefox.launch({
            headless: config.headless
        });

    } else if (config.browser === 'webkit') {

        this.browser = await webkit.launch({
            headless: config.headless
        });

    } else {

        this.browser = await chromium.launch({
            headless: config.headless
        });
    }

    // ------------------------------------------
    // Create browser context
    // ------------------------------------------

    this.context = await this.browser.newContext();

    // ------------------------------------------
    // Create page
    // ------------------------------------------

    this.page = await this.context.newPage();

    // ------------------------------------------
    // Open application
    // ------------------------------------------

    await this.page.goto(config.baseUrl);

    console.log(`Opened: ${config.baseUrl}`);
});


// ======================================================
// AFTER EVERY STEP
// ======================================================

AfterStep(async function ({ pickleStep, result }) {

    if (!this.page) {
        return;
    }

    // ------------------------------------------
    // Get scenario name
    // ------------------------------------------

    const scenarioName = this.scenarioName || 'Unknown_Scenario';

    // ------------------------------------------
    // Get step name
    // ------------------------------------------

    const stepText = pickleStep?.text || 'Unknown_Step';

    // ------------------------------------------
    // Increment step counter
    // ------------------------------------------

    this.stepCounter++;

    // ------------------------------------------
    // Clean names for Windows
    // ------------------------------------------

    const cleanScenarioName = scenarioName
        .replace(/[^a-zA-Z0-9]/g, '_');

    const cleanStepName = stepText
        .replace(/[^a-zA-Z0-9]/g, '_');

    // ------------------------------------------
    // Create screenshot directory
    // ------------------------------------------

    const screenshotDir = path.join(
        process.cwd(),
        'reports',
        'screenshots',
        cleanScenarioName
    );

    if (!fs.existsSync(screenshotDir)) {

        fs.mkdirSync(screenshotDir, {
            recursive: true
        });
    }

    // ------------------------------------------
    // Screenshot filename
    // ------------------------------------------

    const screenshotName =
        `${String(this.stepCounter).padStart(2, '0')}_${cleanStepName}.png`;

    const screenshotPath = path.join(
        screenshotDir,
        screenshotName
    );

    try {

        // ------------------------------------------
        // Take screenshot
        // ------------------------------------------

        await this.page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        // ------------------------------------------
        // Attach screenshot to Cucumber report
        // ------------------------------------------

        const screenshot = fs.readFileSync(
            screenshotPath
        );

        await this.attach(
            screenshot,
            'image/png'
        );

        console.log(
            `Screenshot captured: ${screenshotName}`
        );

        // ------------------------------------------
        // Print step result
        // ------------------------------------------

        console.log(
            `Step status: ${result?.status}`
        );

    } catch (error) {

        console.error(
            `Screenshot failed: ${error.message}`
        );
    }
});


// ======================================================
// AFTER SCENARIO
// ======================================================

After(async function (scenario) {

    console.log(
        `Scenario status: ${scenario.result?.status}`
    );

    // ------------------------------------------
    // Close context
    // ------------------------------------------

    if (this.context) {

        await this.context.close();
    }

    // ------------------------------------------
    // Close browser
    // ------------------------------------------

    if (this.browser) {

        await this.browser.close();
    }
});