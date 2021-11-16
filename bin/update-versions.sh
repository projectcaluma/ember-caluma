#!/bin/bash

name=$1
version=$(node -p "require('$name/package.json').version")

for pkg in ./packages/**/package.json
do
  sed -i -E "s#(\"$name\": \"(~|\^)?).*\"#\1$version\"#g" $pkg
done
