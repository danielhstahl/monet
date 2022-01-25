
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
    name = "name"
    type = "S"
  }
  global_secondary_index {
    name     = "company_index"
    hash_key = "company"
  }
  global_secondary_index {
    name     = "name_index"
    hash_key = "name"
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
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "last_time_job_completed"
    type = "S"
  }
  attribute {
    name = "last_time_job_completed_successfully"
    type = "S"
  }
  attribute {
    name = "total_successes"
    type = "N"
  }
  attribute {
    name = "total_failures"
    type = "N"
  }
  attribute {
    name = "jobs_currently_running"
    type = "N"
  }
  attribute {
    name = "average_job_length_in_seconds"
    type = "N"
  }
  global_secondary_index {
    name     = "company_index"
    hash_key = "company"
  }
  global_secondary_index {
    name     = "project_index"
    hash_key = "project_id"
  }
  tags = {
    Name        = "job"
    Environment = var.stage
  }
}

resource "aws_dynamodb_table" "job_run" {
  name         = "job_run_${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_id"
  range_key    = "start_time"
  attribute {
    name = "id"
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
    type = "S"
  }
  attribute {
    name = "end_time"
    type = "S"
  }
  global_secondary_index {
    name     = "project_index"
    hash_key = "job_id"
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