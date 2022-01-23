export network_name=awslocal
export container_name=dynamodb
sudo docker network create  $network_name
sudo docker run -p 8000:8000 --network $network_name --name $container_name amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
AWS_ACCESS_KEY_ID=12345 AWS_SECRET_ACCESS_KEY=12345 AWS_REGION=us-east-1 aws dynamodb create-table \
    --table-name subscription \
    --attribute-definitions AttributeName=SubId,AttributeType=S \
    --key-schema AttributeName=SubId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000

# sudo docker run --rm -v "$PWD":/var/task -i -e DOCKER_LAMBDA_USE_STDIN=1 lambci/lambda:build-nodejs12.x -bootstrap ${location}/ops_faas
cat ./integration_tests/event.json | sudo docker run --rm -v "$PWD":/var/task:ro,delegated -e DOCKER_LAMBDA_USE_STDIN=1 lambci/lambda:nodejs12.x lambda/index.apiToDynamoDb 

AWS_REGION=us-east-1 sudo sam local invoke --docker-network $network_name \
    -t ./integration_tests/template.yml -e ./integration_tests/event.json apitodynamo -v lambda