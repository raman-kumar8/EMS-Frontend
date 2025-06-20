pipeline {
    agent any

    environment {
        IMAGE_NAME = "raman84/ems-frontend"
        IMAGE_TAG = "latest"
        DOCKER_HUB_CREDS = "docker-hub-credentials"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/raman-kumar8/EMS-Frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

     stage('Re-deploy with Docker Compose') {
    steps {
        sh """
            docker-compose -f /opt/ems-deploy/docker-compose.yml stop frontend || true
            docker-compose -f /opt/ems-deploy/docker-compose.yml rm -f frontend || true
            docker rmi raman84/ems-frontend:latest || true
            docker-compose -f /opt/ems-deploy/docker-compose.yml pull frontend
            docker-compose -f /opt/ems-deploy/docker-compose.yml up -d --no-deps frontend
        """
    }
}


    }
}
