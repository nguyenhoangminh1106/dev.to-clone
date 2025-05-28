pipeline {
  agent any

  environment {
    // Tokens
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')

    // Environment variables for build (linked to Jenkins credentials)
    DATABASE_URL = credentials('7.4D-DATABASE_URL')
    NEXTAUTH_SECRET = credentials('7.4D-NEXTAUTH_SECRET')
    NEXTAUTH_URL = credentials('7.4D-NEXTAUTH_URL')
    GITHUB_CLIENT_ID = credentials('7.4D-GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = credentials('7.4D-GITHUB_CLIENT_SECRET')
    GOOGLE_CLIENT_ID = credentials('7.4D-GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('7.4D-GOOGLE_CLIENT_SECRET')
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
