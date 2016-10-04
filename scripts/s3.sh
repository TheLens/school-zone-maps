#!/bin/bash

# Upload files to S3.
aws s3 sync \
  www/ \
  s3://projects.thelensnola.org/school-zones/PROJECT_SLUG/ \
  --acl public-read
