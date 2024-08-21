pipeline {
    agent {
        label 'dev-fe'
        }

    environment {
        APP_PORT=1000
        def BUILD_VERSION = sh(script: "echo `date +%s`", returnStdout: true).trim()
        IMAGE_NAME='webecommerce'
        REPLICAS=1
        SERVICE_NAME='webecommerce'
        NEXT_PUBLIC_ANALYTICS_ID='UA-114361661-6'
        URL_ASSET_PROFILE='https://lakuemasdev.oss-ap-southeast-5.aliyuncs.com/ecommerce/profile/'
        URL_ASSET_PRODUCT='https://lakuemasdev.oss-ap-southeast-5.aliyuncs.com/ecommerce/product/'
        URL_ASSET_SLIDER='https://lakuemasdev.oss-ap-southeast-5.aliyuncs.com/ecommerce/slider/'
        BASE_URL='https://godev.lakushop.id'
        URL_LINKAGE='https://test-member.lakuemas.com'
	    APIKEY='AIzaSyAT7JYCxE8bKP4C4bpZK4xwDlNGal5J7to'
	    AUTHDOMAIN='webcommerce-afab4.firebaseapp.com'
	    PROJECTID='webcommerce-afab4'
	    STORAGEBUCKET='webcommerce-afab4.appspot.com'
	    MESSAGESENDERID='477400052920'
	    APPID='1:477400052920:web:f31fcaa0c7390671b0704d'
	    MEASUREMENTID='G-2XNF10PT11'
        }

        stages {
        stage('Clone Repo') {
            steps {
                echo 'rsync Source Code from Temporary Folder to Application Folder is DONE'
                sh 'sudo rm -R /var/www/webecommerce'
                sh 'sudo /usr/bin/rsync -aqz /home/ubuntu/workspace/webecommerce/ /var/www/webecommerce --exclude \'.git\' --log-file=/home/ubuntu/log/webecommerce.log --log-file-format="%t %f %b"'
            }
        }
         stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Build Image') {
            steps {
                sh 'yarn run build'
                sh 'sudo docker build --build-arg="NEXT_PUBLIC_ANALYTICS_ID=${NEXT_PUBLIC_ANALYTICS_ID}" --build-arg="URL_LINKAGE=${URL_LINKAGE}" --build-arg="URL_ASSET_SLIDER=${URL_ASSET_SLIDER}" --build-arg="URL_ASSET_PROFILE=${URL_ASSET_PROFILE}" --build-arg="URL_ASSET_PRODUCT=${URL_ASSET_PRODUCT}" --build-arg="BASE_URL=${BASE_URL}" --build-arg="APIKEY=${APIKEY}" --build-arg="AUTHDOMAIN=${AUTHDOMAIN}" --build-arg="PROJECTID=${PROJECTID}" --build-arg="STORAGEBUCKET=${STORAGEBUCKET}" --build-arg="MESSAGESENDERID=${MESSAGESENDERID}" --build-arg="APPID=${APPID}" --build-arg="MEASUREMENTID=${MEASUREMENTID}" -t ${IMAGE_NAME}:${BUILD_VERSION} /var/www/webecommerce'
                echo 'Build Image is DONE'
            }
        }
        stage('Create / Update Service') {
            steps {
                echo 'Staring Create / Update Service'
                script {
                    try {
                        echo 'Staring Create Service'
                        sh 'sudo docker service create --name ${SERVICE_NAME} --replicas ${REPLICAS} -p ${APP_PORT}:80 ${IMAGE_NAME}:${BUILD_VERSION}'
                        echo 'Create Service DONE'
                    } catch (Exception e) {
                        echo 'Create Service FAILED'
                        echo 'Staring Update Service'
                        sh 'sudo docker service update --image ${IMAGE_NAME}:${BUILD_VERSION} --update-failure-action=rollback ${SERVICE_NAME}'
                        echo 'Update Service DONE'
                    }
                }
                echo 'Create / Update Service DONE'
            }
        }
        stage('Delete Unuse Container') {
            steps {
                echo 'Starting Delete Unuse Container'
                sh 'sudo docker container prune -f'
                echo 'Delete Unuse Container DONE'
            }
        }
        stage('Delete Unuse Image') {
            steps {
                echo 'Starting Delete Unuse Image'
                sh 'sudo docker image prune -a -f'
                echo 'Delete Unuse Image DONE'
           }
        }
        stage('Delete Unuse Builder') {
            steps {
                echo 'Starting Delete Unuse Builder'
                sh 'sudo docker builder prune -a -f'
                echo 'Delete Unuse Builder DONE'
            }
        }
    }
}
