#!/bin/bash

name=$(node -p "require('./package.json').name")
version=$(node -p "require('./package.json').version")

for pkg in ../**/package.json
do
  sed -i "s#\"$name\": \".*\"#\"$name\": \"$version\"#g" $pkg
done
