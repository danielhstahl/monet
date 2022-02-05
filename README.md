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

`{"id":"39ec7114-ba0e-4888-9318-b811311b7a2b","project_name":"mytestname","company":"mytestcompany","created_date":"2022-02-04T22:19:18.164Z","__typename":"Project"}`


Create a job in that project:

`curl -X POST https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/project/39ec7114-ba0e-4888-9318-b811311b7a2b/job/create -d '{"name":"myjobname", "company":"mytestcompany"}' -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Response:

`
[{"id":"e9457dc1-95d9-4092-a26e-f0ec77a311b9","job_name":"myjobname","company":"mytestcompany","project_id":"39ec7114-ba0e-4888-9318-b811311b7a2b","created_date":"2022-02-05T00:43:01.085Z","__typename":"Job"},{"id":"39ec7114-ba0e-4888-9318-b811311b7a2b","project_name":"mytestname","company":"mytestcompany","created_date":"2022-02-04T22:19:18.164Z","total_jobs":1,"__typename":"Project"}]
`

Get jobs from that project:

`curl https://rp4et8g4d8.execute-api.us-east-1.amazonaws.com/dev/project/39ec7114-ba0e-4888-9318-b811311b7a2b/job  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

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