var http = require("http");
var fs = require("fs");
var url = require("url");

function templateHTML(qid, list, body) {
  return `<!doctype html>
<html>
<head>
  <title>WEB1 - ${qid}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${body}
</body>
</html>
  `;
}

function templateList(filelist) {
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href='?id=${filelist[i]}'>${filelist[i]}</a></li>`;
    i = i + 1;
  }

  return (list = list + "</ul>");
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var qid = queryData.id;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, filelist) {
        console.log(filelist);
        var qid = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(qid, list, `<h2>${qid}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (err, filelist) {
        console.log(filelist);
        var list = templateList(filelist);
        fs.readFile(`data/${qid}`, "utf8", function (err, description) {
          var qid = queryData.id;
          var template = templateHTML(
            qid,
            list,
            `<h2>${qid}</h2>${description}`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(5000);
