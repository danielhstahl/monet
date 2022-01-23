
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


