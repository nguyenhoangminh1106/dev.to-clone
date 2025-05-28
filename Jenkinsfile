pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')
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
        bat 'npm install -g sonar-scanner'
        bat '''
          sonar-scanner ^
            -Dsonar.projectKey=devto-clone ^
            -Dsonar.organization=your_org ^
            -Dsonar.host.url=https://sonarcloud.io ^
            -Dsonar.login=%SONAR_TOKEN%
        '''
      }
    }

    stage('Security - Snyk') {
      steps {
        bat 'npm install -g snyk'
        bat 'snyk test --all-projects'
      }
    }

    stage('Deploy - Docker') {
      steps {
        bat '''
          docker stop devto-app || echo "Not running"
          docker rm devto-app || echo "No container"

          docker build -t devto-clone .

          docker run -d --name devto-app -p 3000:3000 ^
            -e DATABASE_URL=%DATABASE_URL% ^
            -e NEXTAUTH_SECRET=%NEXTAUTH_SECRET% ^
            -e NEXTAUTH_URL=%NEXTAUTH_URL% ^
            -e GITHUB_CLIENT_ID=%GITHUB_CLIENT_ID% ^
            -e GITHUB_CLIENT_SECRET=%GITHUB_CLIENT_SECRET% ^
            -e GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% ^
            -e GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET% ^
            devto-clone
        '''
      }
    }
  }
}
