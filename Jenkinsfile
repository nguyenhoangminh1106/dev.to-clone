pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }

    stage('Code Quality - SonarCloud') {
      steps {
        bat '''
          npm install -g sonar-scanner
          sonar-scanner ^
            -Dsonar.projectKey=your_project_key ^
            -Dsonar.organization=your_org ^
            -Dsonar.token=%SONAR_TOKEN% ^
            -Dsonar.sources=. ^
            -Dsonar.host.url=https://sonarcloud.io
        '''
      }
    }

    stage('Security - Snyk') {
      steps {
        bat '''
          npm install -g snyk
          snyk auth %SNYK_TOKEN%
          snyk test --all-projects --severity-threshold=medium
        '''
      }
    }
  }
}
