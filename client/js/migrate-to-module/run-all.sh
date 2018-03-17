#!/bin/bash


find $1 -name *.temp.js -type f -exec rm {} \;
find $1 -name *.js -type f -exec ./replace.sh {} {}.temp.js \;
./replace-imports.sh $1
find $1 -name *.js ! -name *.temp.js -type f -exec mv {}.temp.js {} \;
