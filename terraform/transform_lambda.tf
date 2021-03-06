
data "archive_file" "transform_lambdas" {
  type        = "zip"
  output_path = "../transform_lambda.zip"
  source_dir  = "../transform_lambda"
}

# Transform Lambdas

resource "aws_lambda_function" "transform_project_payload" {
  filename         = data.archive_file.transform_lambdas.output_path
  function_name    = "transform_project_payload_${var.stage}"
  role             = aws_iam_role.transform_lambda.arn
  handler          = "index.transformProject"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.transform_lambdas.output_path)
}

resource "aws_lambda_function" "transform_job_payload" {
  filename         = data.archive_file.transform_lambdas.output_path
  function_name    = "transform_job_payload_${var.stage}"
  role             = aws_iam_role.transform_lambda.arn
  handler          = "index.transformJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.transform_lambdas.output_path)
}

resource "aws_lambda_function" "transform_job_runs_payload" {
  filename         = data.archive_file.transform_lambdas.output_path
  function_name    = "transform_job_runs_payload_${var.stage}"
  role             = aws_iam_role.transform_lambda.arn
  handler          = "index.transformCompletedJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.transform_lambdas.output_path)
}

resource "aws_lambda_function" "transform_job_runs_event_payload" {
  filename         = data.archive_file.transform_lambdas.output_path
  function_name    = "transform_job_runs_events_payload_${var.stage}"
  role             = aws_iam_role.transform_lambda.arn
  handler          = "index.transformEventsJob"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.transform_lambdas.output_path)
}

### IAM

resource "aws_iam_role" "transform_lambda" {
  name               = "transform_lambda_function_role_${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.transform_lambda_assume_role.json
}

data "aws_iam_policy_document" "transform_lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "terraform_transform_lambda_policy" {
  role       = aws_iam_role.transform_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
