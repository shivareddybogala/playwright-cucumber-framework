pipeline {

    agent any

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


    environment {

        PROJECT_DIR = 'S:\\Playwright\\newplaywright\\playwright-cucumber-framework'

    }


    stages {

        // =========================================================
        // 1. DISPLAY PARAMETERS
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
        // 2. CHECK NODE / NPM
        // =========================================================

        stage('Environment Check') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    bat '''
                        echo ============================================
                        echo NODE VERSION
                        echo ============================================

                        node --version
                        npm --version

                        echo.
                        echo CURRENT DIRECTORY
                        cd
                    '''
                }
            }
        }


        // =========================================================
        // 3. INSTALL DEPENDENCIES
        // =========================================================

        stage('Install Dependencies') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    bat '''
                        echo ============================================
                        echo INSTALLING DEPENDENCIES
                        echo ============================================

                        call npm install

                        echo.
                        echo Installing Playwright browsers...

                        call npx playwright install
                    '''
                }
            }
        }


        // =========================================================
        // 4. CLEAN OLD REPORT
        // =========================================================

        stage('Clean Previous Reports') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    bat '''
                        echo ============================================
                        echo CLEANING OLD CUCUMBER REPORT
                        echo ============================================

                        if exist reports\\cucumber-report.html (
                            del /f /q reports\\cucumber-report.html
                        )

                        echo Old cucumber-report.html removed.

                        echo.
                        echo Reports directory:

                        if exist reports (
                            dir reports
                        ) else (
                            echo Reports directory does not exist.
                            mkdir reports
                        )
                    '''
                }
            }
        }


        // =========================================================
        // 5. RUN CUCUMBER TESTS
        // =========================================================

        stage('Run Cucumber Tests') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    script {

                        def workers = params.PARALLEL
                            ? params.WORKERS
                            : '1'


                        echo '============================================'
                        echo 'STARTING TEST EXECUTION'
                        echo '============================================'

                        echo "Environment : ${params.TEST_ENV}"
                        echo "Browser     : ${params.BROWSER}"
                        echo "Tags        : ${params.TAGS}"
                        echo "Headless    : ${params.HEADLESS}"
                        echo "Parallel    : ${params.PARALLEL}"
                        echo "Workers     : ${workers}"


                        withEnv([
                            "TEST_ENV=${params.TEST_ENV}",
                            "BROWSER=${params.BROWSER}",
                            "HEADLESS=${params.HEADLESS}",
                            "WORKERS=${workers}"
                        ]) {

                            bat """
                                echo ============================================
                                echo TEST ENVIRONMENT
                                echo ============================================

                                echo TEST_ENV=%TEST_ENV%
                                echo BROWSER=%BROWSER%
                                echo HEADLESS=%HEADLESS%
                                echo WORKERS=%WORKERS%

                                echo.
                                echo ============================================
                                echo RUNNING CUCUMBER
                                echo ============================================

                                call npx cucumber-js --tags "${params.TAGS}" --parallel ${workers}

                                exit /b %ERRORLEVEL%
                            """
                        }
                    }
                }
            }
        }


        // =========================================================
        // 6. VERIFY CUCUMBER HTML REPORT
        // =========================================================

        stage('Verify Cucumber Report') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    bat '''
                        echo ============================================
                        echo VERIFYING CUCUMBER HTML REPORT
                        echo ============================================

                        echo.
                        echo Workspace:
                        cd

                        echo.
                        echo Expected report:

                        echo S:\\Playwright\\newplaywright\\playwright-cucumber-framework\\reports\\cucumber-report.html

                        echo.
                        echo Checking report...

                        if exist reports\\cucumber-report.html (

                            echo.
                            echo ============================================
                            echo CUCUMBER HTML REPORT FOUND
                            echo ============================================

                            echo.
                            dir reports\\cucumber-report.html

                        ) else (

                            echo.
                            echo ============================================
                            echo ERROR: CUCUMBER HTML REPORT NOT FOUND
                            echo ============================================

                            echo.
                            echo Expected:
                            echo reports\\cucumber-report.html

                            exit /b 1
                        )
                    '''
                }
            }
        }


        // =========================================================
        // 7. PUBLISH CUCUMBER HTML REPORT
        // =========================================================

        stage('Publish Cucumber HTML Report') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    echo '============================================'
                    echo 'PUBLISHING CUCUMBER HTML REPORT'
                    echo '============================================'

                    echo "Report directory: ${env.PROJECT_DIR}\\reports"
                    echo "Report file     : ${env.PROJECT_DIR}\\reports\\cucumber-report.html"


                    publishHTML(target: [

                        // Report must exist
                        allowMissing: false,

                        // Show report on latest build
                        alwaysLinkToLastBuild: true,

                        // Keep report for every build
                        keepAll: true,

                        // IMPORTANT:
                        // Relative to PROJECT_DIR/workspace
                        reportDir: 'reports',

                        // The actual HTML file generated by Cucumber
                        reportFiles: 'cucumber-report.html',

                        // Name shown in Jenkins
                        reportName: 'Cucumber HTML Report',

                        // Supporting files used by the report
                        includes: '''
                            cucumber-report.html,
                            **/*.css,
                            **/*.js,
                            **/*.png,
                            **/*.jpg,
                            **/*.jpeg,
                            **/*.gif,
                            **/*.svg
                        ''',

                        // Keep underscores as-is
                        escapeUnderscores: false,

                        // Use the report wrapper directly
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }


        // =========================================================
        // 8. ARCHIVE SCREENSHOTS ONLY
        // =========================================================

        stage('Archive Screenshots') {

            steps {

                dir("${env.PROJECT_DIR}") {

                    script {

                        if (fileExists('reports')) {

                            echo 'Archiving screenshots only...'

                            archiveArtifacts(
                                artifacts: 'reports/**/*.png',
                                allowEmptyArchive: true,
                                fingerprint: true
                            )

                        } else {

                            echo 'No reports directory found.'
                        }
                    }
                }
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

            echo "Environment : ${params.TEST_ENV}"
            echo "Browser     : ${params.BROWSER}"
            echo "Tags        : ${params.TAGS}"
            echo "Headless    : ${params.HEADLESS}"
            echo "Parallel    : ${params.PARALLEL}"
            echo "Workers     : ${params.WORKERS}"

            echo ''

            echo '============================================'
            echo 'Cucumber HTML Report'
            echo '============================================'

            echo 'Report generated at:'
            echo "${env.PROJECT_DIR}\\reports\\cucumber-report.html"

            echo ''

            echo 'The report is published on the Jenkins build page.'
        }


        success {

            echo ''

            echo '============================================'
            echo '       TEST EXECUTION PASSED'
            echo '============================================'

            echo ''
        }


        failure {

            echo ''

            echo '============================================'
            echo '       TEST EXECUTION FAILED'
            echo '============================================'

            echo ''

            echo 'Open the Jenkins console and Cucumber report'
            echo 'to investigate the failure.'

            echo ''
        }
    }
}