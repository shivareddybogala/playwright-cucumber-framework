pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    // =============================================================
    // PARAMETERS
    // =============================================================

    parameters {

        choice(
            name: 'TEST_ENV',
            choices: ['LOCAL', 'QA', 'UAT'],
            description: 'Select test environment'
        )

        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )

        string(
            name: 'TAGS',
            defaultValue: '@smoke',
            description: 'Cucumber tags. Example: @smoke or @login'
        )

        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run browser in headless mode'
        )

        booleanParam(
            name: 'PARALLEL',
            defaultValue: false,
            description: 'Run scenarios in parallel'
        )

        choice(
            name: 'WORKERS',
            choices: ['1', '2', '3', '4'],
            description: 'Number of parallel workers'
        )
    }

    // =============================================================
    // STAGES
    // =============================================================

    stages {

        // =========================================================
        // 1. CHECKOUT FROM GITHUB
        // =========================================================

        stage('Checkout') {

            steps {

                checkout scm

                echo '============================================'
                echo '       GITHUB CHECKOUT COMPLETED'
                echo '============================================'

                bat '''
                    echo Current Jenkins workspace:
                    cd

                    echo.
                    echo Workspace contents:
                    dir

                    echo.
                    echo ============================================
                '''
            }
        }

        // =========================================================
        // 2. TEST CONFIGURATION
        // =========================================================

        stage('Test Configuration') {

            steps {

                echo '============================================'
                echo '   PLAYWRIGHT CUCUMBER AUTOMATION'
                echo '============================================'

                echo "Environment : ${params.TEST_ENV}"
                echo "Browser     : ${params.BROWSER}"
                echo "Tags        : ${params.TAGS}"
                echo "Headless    : ${params.HEADLESS}"
                echo "Parallel    : ${params.PARALLEL}"
                echo "Workers     : ${params.WORKERS}"

                echo '============================================'
            }
        }

        // =========================================================
        // 3. ENVIRONMENT CHECK
        // =========================================================

        stage('Environment Check') {

            steps {

                bat '''
                    echo ============================================
                    echo ENVIRONMENT CHECK
                    echo ============================================

                    echo.
                    echo Current directory:
                    cd

                    echo.
                    echo Node version:
                    node --version

                    echo.
                    echo NPM version:
                    npm --version

                    echo.
                    echo Cucumber version:
                    call npx cucumber-js --version

                    echo.
                    echo ============================================
                '''
            }
        }

        // =========================================================
        // 4. INSTALL DEPENDENCIES
        // =========================================================

        stage('Install Dependencies') {

            steps {

                bat '''
                    echo ============================================
                    echo INSTALLING DEPENDENCIES
                    echo ============================================

                    call npm ci

                    echo.
                    echo Installing Playwright browsers...

                    call npx playwright install

                    echo.
                    echo Dependencies installation completed.

                    echo.
                    echo ============================================
                '''
            }
        }

        // =========================================================
        // 5. CLEAN PREVIOUS REPORT
        // =========================================================

        stage('Clean Previous Report') {

            steps {

                bat '''
                    echo ============================================
                    echo CLEANING PREVIOUS REPORT
                    echo ============================================

                    if exist "reports\\cucumber-report.html" (
                        echo Previous cucumber report found.
                        del /f /q "reports\\cucumber-report.html"
                        echo Previous cucumber report deleted.
                    ) else (
                        echo No previous cucumber report found.
                    )

                    if not exist "reports" (
                        echo Reports directory does not exist.
                        mkdir "reports"
                        echo Reports directory created.
                    )

                    echo.
                    echo Reports directory after cleanup:

                    dir "reports"

                    echo.
                    echo ============================================
                '''
            }
        }

        // =========================================================
        // 6. RUN CUCUMBER TESTS
        // =========================================================

        stage('Run Cucumber Tests') {

            steps {

                script {

                    def workers = params.PARALLEL
                        ? params.WORKERS
                        : '1'

                    echo ''
                    echo '============================================'
                    echo 'STARTING CUCUMBER TEST EXECUTION'
                    echo '============================================'

                    echo "Environment : ${params.TEST_ENV}"
                    echo "Browser     : ${params.BROWSER}"
                    echo "Tags        : ${params.TAGS}"
                    echo "Headless    : ${params.HEADLESS}"
                    echo "Parallel    : ${params.PARALLEL}"
                    echo "Workers     : ${workers}"

                    echo ''

                    withEnv([
                        "TEST_ENV=${params.TEST_ENV}",
                        "BROWSER=${params.BROWSER}",
                        "HEADLESS=${params.HEADLESS}",
                        "WORKERS=${workers}"
                    ]) {

                        bat """
                            echo ============================================
                            echo TEST CONFIGURATION
                            echo ============================================

                            echo TEST_ENV=%TEST_ENV%
                            echo BROWSER=%BROWSER%
                            echo HEADLESS=%HEADLESS%
                            echo WORKERS=%WORKERS%

                            echo.

                            echo ============================================
                            echo RUNNING CUCUMBER TESTS
                            echo ============================================

                            call npx cucumber-js ^
                                --tags "${params.TAGS}" ^
                                --parallel ${workers} ^
                                --format progress ^
                                --format html:reports/cucumber-report.html

                            set TEST_EXIT_CODE=%ERRORLEVEL%

                            echo.

                            echo ============================================
                            echo CUCUMBER EXECUTION COMPLETED
                            echo ============================================

                            echo.
                            echo Cucumber report:

                            echo %CD%\\reports\\cucumber-report.html

                            echo.

                            if exist "reports\\cucumber-report.html" (
                                echo Cucumber HTML report generated successfully.
                            ) else (
                                echo ERROR: Cucumber HTML report was NOT generated.
                            )

                            echo.
                            echo ============================================

                            exit /b %TEST_EXIT_CODE%
                        """
                    }
                }
            }
        }

        // =========================================================
        // 7. VERIFY CUCUMBER REPORT
        // =========================================================

        stage('Verify Cucumber Report') {

            steps {

                bat '''
                    echo ============================================
                    echo VERIFYING CUCUMBER HTML REPORT
                    echo ============================================

                    echo.
                    echo Current directory:
                    cd

                    echo.
                    echo Reports directory contents:
                    dir "reports"

                    echo.
                    echo Expected report:
                    echo %CD%\\reports\\cucumber-report.html

                    echo.
                    echo Checking report...

                    if exist "reports\\cucumber-report.html" (

                        echo.
                        echo ============================================
                        echo CUCUMBER HTML REPORT FOUND
                        echo ============================================

                        echo.
                        echo Report details:

                        dir "reports\\cucumber-report.html"

                        echo.
                        echo Report verification successful.

                    ) else (

                        echo.
                        echo ============================================
                        echo ERROR: REPORT NOT FOUND
                        echo ============================================

                        echo.
                        echo Expected:

                        echo %CD%\\reports\\cucumber-report.html

                        echo.
                        echo Available files:

                        dir "reports"

                        echo.
                        echo ============================================

                        exit /b 1
                    )

                    echo.
                    echo ============================================
                    echo REPORT VERIFICATION COMPLETED
                    echo ============================================
                '''
            }
        }

        // =========================================================
        // 8. ARCHIVE REPORT
        // =========================================================

        stage('Archive Cucumber Report') {

            steps {

                archiveArtifacts(
                    artifacts: 'reports/cucumber-report.html',
                    allowEmptyArchive: false,
                    fingerprint: true
                )

                echo 'Cucumber HTML report archived successfully.'
            }
        }

        // =========================================================
        // 9. REPORT INFORMATION
        // =========================================================

        stage('Report Information') {

            steps {

                echo ''
                echo '============================================'
                echo '       CUCUMBER HTML REPORT'
                echo '============================================'

                echo ''
                echo 'Jenkins workspace report:'
                echo "${env.WORKSPACE}\\reports\\cucumber-report.html"

                echo ''
                echo 'Jenkins artifact URL:'
                echo "${env.BUILD_URL}artifact/reports/cucumber-report.html"

                echo ''
                echo 'Published HTML report URL:'
                echo "${env.BUILD_URL}Cucumber_Report/"

                echo ''
                echo '============================================'
            }
        }
    }

    // =============================================================
    // POST ACTIONS
    // =============================================================

    post {

        always {

            echo ''

            echo '============================================'
            echo '           BUILD SUMMARY'
            echo '============================================'

            echo ''

            echo "Environment : ${params.TEST_ENV}"
            echo "Browser     : ${params.BROWSER}"
            echo "Tags        : ${params.TAGS}"
            echo "Headless    : ${params.HEADLESS}"
            echo "Parallel    : ${params.PARALLEL}"
            echo "Workers     : ${params.WORKERS}"

            echo ''

            // -----------------------------------------------------
            // PUBLISH HTML REPORT
            // -----------------------------------------------------

            script {

                if (fileExists('reports/cucumber-report.html')) {

                    echo 'Cucumber HTML report found.'
                    echo 'Publishing Cucumber HTML report...'

                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'cucumber-report.html',
                        reportName: 'Cucumber Report',
                        reportTitles: 'Playwright Cucumber Test Report'
                    ])

                    echo ''
                    echo 'Cucumber Report:'
                    echo "${env.BUILD_URL}Cucumber_Report/"

                } else {

                    echo 'Cucumber HTML report was not generated.'
                    echo 'Skipping HTML Publisher.'
                }
            }

            echo ''

            echo 'Artifact URL:'
            echo "${env.BUILD_URL}artifact/reports/cucumber-report.html"

            echo ''

            echo '============================================'
        }

        success {

            echo ''

            echo '============================================'
            echo '       TEST EXECUTION PASSED'
            echo '============================================'

            echo ''

            echo 'Cucumber Report:'
            echo "${env.BUILD_URL}Cucumber_Report/"

            echo ''

            echo '============================================'
        }

        failure {

            echo ''

            echo '============================================'
            echo '       TEST EXECUTION FAILED'
            echo '============================================'

            echo ''

            echo 'The test execution or report generation failed.'

            echo ''
            echo 'Check the Jenkins Console Output.'

            echo ''
            echo 'Cucumber Report, if generated:'
            echo "${env.BUILD_URL}Cucumber_Report/"

            echo ''

            echo '============================================'
        }
    }
}