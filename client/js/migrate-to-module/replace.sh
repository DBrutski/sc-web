#!/bin/bash

./make-imports.sh $1 >> $2
gawk -f replace-globals.awk $1 >> $2
gawk -f make-exports.awk $1 | sort | uniq >> $2
