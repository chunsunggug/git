const express = require("express");
const app = express();
var dbinfo = `mongodb+srv://mongoBoard:5613qwer@mongodbboard.mt86v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log("dbinfo :" + dbinfo);
app.set("view engine", "ejs"); //1
app.use(express.static(__dirname + "/public")); // 2

app.get("/hello", function (req, res) {
  res.render("hello", { name: req.query.nameQuery });
});

app.get("/hello/:nameParam", function (req, res) {
  // 3
  res.render("hello", { name: req.params.nameParam });
});

var port = 3000; // 사용할 포트 번호를 port 변수에 넣습니다.
app.listen(port, function () {
  console.log(__dirname);
  // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log("server on! http://localhost:" + port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});
