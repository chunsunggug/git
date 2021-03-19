var fs = require("fs");
//readFileSync

/*
console.log("A");
var result = fs.readFileSync("no2/syntax/sample.txt", "utf8");
console.log(result);
console.log("C");
*/

console.log("A");
fs.readFile("no2/syntax/sample.txt", "utf8", function (err, result) {
  console.log(result);
});
console.log("C");
