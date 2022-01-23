provider "aws" {
  region = var.region
}
data "archive_file" "lambdas" {
  type        = "zip"
  output_path = "../lambda.zip"
  source_dir  = "../lambda"
}



# API Gateway


data "template_file" "swagger" {
  template = file("../swagger.yml")
  vars = {
    region                  = var.region
    arn_create_project = aws_lambda_function.create_project.arn
    arn_get_projects = aws_lambda_function.get_projects.arn
    arn_create_job  = aws_lambda_function.create_job.arn
    arn_get_jobs    = aws_lambda_function.get_jobs.arn
    arn_start_job   = aws_lambda_function.start_job.arn
    arn_stop_job = aws_lambda_function.stop_job.arn
    arn_get_job_status    = aws_lambda_function.get_job_status.arn

  }
}

resource "aws_api_gateway_rest_api" "api" {
  name = "jobcoordinator"
  body = data.template_file.swagger.rendered
}

resource "aws_api_gateway_deployment" "deployapi" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeployment = filebase64sha256(data.archive_file.lambdas.output_path)
  }

  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_lambda_function.create_project,
    aws_lambda_function.get_projects,
    aws_lambda_function.create_job,
    aws_lambda_function.get_jobs,
    aws_lambda_function.start_job,
    aws_lambda_function.stop_job,
    aws_lambda_function.get_job_status

  ]
}

resource "aws_api_gateway_stage" "api" {
  deployment_id = aws_api_gateway_deployment.deployapi.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.stage
}

output "endpointstage" {
  value = aws_api_gateway_stage.api.invoke_url
}
output "endpointdeploy" {
  value = aws_api_gateway_deployment.deployapi.invoke_url
}

resource "local_file" "envforreact" {
  content  = "REACT_APP_HOST=${aws_api_gateway_stage.api.invoke_url}"
  filename = "../jobcoordinator/.env" 
}
# API Lambdas

# Create Project
resource "aws_lambda_permission" "create_project" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_project.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "create_project" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "create_project_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.createProject"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.project.name
    }
  }
}

# Get Projects

resource "aws_lambda_permission" "get_projects" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_projects.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "get_projects" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "get_projects_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getProjects"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.project.name
    }
  }
}

# Create Job

resource "aws_lambda_permission" "create_job" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_job.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "create_job" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "create_job_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.createJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job.name
    }
  }
}

# Get Jobs

resource "aws_lambda_permission" "get_jobs" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_jobs.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "get_jobs" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "get_jobs_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getJobs"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job.name
    }
  }
}

# Create Job instance

resource "aws_lambda_permission" "start_job" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.start_job.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "start_job" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "start_job_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.startJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.jobrun.name
    }
  }
}

# Stop Job instance

resource "aws_lambda_permission" "stop_job" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.stop_job.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "start_job" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "stop_job_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.stopJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.jobrun.name
    }
  }
}

# Get Job status

resource "aws_lambda_permission" "get_job_status" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_job_status.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "get_job_status" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "get_job_status_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getJobStatus"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.jobrun.name
    }
  }
}

# Transform Lambdas

resource "aws_lambda_function" "transform_project_payload" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "transform_project_payload_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getJobStatus" #CHANGEME
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
}

resource "aws_lambda_function" "transform_job_payload" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "transform_job_payload_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getJobStatus" #CHANGEME
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
}


# handles writing to "complete jobs" table and "events" table
resource "aws_lambda_function" "transform_job_runs_payload" {
  filename         = data.archive_file.lambdas.output_path
  function_name    = "transform_job_runs_payload_${var.stage}"
  role             = aws_iam_role.lambda.arn
  handler          = "index.getJobStatus" #CHANGEME
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.lambdas.output_path)
}



# GraphQL 

resource "aws_appsync_graphql_api" "coordinator" {
  authentication_type = "OPENID_CONNECT"
  additional_authentication_provider {
    authentication_type = "API_KEY"
  }
  name                = "jobinfo"
  schema=file("../graphql/schema.graphql")
  openid_connect_config {
    issuer = var.issuer 
    client_id = var.client_id
  }
}

# create the API Key to authenticate against graphql
# this is required by the REST Lambdas to access graphql
resource "aws_appsync_api_key" "appsync_api_key" {
  api_id = aws_appsync_graphql_api.coordinator.id
}

resource "aws_appsync_datasource" "coordinator" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "jobinfobackend"
  service_role_arn = aws_iam_role.example.arn
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.project.name
  }
}

# Create resolver using the velocity templates.
resource "aws_appsync_resolver" "query" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = "Query"
  field       = "listPeople"
  data_source = aws_appsync_datasource.coordinator.name

  request_template  = file("../lambda/resolvers/request.vtl")
  response_template = file("../lambda/resolvers/response.vtl")
}


### Firehose


resource "aws_kinesis_firehose_delivery_stream" "persist_projects" {
  name        = "persist_projects_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_projects.arn
    role_arn           = aws_iam_role.kinesis_firehose_stream_role.arn
  }
  extended_s3_configuration {
    buffer_size         = 128
    role_arn            = aws_iam_role.kinesis_firehose_stream_role.arn
    bucket_arn          = aws_s3_bucket.kinesis_firehose_stream_bucket.arn
    prefix              = "persist_basic/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    error_output_prefix = "!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    processing_configuration {
      enabled = true

      processors {
        type = "Lambda"
        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = "${aws_lambda_function.transform_projects.arn}:$LATEST"
        }
      }
    }
    data_format_conversion_configuration {
      input_format_configuration {
        deserializer {
          open_x_json_ser_de {
            # column_to_json_key_mappings = { ts = "timestamp" } # we have a timestamp column
          }
        }
      }

      output_format_configuration {
        serializer {
          parquet_ser_de { compression = "SNAPPY" }
        }
      }

      schema_configuration {
        database_name = aws_glue_catalog_database.glue_catalog_database.name
        table_name    = aws_glue_catalog_table.project_info_table.name
        role_arn      = aws_iam_role.kinesis_firehose_stream_role.arn
      }
    }
  }
}

resource "aws_kinesis_firehose_delivery_stream" "persist_jobs" {
  name        = "persist_jobs_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_jobs.arn
    role_arn           = aws_iam_role.kinesis_firehose_stream_role.arn
  }
  extended_s3_configuration {
    buffer_size         = 128
    role_arn            = aws_iam_role.kinesis_firehose_stream_role.arn
    bucket_arn          = aws_s3_bucket.kinesis_firehose_stream_bucket.arn
    prefix              = "persist_basic/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    error_output_prefix = "!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    processing_configuration {
      enabled = true

      processors {
        type = "Lambda"
        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = "${aws_lambda_function.transform_jobs.arn}:$LATEST"
        }
      }
    }
    data_format_conversion_configuration {
      input_format_configuration {
        deserializer {
          open_x_json_ser_de {
            # column_to_json_key_mappings = { ts = "timestamp" } # we have a timestamp column
          }
        }
      }

      output_format_configuration {
        serializer {
          parquet_ser_de { compression = "SNAPPY" }
        }
      }

      schema_configuration {
        database_name = aws_glue_catalog_database.glue_catalog_database.name
        table_name    = aws_glue_catalog_table.job_info_table.name
        role_arn      = aws_iam_role.kinesis_firehose_stream_role.arn
      }
    }
  }
}


resource "aws_kinesis_firehose_delivery_stream" "persist_job_runs" {
  name        = "persist_job_runs_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_job_runs.arn
    role_arn           = aws_iam_role.kinesis_firehose_stream_role.arn
  }
  extended_s3_configuration {
    buffer_size         = 128
    role_arn            = aws_iam_role.kinesis_firehose_stream_role.arn
    bucket_arn          = aws_s3_bucket.kinesis_firehose_stream_bucket.arn
    prefix              = "persist_basic/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    error_output_prefix = "!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    processing_configuration {
      enabled = true

      processors {
        type = "Lambda"
        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = "${aws_lambda_function.transform_job_runs.arn}:$LATEST"
        }
      }
    }
    data_format_conversion_configuration {
      input_format_configuration {
        deserializer {
          open_x_json_ser_de {
            # column_to_json_key_mappings = { ts = "timestamp" } # we have a timestamp column
          }
        }
      }

      output_format_configuration {
        serializer {
          parquet_ser_de { compression = "SNAPPY" }
        }
      }

      schema_configuration {
        database_name = aws_glue_catalog_database.glue_catalog_database.name
        table_name    = aws_glue_catalog_table.job_run_info_table.name
        role_arn      = aws_iam_role.kinesis_firehose_stream_role.arn
      }
    }
  }
}



resource "aws_s3_bucket" "kinesis_firehose_stream_bucket" {
  bucket        = "destination-bucket-${var.stage}-firehose"
  acl           = "private"
  force_destroy = true
}

## static site
resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.job-coordinator-${var.stage}.com"
  acl    = "public-read"
  //policy = data.aws_iam_policy_document.static_site_bucket.json
  //policy = templatefile("templates/s3-policy.json", { bucket = "www.${var.bucket_name}" })
  force_destroy = true
  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    //error_document = "404.html"
  }

  //tags = var.common_tags
}

# S3 bucket for redirecting non-www to www.
/*resource "aws_s3_bucket" "root_bucket" {
  bucket = "root.static-${var.stage}"
  acl    = "public-read"
  //policy = templatefile("templates/s3-policy.json", { bucket = var.bucket_name })

  website {
    redirect_all_requests_to = "https://www.${var.domain_name}"
  }

  tags = var.common_tags
}*/




/*
resource "aws_sns_topic_subscription" "write_to_firehose" {
  topic_arn             = aws_sns_topic.subscriptioncreate.arn # "arn:aws:sns:us-west-2:432981146916:user-updates-topic"
  protocol              = "firehose"
  endpoint              = aws_kinesis_firehose_delivery_stream.extended_s3_stream.arn #arn:aws:firehose:us-east-1:123456789012:deliverystream/ticketUploadStrea
  subscription_role_arn = aws_iam_role.sns_role.arn
}*/


/*
resource "aws_sns_topic_subscription" "write_to_lambda" {
  topic_arn = aws_sns_topic.subscriptioncharge.arn # "arn:aws:sns:us-west-2:432981146916:user-updates-topic"
  protocol  = "lambda"
  endpoint  = aws_lambda_function.sns_to_dynamodb.arn #arn:aws:firehose:us-east-1:123456789012:deliverystream/ticketUploadStrea
}*/

### GLUE


resource "aws_glue_catalog_database" "glue_catalog_database" {
  name = "subscriptions_${var.stage}"
}
resource "aws_glue_catalog_table" "project_info_table" {
  name          = "project_info"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/project_info/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "projectId"
      type = "string"

    }
    columns {
      name="name"
      type="string"
    }
    columns {
      name="company"
      type="string"
    }

    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}
resource "aws_glue_catalog_table" "job_info_table" {
  name          = "job_info"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/job_info/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name = "projectId"
      type = "string"
    }
    columns {
      name="name"
      type="string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}

resource "aws_glue_catalog_table" "job_run_info_table" {
  name          = "complete_jobs"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/complete_jobs/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobRunId" # this is primary key in this table
      type = "string"
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "startTime"
      type = "timestamp"
    }
    columns {
      name = "endTime"
      type = "timestamp"
    }
    columns {
      name = "status"
      type = "string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}

resource "aws_glue_catalog_table" "job_run_events_table" {
  name          = "job_run_events"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/job_run_events/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobRunId" # not primary key, this table takes the raw events
      type = "string"
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "startTime"
      type = "timestamp"
    }
    columns {
      name = "endTime"
      type = "timestamp"
    }
    columns {
      name = "status"
      type = "string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}
## Dynamodb

resource "aws_dynamodb_table" "project" {
  name         = "project_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key  = "id" 
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "company"
    type = "S"
  }
  attribute {
    name = "name"
    type = "S"
  }
  global_secondary_index{
    name="company_index"
    hash_key="company"
  }
  global_secondary_index{
    name="name_index"
    hash_key="name"
  }
  tags = {
    Name        = "project"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "job" {
  name         = "job_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key  = "id" 
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "company"
    type = "S"
  }
  attribute {
    name = "project_id"
    type = "S"
  }
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "last_time_job_completed"
    type= "S"
  }
  attribute {
    name = "last_time_job_completed_successfully"
    type= "S"
  }
  attribute {
    name = "total_successes"
    type= "N"
  }
  attribute {
    name = "total_failures"
    type= "N"
  }
  attribute {
    name = "jobs_currently_running"
    type= "N"
  }
  attribute {
    name="average_job_length_in_seconds"
    type="N"
  }
  global_secondary_index{
    name="company_index"
    hash_key="company"
  }
  global_secondary_index{
    name="project_index"
    hash_key="project_id"
  }
  tags = {
    Name        = "job"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "job_run" {
  name         = "job_run_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key  = "job_id"
  range_key="start_time" 
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "company"
    type = "S"
  }
  attribute {
    name = "job_id"
    type = "S"
  }
  attribute {
    name = "status"
    type = "S"
  }
  attribute {
    name = "start_time"
    type= "S"
  }
  attribute {
    name = "end_time"
    type= "S"
  }
  global_secondary_index{
    name="company_index"
    hash_key="company"
  }
  global_secondary_index{
    name="project_index"
    hash_key="job_id"
  }
  tags = {
    Name        = "job_run"
    Environment = var.stage
  }
}



resource "aws_kinesis_stream" "persist_project" {
  name        = "persist_project_${var.stage}"
  shard_count = 1
}

resource "aws_dynamodb_kinesis_streaming_destination" "project" {
  stream_arn = aws_kinesis_stream.persist_project.arn
  table_name = aws_dynamodb_table.project.name
}

resource "aws_kinesis_stream" "persist_job" {
  name        = "persist_job_${var.stage}"
  shard_count = 1
}

resource "aws_dynamodb_kinesis_streaming_destination" "job" {
  stream_arn = aws_kinesis_stream.persist_job.arn
  table_name = aws_dynamodb_table.job.name
}

resource "aws_kinesis_stream" "persist_job_run" {
  name        = "persist_job_run_${var.stage}"
  shard_count = 1
}

resource "aws_dynamodb_kinesis_streaming_destination" "job_run" {
  stream_arn = aws_kinesis_stream.persist_job_run.arn
  table_name = aws_dynamodb_table.job_run.name
}
