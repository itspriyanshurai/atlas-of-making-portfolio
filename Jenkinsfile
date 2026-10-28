
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '669003565896'
        ECR_REPOSITORY = 'atlas-portfolio'
        IMAGE_TAG = "${BUILD_NUMBER}"
        ECR_REGISTRY = '669003565896.dkr.ecr.ap-south-1.amazonaws.com'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/itspriyanshurai/atlas-of-making-portfolio.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Build Portfolio') {
            steps {
                sh 'npm run build'
                sh 'test -f dist/index.html'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t atlas-portfolio:${BUILD_NUMBER} .'
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region "$AWS_REGION" |
                    docker login --username AWS --password-stdin "$ECR_REGISTRY"
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker tag atlas-portfolio:${BUILD_NUMBER} \
                      "$ECR_REGISTRY/$ECR_REPOSITORY:${BUILD_NUMBER}"

                    docker push "$ECR_REGISTRY/$ECR_REPOSITORY:${BUILD_NUMBER}"
                '''
            }
        }
    }

    post {
        success {
            echo 'Portfolio built and Docker image pushed to Amazon ECR.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
        always {
            sh 'docker logout "$ECR_REGISTRY" || true'
        }
    }
}
