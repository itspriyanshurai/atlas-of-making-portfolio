pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Jenkins pipeline started for Atlas of Making.'
                git branch: 'main',
                    url: 'https://github.com/itspriyanshurai/atlas-of-making-portfolio.git'
            }
        }

        stage('Verify Project Files') {
            steps {
                powershell 'Get-ChildItem'
                powershell 'if (!(Test-Path package.json)) { throw "package.json not found" }'
                powershell 'if (!(Test-Path Dockerfile)) { throw "Dockerfile not found" }'
            }
        }
    }

    post {
        success {
            echo 'Portfolio source checkout and file verification succeeded.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
