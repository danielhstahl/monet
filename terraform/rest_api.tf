# API Gateway
data "template_file" "swagger" {
  template = file("../swagger.yml")
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

resource "local_file" "envforreact" {
  content  = "REACT_APP_HOST=${aws_api_gateway_stage.api.invoke_url}"
  filename = "../client/.env"
}