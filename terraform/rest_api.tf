# API Gateway
data "template_file" "swagger" {
  template = file("../client/src/swagger.yml")
  vars = {
    region             = var.region
    arn_create_project = aws_lambda_function.create_project.arn
    arn_create_job     = aws_lambda_function.create_job.arn
    arn_get_jobs       = aws_lambda_function.get_jobs.arn
    arn_start_job      = aws_lambda_function.start_job.arn
    arn_finish_job     = aws_lambda_function.finish_job.arn
    arn_get_job_status = aws_lambda_function.get_job_status.arn
    arn_create_api_key = aws_lambda_function.create_api_key.arn
    arn_auth           = aws_lambda_function.auth_lambda.arn
    arn_auth_role      = aws_iam_role.api.arn
  }
}

resource "aws_api_gateway_rest_api" "api" {
  name = "jobcoordinator"
  body = data.template_file.swagger.rendered

}

resource "aws_api_gateway_deployment" "deployapi" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  triggers = {
    redeployment = filebase64sha256(data.archive_file.api_lambdas.output_path)
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_lambda_function.create_project,
    aws_lambda_function.create_job,
    aws_lambda_function.get_jobs,
    aws_lambda_function.start_job,
    aws_lambda_function.finish_job,
    aws_lambda_function.get_job_status,
    aws_lambda_function.create_api_key
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

### IAM

resource "aws_api_gateway_account" "api" {
  cloudwatch_role_arn = aws_iam_role.api.arn
}

resource "aws_iam_role" "api" {
  name               = "api_role_${var.stage}"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.api_assum_role.json
}

data "aws_iam_policy_document" "api_assum_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "api_to_lambda" {
  name   = "api_to_lambda_policy_${var.stage}"
  role   = aws_iam_role.api.id
  policy = data.aws_iam_policy_document.api_to_lambda.json
}


data "aws_iam_policy_document" "api_to_lambda" {
  statement {
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction",
    ]
    resources = [
      aws_lambda_function.auth_lambda.arn
    ]
  }
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "api_to_cloudwatch_${var.stage}"
  role = aws_iam_role.api.id

  policy = data.aws_iam_policy_document.cloudwatch.json
}

data "aws_iam_policy_document" "cloudwatch" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents"
    ]
    resources = [
      "*"
    ]
  }
}