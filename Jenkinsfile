pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')
    SNYK_TOKEN = credentials('snyk-token')
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/your-username/devto-clone.git'
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Code Quality - SonarCloud') {
      steps {
        sh '''
          npm install -g sonar-scanner
          sonar-scanner \
            -Dsonar.projectKey=your_project_key \
            -Dsonar.organization=your_org \
            -Dsonar.token=$SONAR_TOKEN \
            -Dsonar.sources=. \
            -Dsonar.host.url=https://sonarcloud.io
        '''
      }
    }

    stage('Security - Snyk') {
      steps {
        sh '''
          npm install -g snyk
          snyk test --all-projects --severity-threshold=medium
        '''
      }
    }
  }
}
