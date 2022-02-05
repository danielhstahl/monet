provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    bucket = "terraform-job-coordinator"
    key    = "terraform"
    region = "us-east-1"
  }
}