#!/bin/bash

# change path to modules in import statements
find $1/Core -name *.temp.js -type f -exec sed -i -r 's/(import.*)".*SCWeb.core\.(\w*)(.*)/\1".\/\2\3/' {} \;
find $1/Core -name *.temp.js -type f -exec sed -i -r 's/(import.*)".*SCWeb.([^core]*)\.(\w*)(.*)/\1"..\/\2\/\3\4/' {} \;
find $1/Ui -name *.temp.js -type f -exec sed -i -r 's/(import.*)".*SCWeb.ui\.(\w*)(.*)/\1".\/\2\3/' {} \;
find $1/Ui -name *.temp.js -type f -exec sed -i -r 's/(import.*)".*SCWeb.([^ui]*)\.(\w*)(.*)/\1"..\/\2\/\3\4/' {} \;
find $1/Utils -name *.temp.js -type f -exec sed -i -r 's/(import.*)".*SCWeb.([^ui]*)\.(\w*)(.*)/\1"..\/\2\/\3\4/' {} \;
