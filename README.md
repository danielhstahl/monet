## How to get started
`cd terraform`

`terraform workspace new dev`

`terraform init`

To test:

`terraform plan -var-file=dev.tfvars`

To actually create:

`terraform apply -var-file=dev.tfvars`

`cd ..`



## Make a post request

`curl -X POST https://0sy19769j6.execute-api.us-east-1.amazonaws.com/dev/project/create -d '{"name":"mytestname", "company":"mytestcompany"}' -H "Content-Type: application/json"`