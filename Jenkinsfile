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

            sshPut remote: remote, from: 'dist', into: 'crocodile-prototype-server/'
            sshPut remote: remote, from: 'package.json', into: 'crocodile-prototype-server/'
            
            sshCommand remote: remote, command: "cd crocodile-prototype-server && npm install"
            sshCommand remote: remote, command: "pm2 start crocodile-prototype-server/dist/main.js --name crocodile-prototype-server --watch"
          }   
        }
      }
    }
  }
}
