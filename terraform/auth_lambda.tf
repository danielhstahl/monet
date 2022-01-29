
data "archive_file" "auth_lambda" {
  type        = "zip"
  output_path = "../auth_lambda.zip"
  source_dir  = "../auth_lambda"
}

# Auth Lambdas

resource "aws_lambda_permission" "auth_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}

resource "aws_lambda_function" "auth_lambda" {
  filename         = data.archive_file.auth_lambda.output_path
  function_name    = "auth_lambda_${var.stage}"
  role             = aws_iam_role.auth_lambda.arn
  handler          = "index.authUser"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.auth_lambda.output_path)
}

### IAM

resource "aws_iam_role" "auth_lambda" {
  name               = "auth_lambda_function_role"
  assume_role_policy = data.aws_iam_policy_document.auth_lambda_assume_role.json
}

data "aws_iam_policy_document" "auth_lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "auth_lambda_to_dynamodb_assume_policy" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [
      aws_dynamodb_table.user.arn,
    ]
  }
}
resource "aws_iam_role_policy" "auth_lambda_to_dynamodb_policy" {
  name   = "auth_lambda_to_dynamodb_function_policy"
  role   = aws_iam_role.auth_lambda.name
  policy = data.aws_iam_policy_document.auth_lambda_to_dynamodb_assume_policy.json
}

resource "aws_iam_role_policy_attachment" "auth_lambda_lambda_policy" {
  role       = aws_iam_role.auth_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

