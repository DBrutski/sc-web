#!/bin/bash


find $1 -name *.temp.js -type f -exec rm {} \;
find $1 -name *.js -type f -exec ./replace.sh {} {}.temp.js \;
