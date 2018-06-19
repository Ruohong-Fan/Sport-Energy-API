#!/usr/bin/env

pipeline{
    agent any

    stages{
        stage('checkout code'){
            steps{
                echo 'checkout code';
                checkout scm
            }
        }

        stage('execute unit test'){
            steps {
                echo 'build jar package and execute unit tests'
                withMaven(jdk: 'java1.8',
                          maven: 'maven3.5') {
                    // Run unit test
                    sh "npm test"
                }
            }
        }

        stage('sonar check'){
            steps {
                echo 'sonar check'
            }
        }

        stage('build docker image and upload'){
            steps {
                echo 'build docker image and upload'
                echo 'version number : ${env.BUILD_ID}'
                script {
                    def image
                    image = docker.build("membership/energypoint:latest", ".")

                    docker.withRegistry('https://registry-cn-local.subsidia.org','nexusAccount'){
                        image.push("${env.BUILD_ID}")
                        image.push("latest")
                    }
                }
                echo 'clean generated image'
                sh 'docker rmi -f $(docker images -a -q|sed -n "1p;1q")'
            }
        }

        stage('deploy on preprod'){
            steps {
                echo 'deploy on preprod'
                echo 'call rancher plugin for the preprod'
            }
        }

        stage('execute TNR'){
            steps {
                echo 'execute TNR'
            }
        }
    }
}