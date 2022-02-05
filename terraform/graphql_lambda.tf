
data "archive_file" "graphql_lambda" {
  type        = "zip"
  output_path = "../graphql_lambda.zip"
  source_dir  = "../graphql_lambda"
}

# Auth Lambdas

resource "aws_lambda_function" "create_api_key" {
  filename         = data.archive_file.graphql_lambda.output_path
  function_name    = "create_api_key_${var.stage}"
  role             = aws_iam_role.graphql_lambda.arn
  handler          = "index.createApiKey"
  runtime          = "nodejs14.x"
  source_code_hash = filebase64sha256(data.archive_file.graphql_lambda.output_path)
  environment {
    variables = {
      USER_TABLE_NAME = aws_dynamodb_table.user.name
    }
  }
}


### IAM

resource "aws_iam_role" "graphql_lambda" {
  name               = "graphql_lambda_function_role_${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.graphql_lambda_assume_role.json
}

data "aws_iam_policy_document" "graphql_lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "graphql_lambda_to_dynamodb_assume_policy" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:ConditionCheckItem",
      "dynamodb:DeleteItem",
    ]
    resources = [
      aws_dynamodb_table.user.arn,
      "${aws_dynamodb_table.user.arn}/*",
    ]
  }
}
resource "aws_iam_role_policy" "graphq_lambda_to_dynamodb_policy" {
  name   = "lambda_to_dynamodb_function_policy_${var.stage}"
  role   = aws_iam_role.graphql_lambda.name
  policy = data.aws_iam_policy_document.graphql_lambda_to_dynamodb_assume_policy.json
}


resource "aws_iam_role_policy_attachment" "graphql_lambda_policy" {
  role       = aws_iam_role.graphql_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

