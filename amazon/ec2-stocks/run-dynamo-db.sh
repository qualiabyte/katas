#! /bin/bash

pushd dynamoDB

java \
  -Djava.library.path=./DynamoDBLocal_lib \
  -jar DynamoDBLocal.jar \
  -sharedDb
