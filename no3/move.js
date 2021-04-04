var express = require("express");
var fs = require("fs");
var app = express();
var static = require("serve-static");
app.get("/", function (req, res) {
  fs.readFile("main.js", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

app.listen(3300, function () {
  console.log("server start");
});
