#!/usr/bin/env

def stack_name = 'membership'
def cli_version = 'v0.5.0'
def compose_version = 'v0.12.4'
def image_name = "membership\\/energypoint"
def image_version = ''


pipeline{
    agent any

    stages{
        stage('checkout code'){
            steps{
                echo 'checkout code';
                checkout scm
                if (env.BRANCH_NAME != 'master') {
                        image_version = "SNAPSHOT-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                        image_version = image_version.replace('/','-')
                } else {
                        image_version = "${env.BUILD_NUMBER}"
                }
            }
        }

        stage('execute unit test'){
            steps {
                echo 'build jar package and execute unit tests'
                withMaven(jdk: 'java1.8',
                          maven: 'maven3.5') {
                    // Run unit test
                    // sh "swagger project test"
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
                echo 'version number : ${image_version}'
                script {
                    def image
                    image = docker.build("membership/energypoint:latest", ".")

                    docker.withRegistry('https://registry-cn-local.subsidia.org','nexusAccount'){
                        image.push("${image_version}")
                        image.push("latest")
                    }
                }
            }
        }

        stage('Preprare Rancher deployment') {
            when { branch 'master' }
            steps{
               echo "downloading cli component"
               sh "wget http://nexus.osiris.withoxylane.com/service/local/repositories/utils/content/rancher/rancher-compose-linux-amd64-${compose_version}.tar.gz -O - | tar -zx"
               sh "wget http://nexus.osiris.withoxylane.com/service/local/repositories/utils/content/rancher/rancher-linux-amd64-${cli_version}.tar.gz -O - | tar -zx"
               sh "mv rancher-compose-${compose_version}/rancher-compose . && rm -rf rancher-compose-${compose_version}"
               sh "mv rancher-${cli_version}/rancher . && rm -rf rancher-${cli_version}"
            }
        }


        stage('Deploy to Preprod') {
            when { branch 'master' }
            steps{
                script {
                    try {
                        sh "./rancher --url http://rancher.preprod.subsidia.org --access-key 80B114664A15F9ED6D0F --secret-key au1YAZKApmBaAw6qMm2tEmxuyFpgg3UbsXBiQRqq export ${stack_name}"
                        sh "mv ${stack_name}/*-compose.yml ."
                    } catch (Exception err) {
                        echo "Stack not found"
                    }
                    sh "sed -i \"s/${image_name}:.*\$/${image_name}:${image_version}/g\" docker-compose.yml"
                    sh "./rancher-compose --project-name ${stack_name} --url http://rancher.preprod.subsidia.org --access-key 80B114664A15F9ED6D0F --secret-key au1YAZKApmBaAw6qMm2tEmxuyFpgg3UbsXBiQRqq --verbose up -d --force-upgrade --pull --confirm-upgrade energypoint"
                }
            }
        }
    }
}