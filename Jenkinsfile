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

        stage('Docker Build') {
            steps {
                sh 'docker build -t permix:devops-v1 .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f permix || true

                    docker run -d \
                        --name permix \
                        --restart unless-stopped \
                        -p 8085:80 \
                        permix:devops-v1
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    docker ps --filter name=^/permix$
                    docker exec permix wget -qO- http://localhost/ > /dev/null
                    echo "PermiX deployment successful!"
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true,
                  testResults: 'test-results/*.xml'
        }

        success {
            echo 'PermiX CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'PermiX pipeline failed. Check the console output.'
        }
    }
}
