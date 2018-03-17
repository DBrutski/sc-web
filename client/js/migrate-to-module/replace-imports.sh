#!/bin/bash

find Core -name *.js -type f -exec sed -i 's/SCWeb.core\.//' {} \;
