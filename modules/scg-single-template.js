module.exports.scg = (styles, scripts) =>
    `
<!DOCTYPE html>
<html lang="en">

<head>
    <title>SCg-editor</title>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
 ${styles}
 ${scripts}
</head>

<body>
    <div class="scg-viewer" id="scg-viewer"></div>
</body>
</html>
`;