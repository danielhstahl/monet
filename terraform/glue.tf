
resource "aws_glue_catalog_database" "glue_catalog_database" {
  name = "jobcoordinate_${var.stage}"
}
resource "aws_glue_catalog_table" "project_info_table" {
  name          = "project_info"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/project_info/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "projectId"
      type = "string"

    }
    columns {
      name="name"
      type="string"
    }
    columns {
      name="company"
      type="string"
    }

    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}
resource "aws_glue_catalog_table" "job_info_table" {
  name          = "job_info"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/job_info/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name = "projectId"
      type = "string"
    }
    columns {
      name="name"
      type="string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}

resource "aws_glue_catalog_table" "job_run_info_table" {
  name          = "complete_jobs"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/complete_jobs/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobRunId" # this is primary key in this table
      type = "string"
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "startTime"
      type = "timestamp"
    }
    columns {
      name = "endTime"
      type = "timestamp"
    }
    columns {
      name = "status"
      type = "string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}

resource "aws_glue_catalog_table" "job_run_events_table" {
  name          = "job_run_events"
  database_name = aws_glue_catalog_database.glue_catalog_database.name

  parameters = {
    "classification" = "parquet"
  }
  storage_descriptor {
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"
    location      = "s3://${aws_s3_bucket.kinesis_firehose_stream_bucket.bucket}/job_run_events/"
    ser_de_info {
      name                  = "JsonSerDe"
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"

      parameters = {
        "serialization.format" = 1
        "explicit.null"        = false
        "parquet.compression"  = "SNAPPY"
      }
    }
    columns {
      name = "jobRunId" # not primary key, this table takes the raw events
      type = "string"
    }
    columns {
      name = "jobId"
      type = "string"
    }
    columns {
      name="company"
      type="string"
    }
    columns {
      name = "startTime"
      type = "timestamp"
    }
    columns {
      name = "endTime"
      type = "timestamp"
    }
    columns {
      name = "status"
      type = "string"
    }
    columns {
      name = "logDate"
      type = "timestamp"
    }

  }
}