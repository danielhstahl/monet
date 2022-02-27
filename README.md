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
`export BASE_URL=https://xe3adpl1gg.execute-api.us-east-1.amazonaws.com/main`

`curl -X POST $BASE_URL/project/create -d '{"name":"mytestname", "company":"0oa3rhm4iuHrIwZba5d7"}' -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

## Example

Response from create project:

`{"id":"10cc2a0e-6822-404d-976b-6287aedb1621","project_name":"mytestname","company":"0oa3rhm4iuHrIwZba5d7","created_date":"2022-02-05T01:40:30.573Z","__typename":"Project"}`


Create a job in that project:

`export PROJECT_ID=5d8a8aa2-a8b2-4899-9c3f-8a408b9a4611`

`curl -X POST $BASE_URL/project/$PROJECT_ID/job/create -d '{"name":"myjobname", "company":"0oa3rhm4iuHrIwZba5d7"}' -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Response:

`
{"id":"b51016ef-c155-439b-a2d8-1fdb133c28b0","job_name":"myjobname","company":"0oa3rhm4iuHrIwZba5d7","project_id":"10cc2a0e-6822-404d-976b-6287aedb1621","created_date":"2022-02-05T01:47:01.525Z","__typename":"Job"}
`

`export JOB_ID=b51016ef-c155-439b-a2d8-1fdb133c28b0`


Get jobs from that project:

`curl $BASE_URL/project/$PROJECT_ID/job  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Start a job run:

`curl -X POST  $BASE_URL/job/$JOB_ID/start  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Response:

`
{"id":"0f87a20f-9284-49e0-b338-bfaab0da220b","job_id":"b51016ef-c155-439b-a2d8-1fdb133c28b0","job_status":"IN_PROGRESS","start_time":"2022-02-05T13:13:52.627Z","__typename":"JobRun"}
`

`export JOB_RUN_ID=0f87a20f-9284-49e0-b338-bfaab0da220b`

Query the job run:


`curl  $BASE_URL/job/$JOB_ID/run/$JOB_RUN_ID  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`

Finish a job run:

`curl -X POST  $BASE_URL/job/$JOB_ID/run/$JOB_RUN_ID/finish -d '{"job_status":"SUCCESS"}'  -H "Content-Type: application/json" -H "Authorization: $API_KEY"`


## Okta

You have to manually add User Name for auth to work (kind of annoying!)