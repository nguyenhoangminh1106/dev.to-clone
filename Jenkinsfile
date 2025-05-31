pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_TOKEN = credentials('SNYK_TOKEN')
    DATABASE_URL = credentials('7.4D-DEV_DATABASE_URL')
    NEXTAUTH_SECRET = credentials('7.4D-NEXTAUTH_SECRET')
    NEXTAUTH_URL = credentials('7.4D-DEV_NEXTAUTH_URL')
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
      environment {
        scannerHome = tool 'SonarScanner';
      }
      steps {
        withSonarQubeEnv(credentialsId: 'SONAR_TOKEN', installationName: 'SonarCloud') {
          bat "${scannerHome}\\bin\\sonar-scanner.bat"
        }
      }
    }

    stage('Security - Snyk') {
      steps {
        withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
          bat '''
            npm install -g snyk
            snyk auth %SNYK_TOKEN%
            snyk test
          '''
        }
      }
    }

    stage('Deploy - Docker Compose') {
      steps {
        bat '''
          echo DATABASE_URL=%DATABASE_URL% > .env
          echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET% >> .env
          echo NEXTAUTH_URL=%NEXTAUTH_URL% >> .env
          echo GITHUB_CLIENT_ID=%GITHUB_CLIENT_ID% >> .env
          echo GITHUB_CLIENT_SECRET=%GITHUB_CLIENT_SECRET% >> .env
          echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% >> .env
          echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET% >> .env

          docker-compose down || echo "Clean up"
          docker-compose build --build-arg DATABASE_URL=%DATABASE_URL% ^
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

    stage('Wait for DB Ready') {
      steps {
        bat '''
          FOR /L %%i IN (1,1,30) DO (
            docker-compose exec db pg_isready -U postgres -h db -p 5432 && EXIT /B 0
            ECHO Waiting for db... %%i
            timeout /t 2 >nul
          )
        '''
      }
    }

    stage('Migrate DB') {
      steps {
        bat 'docker-compose exec web npx prisma db push'
      }
    }
  }
}
