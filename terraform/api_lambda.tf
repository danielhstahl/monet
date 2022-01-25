

data "archive_file" "api_lambdas" {
  type        = "zip"
  output_path = "../api_lambda.zip"
  source_dir  = "../api_lambda"
}


# Lambda Resources

# Create Project
resource "aws_lambda_permission" "create_project" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_project.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "create_project" {
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "create_project_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.createProject"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.project.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
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
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "create_job_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.createJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.job.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
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
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "get_jobs_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.getJobs"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.job.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
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
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "start_job_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.startJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.job_run.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      # GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
    }
  }
}

# Stop Job instance

resource "aws_lambda_permission" "finish_job" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.finish_job.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}


resource "aws_lambda_function" "finish_job" {
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "finish_job_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.finishJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.job_run.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      #GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
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
  filename         = data.archive_file.api_lambdas.output_path
  function_name    = "get_job_status_${var.stage}"
  role             = aws_iam_role.api_lambda.arn
  handler          = "index.getJobRun"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.api_lambdas.output_path)
  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.job_run.name
      REGION               = var.region
      GRAPHQL_API_ENDPOINT = aws_appsync_graphql_api.coordinator.uris["GRAPHQL"]
      #GRAPHQL_API_KEY      = aws_appsync_api_key.appsync_api_key.key
    }
  }
}


### IAM

resource "aws_iam_role" "api_lambda" {
  name               = "api_lambda_function_role"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_assume_role.json
}

data "aws_iam_policy_document" "api_lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
data "aws_iam_policy_document" "api_lambda_to_dynamodb_assume_policy" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:GetItem",
    ]
    resources = [
      "*"
    ]
  }
}
resource "aws_iam_role_policy" "lambda_to_dynamodb_policy" {
  name   = "lambda_to_dynamodb_function_policy"
  role   = aws_iam_role.api_lambda.name
  policy = data.aws_iam_policy_document.api_lambda_to_dynamodb_assume_policy.json
}
resource "aws_iam_role_policy_attachment" "terraform_api_lambda_policy" {
  role       = aws_iam_role.api_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}