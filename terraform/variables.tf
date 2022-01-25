variable "region" {
  type    = string
  default = "us-east-1"
}

#variable "accountId" {
#  type    = string
#  default = "029524284009"
#}
variable "stage" {
  type = string
}
variable "client_id" {
  type = string
}

variable "issuer" {
  type    = string
  default = "https://dev-20490044.okta.com"
}