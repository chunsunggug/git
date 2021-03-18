var folder = "../no1/data";
var fs = require("fs");
fs.readdir(folder, function (err, fileList) {
  console.log(fileList);
});
