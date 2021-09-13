#!/bin/bash

for pkg in ../**/package.json
do
  name=$(node -p "require('$pkg').name")
  version=$(node -p "require('$pkg').version")

  sed -i "s#\"$name\": \".*\"#\"$name\": \"$version\"#g" package.json
done
