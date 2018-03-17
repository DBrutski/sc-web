/(.*)(SCWeb\.(core|ui)\.(\w*))(.*)/ {
         match($0, /(.*)(SCWeb\.(core|ui)\.(\w*))(.*)/, arr)
         print "import "arr[4]" from \"./"arr[2]"\";"
}

/(.*)(SCWeb\.(core|ui)\.(\w*))(.*=.*)/ {
         match($0, /(.*)(SCWeb\.(core|ui)\.(\w*))(.*)/, arr)
         print "import "arr[4]" from \"./"arr[2]"\";" > "/dev/stderr"
}
