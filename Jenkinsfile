
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Atlas of Making from GitHub.'
                git branch: 'main',
                    url: 'https://github.com/itspriyanshurai/atlas-of-making-portfolio.git'
            }
        }

        stage('Verify Project Files') {
            steps {
                sh 'test -f package.json'
                sh 'test -f package-lock.json'
                sh 'test -f Dockerfile'
                echo 'Required project files verified.'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Portfolio') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Verify Build Output') {
            steps {
                sh 'test -f dist/index.html'
                sh 'ls -lh dist'
            }
        }
    }

    post {
        success {
            echo 'Portfolio build completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
