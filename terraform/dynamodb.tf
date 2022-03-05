
## Dynamodb

resource "aws_dynamodb_table" "project" {
  name         = "project_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "company"
    type = "S"
  }
  attribute {
    name = "project_name"
    type = "S"
  }
  global_secondary_index {
    name            = "company_index"
    hash_key        = "company"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "name_index"
    hash_key        = "project_name"
    projection_type = "ALL"
  }
  tags = {
    Name        = "project"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "job" {
  name         = "job_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
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
  global_secondary_index {
    name            = "company_index"
    hash_key        = "company"
    range_key       = "project_id"
    projection_type = "ALL"
  }
  tags = {
    Name        = "job"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "job_run" {
  name         = "job_run_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "job_id"
    type = "S"
  }
  attribute {
    name = "start_time"
    type = "S"
  }
  global_secondary_index {
    name            = "job_index"
    hash_key        = "job_id"
    range_key       = "start_time"
    projection_type = "ALL"
  }
  tags = {
    Name        = "job_run"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "user" {
  name         = "user_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "hash_api_key"
  attribute {
    name = "hash_api_key"
    type = "S"
  }
  attribute {
    name = "user_id" # okta user id
    type = "S"
  }
  global_secondary_index {
    name            = "api_index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  tags = {
    Name        = "user"
    Environment = var.stage
  }
}

/*
resource "aws_kinesis_stream" "persist_project" {
  name = "persist_project_${var.stage}"
  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }
}

resource "aws_dynamodb_kinesis_streaming_destination" "project" {
  stream_arn = aws_kinesis_stream.persist_project.arn
  table_name = aws_dynamodb_table.project.name
}

resource "aws_kinesis_stream" "persist_job" {
  name = "persist_job_${var.stage}"
  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }
}

resource "aws_dynamodb_kinesis_streaming_destination" "job" {
  stream_arn = aws_kinesis_stream.persist_job.arn
  table_name = aws_dynamodb_table.job.name
}

resource "aws_kinesis_stream" "persist_job_run" {
  name = "persist_job_run_${var.stage}"
  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }
}

resource "aws_dynamodb_kinesis_streaming_destination" "job_run" {
  stream_arn = aws_kinesis_stream.persist_job_run.arn
  table_name = aws_dynamodb_table.job_run.name
}
*/


## IAM

