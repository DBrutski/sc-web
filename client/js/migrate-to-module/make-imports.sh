#!/bin/bash

gawk -f make-imports.awk $1 > imp 2> not-imp
sort imp | uniq > temp
mv temp imp
sort not-imp | uniq > temp
mv temp not-imp
comm -23 imp not-imp
rm imp not-imp
