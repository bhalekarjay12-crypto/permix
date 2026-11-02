pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out PermiX source code'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Code Quality Check') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Automated Testing') {
            steps {
                sh 'mkdir -p test-results'
                sh 'npm test -- --reporter=junit --outputFile=test-results/results.xml'
            }
        }

        stage('Production Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true,
                  testResults: 'test-results/*.xml'
        }

        success {
            echo 'PermiX CI pipeline completed successfully!'
        }

        failure {
            echo 'PermiX CI pipeline failed. Check the console output.'
        }
    }
}
