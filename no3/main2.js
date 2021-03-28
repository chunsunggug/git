var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

function templateHTML(qid, list, body, control) {
  //   return `<!doctype html>
  // <html>
  // <head>
  //   <title>WEB1 - ${qid}</title>
  //   <meta charset="utf-8">
  // </head>
  // <body>
  //   <h1><a href="/">WEB</a></h1>
  //   ${list}
  //   ${control}
  //   ${body}
  // </body>
  // </html>
  //   `;

  return `
  <!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Image Example</title>
<style>
.top {
  position: relative;
  top: 10%;
  width: 100%;
}
.top button{
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
    <header class="top">
      <button type="button" onclick="javascript:location.replace('/admin')">Image Add</button>
    </header>
    <main class="main">
      <div class="container">
          <div><img src="coding.jpg" width="150px;" height="200px;"></div>
          <div style="background-color: green;"></div>
          <div style="background-color: blue;"></div>
      </div>
    </main>
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
      <form action="/addimage" method="get">
      <input type="text" name="title"><br>
      <textarea placeholder="이미지 설명" name="description"></textarea><br>
      <input type="submit">
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
      var description = post.description;
      console.log(title, description);
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
  } else if (pathname === "/admin") {
    url = "/admin.html";
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
  } else if (pathname === "/addimage") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(5000);
