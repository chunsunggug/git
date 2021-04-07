// index.js

// var express = require("express");
// var mongoose = require("mongoose");
// var app = express();
// const dbinfo = `mongodb+srv://mongoBoard:5613qwer@mongodbboard.mt86v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// // DB setting
// mongoose.set("useNewUrlParser", true); // 1
// mongoose.set("useFindAndModify", false); // 1
// mongoose.set("useCreateIndex", true); // 1
// mongoose.set("useUnifiedTopology", true); // 1
// mongoose.connect(dbinfo); // 2
// var db = mongoose.connection; //3
// //4
// db.once("open", function () {
//   console.log("DB connected");
// });
// //5
// db.on("error", function (err) {
//   console.log("DB ERROR : ", err);
// });

// // Other settings
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

// // Port setting
// var port = 3000;
// app.listen(port, function () {
//   console.log("server on! http://localhost:" + port);
// });

// index.js
const dbinfo = `mongodb+srv://mongoBoard:5613qwer@mongodbboard.mt86v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var methodOverride = require("method-override"); // 1
var app = express();

// DB setting
mongoose.set("useNewUrlParser", true); // 1
mongoose.set("useFindAndModify", false); // 1
mongoose.set("useCreateIndex", true); // 1
mongoose.set("useUnifiedTopology", true); // 1
mongoose.connect(dbinfo); // 2
var db = mongoose.connection; //3
//4
db.once("open", function () {
  console.log("DB connected");
});
//5
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({ extended: true })); // 3
app.use(methodOverride("_method")); // 2
// DB schema // 4
// var contactSchema = mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   email: { type: String },
//   phone: { type: String },
// });
// var Contact = mongoose.model("contact", contactSchema); // 5

// // Routes
// // Home // 6
// app.get("/", function (req, res) {
//   res.redirect("/contacts");
// });
// // Contacts - Index // 7
// app.get("/contacts", function (req, res) {
//   Contact.find({}, function (err, contacts) {
//     if (err) return res.json(err);
//     res.render("contacts/index", { contacts: contacts });
//   });
// });
// // Contacts - New // 8
// app.get("/contacts/new", function (req, res) {
//   res.render("contacts/new");
// });
// // Contacts - create // 9
// app.post("/contacts", function (req, res) {
//   Contact.create(req.body, function (err, contact) {
//     if (err) return res.json(err);
//     res.redirect("/contacts");
//   });
// });
// // Contacts - show // 3
// app.get("/contacts/:id", function (req, res) {
//   console.log("id 시발");
//   Contact.findOne({ _id: req.params.id }, function (err, contact) {
//     if (err) return res.json(err);
//     res.render("contacts/show", { contact: contact });
//   });
// });
// // Contacts - edit // 4
// app.get("/contacts/:id/edit", function (req, res) {
//   Contact.findOne({ _id: req.params.id }, function (err, contact) {
//     if (err) return res.json(err);
//     res.render("contacts/edit", { contact: contact });
//   });
// });
// // Contacts - update // 5
// app.put("/contacts/:id", function (req, res) {
//   Contact.findOneAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     function (err, contact) {
//       if (err) return res.json(err);
//       res.redirect("/contacts/" + req.params.id);
//     }
//   );
// });
// // Contacts - destroy // 6
// app.delete("/contacts/:id", function (req, res) {
//   Contact.deleteOne({ _id: req.params.id }, function (err) {
//     if (err) return res.json(err);
//     res.redirect("/contacts");
//   });
// });
// Routes
app.use("/", require("./routes/home")); // 1
app.use("/contacts", require("./routes/contacts")); // 2

// Port setting ...
var port = 5000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
