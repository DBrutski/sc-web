/(.*)(SCWeb\.(core|ui)\.(\w*))(.*=.*)/{
         match($0, /(.*)(SCWeb\.(core|ui)\.(\w*))(.*)/, arr)
         print "export default "arr[4]
}
