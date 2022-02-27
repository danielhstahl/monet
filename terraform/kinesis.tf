
### Firehose


resource "aws_kinesis_firehose_delivery_stream" "persist_projects" {
  name        = "persist_projects_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_project.arn
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
          parameter_value = "${aws_lambda_function.transform_project_payload.arn}:$LATEST"
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
    kinesis_stream_arn = aws_kinesis_stream.persist_job.arn
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
          parameter_value = "${aws_lambda_function.transform_job_payload.arn}:$LATEST"
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


//completed jobs
resource "aws_kinesis_firehose_delivery_stream" "persist_job_runs" {
  name        = "completed_job_runs_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_job_run.arn
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
          parameter_value = "${aws_lambda_function.transform_job_runs_payload.arn}:$LATEST"
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


//raw events
resource "aws_kinesis_firehose_delivery_stream" "persist_job_events" {
  name        = "persist_job_events_${var.stage}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.persist_job_run.arn
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
          parameter_value = "${aws_lambda_function.transform_job_runs_payload.arn}:$LATEST"
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
  bucket        = "jobcoordinator-${var.stage}-firehose"
  force_destroy = true
}

resource "aws_s3_bucket_acl" "kinesis_firehose_stream_bucket" {
  bucket = aws_s3_bucket.kinesis_firehose_stream_bucket.id
  acl    = "private"
}

## IAM
data "aws_iam_policy_document" "kinesis_firehose_stream_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["firehose.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "kinesis_firehose_access_bucket_assume_policy" {
  statement {
    effect = "Allow"

    actions = [
      "s3:AbortMultipartUpload",
      "s3:GetBucketLocation",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:ListBucketMultipartUploads",
      "s3:PutObject",
    ]

    resources = [
      aws_s3_bucket.kinesis_firehose_stream_bucket.arn,
      "${aws_s3_bucket.kinesis_firehose_stream_bucket.arn}/*",
    ]
  }
}

data "aws_iam_policy_document" "kinesis_firehose_kinesis_data_stream_policy" {
  statement {
    effect = "Allow"

    actions = [
      "kinesis:DescribeStream",
      "kinesis:GetShardIterator",
      "kinesis:GetRecords"
    ]

    resources = [
      aws_kinesis_stream.persist_project.arn,
      aws_kinesis_stream.persist_job.arn,
      aws_kinesis_stream.persist_job_run.arn
    ]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  name   = "lambda_function_policy_${var.stage}"
  role   = aws_iam_role.kinesis_firehose_stream_role.name
  policy = data.aws_iam_policy_document.lambda_assume_policy.json
}
data "aws_iam_policy_document" "lambda_assume_policy" {
  statement {
    effect = "Allow"

    actions = [
      "lambda:InvokeFunction",
      "lambda:GetFunctionConfiguration",
    ]

    resources = [
      aws_lambda_function.transform_project_payload.arn,
      "${aws_lambda_function.transform_project_payload.arn}:*",
      aws_lambda_function.transform_job_payload.arn,
      "${aws_lambda_function.transform_job_payload.arn}:*",
      aws_lambda_function.transform_job_runs_payload.arn,
      "${aws_lambda_function.transform_job_runs_payload.arn}:*",
    ]
  }
}

data "aws_iam_policy_document" "kinesis_firehose_access_glue_assume_policy" {
  statement {
    effect    = "Allow"
    actions   = ["glue:GetTableVersions"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "kinesis_firehose_stream_role" {
  name               = "kinesis_firehose_stream_role_${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.kinesis_firehose_stream_assume_role.json
}

resource "aws_iam_role_policy" "kinesis_firehose_access_bucket_policy" {
  name   = "kinesis_firehose_access_bucket_policy_${var.stage}"
  role   = aws_iam_role.kinesis_firehose_stream_role.name
  policy = data.aws_iam_policy_document.kinesis_firehose_access_bucket_assume_policy.json
}

resource "aws_iam_role_policy" "kinesis_firehose_kinesis_data_stream_policy" {
  name   = "kinesis_firehose_kinesis_data_stream_policy_${var.stage}"
  role   = aws_iam_role.kinesis_firehose_stream_role.name
  policy = data.aws_iam_policy_document.kinesis_firehose_kinesis_data_stream_policy.json
}

resource "aws_iam_role_policy" "kinesis_firehose_access_glue_policy" {
  name   = "kinesis_firehose_access_glue_policy_${var.stage}"
  role   = aws_iam_role.kinesis_firehose_stream_role.name
  policy = data.aws_iam_policy_document.kinesis_firehose_access_glue_assume_policy.json
}