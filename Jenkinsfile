
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
                sh 'pwd'
                sh 'ls -la'
                sh 'test -f package.json'
                sh 'test -f Dockerfile'
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
