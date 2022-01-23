
data "archive_file" "transform_lambdas" {
  type        = "zip"
  output_path = "../transform_lambda.zip"
  source_dir  = "../transform_lambda"
}