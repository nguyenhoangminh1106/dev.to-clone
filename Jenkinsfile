pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')
    DATABASE_URL = credentials('7.4D-DEV_DATABASE_URL')
    NEXTAUTH_SECRET = credentials('7.4D-NEXTAUTH_SECRET')
    NEXTAUTH_URL = credentials('7.4D-NEXTAUTH_URL')
    GITHUB_CLIENT_ID = credentials('7.4D-GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = credentials('7.4D-GITHUB_CLIENT_SECRET')
    GOOGLE_CLIENT_ID = credentials('7.4D-GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('7.4D-GOOGLE_CLIENT_SECRET')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

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
          set PATH=%APPDATA%\\npm;%PATH%
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
        bat '''
          npm install -g snyk
          set PATH=%APPDATA%\\npm;%PATH%
          snyk test --all-projects
        '''
      }
    }

    stage('Deploy - Docker Compose') {
      steps {
        bat '''
          echo DATABASE_URL=postgresql://user:password@db:5432/devto > .env
          echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET% >> .env
          echo NEXTAUTH_URL=%NEXTAUTH_URL% >> .env
          echo GITHUB_CLIENT_ID=%GITHUB_CLIENT_ID% >> .env
          echo GITHUB_CLIENT_SECRET=%GITHUB_CLIENT_SECRET% >> .env
          echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% >> .env
          echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET% >> .env
    
          docker-compose down || echo "Clean up"
          docker-compose build ^
            --build-arg DATABASE_URL=%DATABASE_URL% ^
            --build-arg NEXTAUTH_SECRET=%NEXTAUTH_SECRET% ^
            --build-arg NEXTAUTH_URL=%NEXTAUTH_URL% ^
            --build-arg GITHUB_CLIENT_ID=%GITHUB_CLIENT_ID% ^
            --build-arg GITHUB_CLIENT_SECRET=%GITHUB_CLIENT_SECRET% ^
            --build-arg GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% ^
            --build-arg GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%
    
          docker-compose up -d
        '''
      }
    }
  }
}
