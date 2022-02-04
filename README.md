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

`export API_KEY=12345`

`curl -X POST https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/project/create -d '{"name":"mytestname", "company":"mytestcompany"}' -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

## Example

Response from create project:

`{
  "id": "c7c22d8f-6af7-473b-9dda-8cea5592ae16",
  "project_name": "mytestname",
  "company": "mytestcompany",
  "created_date": "2022-01-27T11:42:05.495Z",
  "__typename": "Project"
}`


Create a job in that project:

`curl -X POST https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/project/c7c22d8f-6af7-473b-9dda-8cea5592ae16/job/create -d '{"name":"myjobname", "company":"mytestcompany"}' -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Response:

`
{"id":"cc86975e-ad1e-498d-a0bb-926e055e12f1","job_name":"myjobname","company":"mytestcompany","project_id":"c7c22d8f-6af7-473b-9dda-8cea5592ae16","created_date":"2022-01-28T19:16:20.312Z","__typename":"Job"}
`

Get jobs from that project:

`curl https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/project/c7c22d8f-6af7-473b-9dda-8cea5592ae16/job  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Start a job run:

`curl -X POST  https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/job/cc86975e-ad1e-498d-a0bb-926e055e12f1/start  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Response:

`
{"id":"e12e3061-38ca-498c-94c7-777c5a510789","job_id":"cc86975e-ad1e-498d-a0bb-926e055e12f1","status":"IN_PROGRESS","start_time":"2022-01-28T22:43:59.219Z","__typename":"JobRun"}

`

Query the job run:


`curl  https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/job/cc86975e-ad1e-498d-a0bb-926e055e12f1/run/e12e3061-38ca-498c-94c7-777c5a510789  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Finish a job run:

`curl -X POST  https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/job/cc86975e-ad1e-498d-a0bb-926e055e12f1/run/e12e3061-38ca-498c-94c7-777c5a510789/finish -d '{"status":"SUCCESS"}'  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`


## Okta

You have to manually add User Name for auth to work (kind of annoying!)