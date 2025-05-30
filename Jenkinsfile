pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')

    DATABASE_URL = 'postgresql://user:password@db:5432/devto'

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
        bat """
          npm install -g sonar-scanner
          set PATH=%APPDATA%\\npm;%PATH%
          sonar-scanner ^
            -Dsonar.projectKey=devto-clone ^
            -Dsonar.organization=your_org ^
            -Dsonar.host.url=https://sonarcloud.io ^
            -Dsonar.login=%SONAR_TOKEN%
        """
      }
    }

    stage('Security - Snyk') {
      steps {
        bat """
          npm install -g snyk
          set PATH=%APPDATA%\\npm;%PATH%
          snyk test --all-projects
        """
      }
    }

    stage('Deploy - Docker Compose') {
      steps {
        bat 'docker-compose down || echo "Clean up"'
        bat 'docker-compose build'
        bat 'docker-compose up -d'
        bat 'docker-compose exec web npx prisma db push'
      }
    }
  }
}
