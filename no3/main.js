var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var pathUtil = require("path");
// 업로드 된 파일 경로
var uploadDir = __dirname + "/data";
// 이미지 파일 경로
var imageDir = __dirname + "/data/img";
var formidable = require("formidable");
// 업로드 된 데이터 목록
var paintList = [];

function templateHTML(qid, list, body, control) {
  return `<!doctype html>
<html>
<head>
  <title>WEB1 - ${qid}</title>
  <meta charset="utf-8">
  <style>

#addbtn{
  margin-left: 80%;
  width: 8em;
  height: 5em;
}
.container {
  margin: 0px auto;
  width: 500px;
  height: 100%;
}
.container div {
  position: relative;
  top: 200px;
  width :30%;
  height: 200px;
  display: inline-block;
}
</style>
</head>
<body>
  <h1><a href="/">image add</a></h1>
  <button type="button" id="addbtn" onclick="javascript:location.href='/create'">Image Add</button>

  ${list}
  ${control}
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

  console.log(pathname);

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, filelist) {
        console.log(filelist);
        var qid = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(
          qid,
          list,
          `<h2>${qid}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (err, filelist) {
        fs.readFile(`data/${qid}`, "utf8", function (err, description) {
          var qid = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(
            qid,
            list,
            `<h2>${qid}</h2>${description}`,
            `<a href="/create">create</a> 
            <a href="/update?id=${qid}">update</a> 
            
            <form action="/delete_process" method="post">
            <input type="hidden" name=id value="${qid}">
            
            <input type="submit" value="delete" />
            </form>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      console.log(filelist);
      var qid = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(
        qid,
        list,
        `
      <form action="/create_process" method="post">
  <p><input type="text" name="title"
  placeholder="title"/></p>
  <p><input type="file" name="file"
  placeholder="file"/></p>
  <p>
    <textarea name="description" placeholder="description"></textarea>
  </p>
  <p>
    <input type="submit" />
  </p>
</form>

      `,
        ``
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var file = post.file;
      var description = post.description;
      console.log(title, file, description);
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });

        response.end("success");
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`data/${qid}`, "utf8", function (err, description) {
        console.log(filelist);
        var qid = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(
          qid,
          list,
          `
      <form action="/update_process" method="post">
      <input type="hidden" name=id value='${qid}'>
  <p><input type="text" name="title"
  placeholder="title" value='${qid}'/></p>
  <p>
    <textarea name="description" placeholder="description">${description}</textarea>
  </p>
  <p>
    <input type="submit" />
  </p>
</form>

      `,
          `<a href="/create">create</a> <a href="/update?id=${qid}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      console.log("delete cont id:" + id);
      fs.unlink(`data/${id}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end("success");
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      console.log(id, title, description);
      fs.rename(`data/${id}`, `data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end("success");
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(5000);
