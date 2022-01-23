
# GraphQL 

resource "aws_appsync_graphql_api" "coordinator" {
  authentication_type = "OPENID_CONNECT"
  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }
  name                = "jobinfo"
  schema=file("../graphql/schema.graphql")
  openid_connect_config {
    issuer = var.issuer 
    client_id = var.client_id
  }
}

# create the API Key to authenticate against graphql
# this is required by the REST Lambdas to access graphql
/*resource "aws_appsync_api_key" "appsync_api_key" {
  api_id = aws_appsync_graphql_api.coordinator.id
}*/

resource "aws_appsync_datasource" "project" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "project_${var.stage}"
  #service_role_arn = aws_iam_role.example.arn # TODO add this role
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.project.name
  }
}

resource "aws_appsync_datasource" "job" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "job_${var.stage}"
  #service_role_arn = aws_iam_role.example.arn # TODO add this role
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.job.name
  }
}

resource "aws_appsync_datasource" "jobrun" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "job_run_${var.stage}"
  # .example.arn # TODO add this role
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.jobname.name
  }
}

# Create resolver using the velocity templates.

### TODO create more of these
resource "aws_appsync_resolver" "query" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = "Query"
  field       = "listPeople"
  data_source = aws_appsync_datasource.coordinator.name

  request_template  = file("../lambda/resolvers/request.vtl")
  response_template = file("../lambda/resolvers/response.vtl")
}



# IAM


resource "aws_iam_role" "appsync" {
  assume_role_policy = aws_iam_policy_document.appsync_assume_role.json
}

data "aws_iam_policy_document" "appsync_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["appsync.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "appsync" {
  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
        "dynamodb:Query",
    ]
    resources = [
        aws_dynamodb_table.project.arn,
        aws_dynamodb_table.job.arn,
        aws_dynamodb_table.job_run.arn,
    ]
  }
}

resource "aws_iam_role_policy" "appsync" {
  role   = aws_iam_role.appsync.id
  policy = data.aws_iam_policy_document.appsync.json
}
