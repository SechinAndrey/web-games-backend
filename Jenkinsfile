pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh "npm install"
        sh "npm run build"
        sh "ls"
      }
    }
    stage('Deploy') {
      steps {
        script {
          def remote = [:]
          remote.name = "${REMOTE_NAME}"
          remote.host = "${REMOTE_IP}"
          remote.user = "${REMOTE_USERNAME}"
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(credentialsId: "${REMOTE_NAME}", keyFileVariable: 'identity')]) {
            remote.identityFile = identity

            sshPut remote: remote, from: 'dist', into: "${WGB}/"
            sshPut remote: remote, from: 'package.json', into: "${WGB}/"
            
            sshCommand remote: remote, command: "cd ${WGB} && npm install"
            sshCommand remote: remote, command: "pm2 start ${WGB}/dist/main.js --name ${WGB} --watch"
          }   
        }
      }
    }
  }
}
