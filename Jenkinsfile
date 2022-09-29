pipeline {
  agent { 
    label "ubuntu20"
  }

  stages {
    stage('Build') {
      steps {
        echo '================= [ Start Build ] ================='
        sh "npm install"
        sh "npm run build"
        sh "ls"
        echo '==================================================='
      }
    }
    
    stage('Deploy') {
      steps {
        echo '================= [ Start Deploy ] ================='
        script {
          def remote = [:]
          remote.name = "${REMOTE_NAME}"
          remote.host = "${REMOTE_IP}"
          remote.user = "${REMOTE_USERNAME}"
          remote.allowAnyHosts = true

          withCredentials([
            sshUserPrivateKey(credentialsId: "${REMOTE_NAME}", keyFileVariable: 'identity')
          ]) {
            remote.identityFile = identity

            stage("Copy files to ${REMOTE_NAME}") {
              sshPut remote: remote, from: 'dist', into: "${WGB}/"
              sshPut remote: remote, from: 'package.json', into: "${WGB}/"
              sshPut remote: remote, from: 'config/default.json5', into: "${WGB}/config"
            }
            
            stage("npm install on ${REMOTE_NAME}") {
              sshCommand remote: remote, command: "cd ${WGB} && npm install"
            }

            stage("Start ${WGB} on ${REMOTE_NAME}") {
              sshCommand remote: remote, command: "cd ${WGB} && pm2 start start.${WGB}.config.js"
            }
          }   
        }
        echo '===================================================='
      }
    }
  }
}
