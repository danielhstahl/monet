
## static site
resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.job-coordinator-${var.stage}.com"
  acl    = "public-read"
  //policy = data.aws_iam_policy_document.static_site_bucket.json
  //policy = templatefile("templates/s3-policy.json", { bucket = "www.${var.bucket_name}" })
  force_destroy = true
  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    //error_document = "404.html"
  }

  //tags = var.common_tags
}

## IAM

data "aws_iam_policy_document" "static_site_bucket" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    effect = "Allow"
    actions = [
      "s3:GetObject"
    ]
    resources = [
      aws_s3_bucket.www_bucket.arn,
      "${aws_s3_bucket.www_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "static_site_bucket" {
  bucket = aws_s3_bucket.www_bucket.id
  policy = data.aws_iam_policy_document.static_site_bucket.json
}

output "websiteendpoint" {
  value = aws_s3_bucket.www_bucket.website_endpoint
}

output "websitedomain" {
  value = aws_s3_bucket.www_bucket.website_domain
}

output "bucketurl" {
  value = aws_s3_bucket.www_bucket.bucket
}