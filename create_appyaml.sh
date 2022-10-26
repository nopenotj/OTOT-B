#!/bin/sh
rm app.yaml > /dev/null
echo "runtime: nodejs16" >> app.yaml
echo "env_variables:" >> app.yaml
echo "  MONGO_USER: ${MONGO_USER}" >> app.yaml
echo "  MONGO_PASSWORD: ${MONGO_PASSWORD}" >> app.yaml
