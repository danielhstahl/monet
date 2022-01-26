
# GraphQL 

resource "aws_appsync_graphql_api" "coordinator" {
  authentication_type = "AWS_IAM"
  additional_authentication_provider {
    authentication_type = "OPENID_CONNECT"
    openid_connect_config {
      issuer    = var.issuer
      client_id = var.client_id
    }
  }
  name   = "jobinfo"
  schema = file("../graphql/schema.graphql")
}

# create the API Key to authenticate against graphql
# this is required by the REST Lambdas to access graphql
/*resource "aws_appsync_api_key" "appsync_api_key" {
  api_id = aws_appsync_graphql_api.coordinator.id
}*/

resource "aws_appsync_datasource" "project" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "project_${var.stage}"
  service_role_arn = aws_iam_role.appsync.arn
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.project.name
  }
}

resource "aws_appsync_datasource" "job" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "job_${var.stage}"
  service_role_arn = aws_iam_role.appsync.arn
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.job.name
  }
}

resource "aws_appsync_datasource" "jobrun" {
  api_id           = aws_appsync_graphql_api.coordinator.id
  name             = "job_run_${var.stage}"
  service_role_arn = aws_iam_role.appsync.arn
  type             = "AMAZON_DYNAMODB"
  dynamodb_config {
    table_name = aws_dynamodb_table.job_run.name
  }
}

resource "aws_appsync_resolver" "mutation_add_job_run" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Mutation"
  field             = "addJobRun"
  data_source       = aws_appsync_datasource.jobrun.name
  request_template  = file("../graphql/resolvers/mutation_add_job_run.vtl")
  response_template = file("../graphql/resolvers/mutation_response.vtl")
}


resource "aws_appsync_resolver" "mutation_add_job" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Mutation"
  field             = "addJob"
  data_source       = aws_appsync_datasource.job.name
  request_template  = file("../graphql/resolvers/mutation_add_job.vtl")
  response_template = file("../graphql/resolvers/mutation_response.vtl")
}

resource "aws_appsync_resolver" "mutation_add_project" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Mutation"
  field             = "addProject"
  data_source       = aws_appsync_datasource.project.name
  request_template  = file("../graphql/resolvers/mutation_add_project.vtl")
  response_template = file("../graphql/resolvers/mutation_response.vtl")
}

resource "aws_appsync_resolver" "mutation_update_job_run" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Mutation"
  field             = "updateJobRun"
  data_source       = aws_appsync_datasource.jobrun.name
  request_template  = file("../graphql/resolvers/mutation_update_job_run.vtl")
  response_template = file("../graphql/resolvers/mutation_response.vtl")
}

resource "aws_appsync_resolver" "mutation_update_job" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Mutation"
  field             = "updateJob"
  data_source       = aws_appsync_datasource.job.name
  request_template  = file("../graphql/resolvers/mutation_update_job.vtl")
  response_template = file("../graphql/resolvers/mutation_response.vtl")
}

resource "aws_appsync_resolver" "query_get_job_runs" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getJobRuns"
  data_source       = aws_appsync_datasource.jobrun.name
  request_template  = file("../graphql/resolvers/query_get_job_runs.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}

resource "aws_appsync_resolver" "query_get_jobs_by_project" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getJobsByProject"
  data_source       = aws_appsync_datasource.job.name
  request_template  = file("../graphql/resolvers/query_get_jobs_by_project.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}

resource "aws_appsync_resolver" "query_get_jobs" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getJobs"
  data_source       = aws_appsync_datasource.job.name
  request_template  = file("../graphql/resolvers/query_get_jobs.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}

resource "aws_appsync_resolver" "query_get_last_n_job_runs" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getLastNJobRuns"
  data_source       = aws_appsync_datasource.jobrun.name
  request_template  = file("../graphql/resolvers/query_get_last_n_job_runs.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}


resource "aws_appsync_resolver" "get_projects_by_name" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getProjectsByName"
  data_source       = aws_appsync_datasource.project.name
  request_template  = file("../graphql/resolvers/query_get_projects_by_name.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}

resource "aws_appsync_resolver" "get_projects" {
  api_id            = aws_appsync_graphql_api.coordinator.id
  type              = "Query"
  field             = "getProjects"
  data_source       = aws_appsync_datasource.project.name
  request_template  = file("../graphql/resolvers/query_get_projects.vtl")
  response_template = file("../graphql/resolvers/query_response.vtl")
}

output "appsyncendpoint" {
  value = aws_appsync_graphql_api.coordinator.uris
}


# IAM


resource "aws_iam_role" "appsync" {
  assume_role_policy = data.aws_iam_policy_document.appsync_assume_role.json
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
      "dynamodb:UpdateItem",
      "dynamodb:ConditionCheckItem",
    ]
    resources = [
      aws_dynamodb_table.project.arn,
      aws_dynamodb_table.job.arn,
      aws_dynamodb_table.job_run.arn,
      "${aws_dynamodb_table.project.arn}/*",
      "${aws_dynamodb_table.job.arn}/*",
      "${aws_dynamodb_table.job_run.arn}/*",
    ]
  }
}

resource "aws_iam_role_policy" "appsync" {
  role   = aws_iam_role.appsync.id
  policy = data.aws_iam_policy_document.appsync.json
}

