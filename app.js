const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-us", options);
    console.log(day);
    res.render("list", { dayH: day, newItemsH: items });
});

app.post("/", function (req, res) {
    var item = req.body.newTodo;
    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        console.log(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("list", {
        dayH: "Work",
        newItemsH: workItems
    });
});

app.post("/work", function (req, res) {

});

app.listen(3000, function () {
    console.log("Sever is listening at port 3000");
}); 