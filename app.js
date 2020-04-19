const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// var items = ["Buy Food", "Cook Food", "Eat Food"];
// var workItems = [];

const password = "qPqiwx30JMeOf5xA";
const mongoAtlasUrl = "mongodb+srv://admin-devsinghindra:" + password + "@cluster0-6mebu.mongodb.net/";
mongoose.connect(mongoAtlasUrl + "todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

// const listScema=new mongoose.Schema({
//     name : String,
//     items : [itemsSchema]
// });

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your todo list!"
});

const item2 = new Item({
    name: "To add an item press +"
});

const item3 = new Item({
    name: "To delete an item tick the checkbox"
});

const defaultItems = [item1, item2, item3];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    Item.find(function (err, items) {
        if (items.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success in / route");
                }
            })
            res.redirect("/");
        }
        else {
            if (err) {
                console.log(err);
            } else {
                res.render("list", { listNameH: "Today", newItemsH: items });
            }
        }
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newTodo;
    const listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });
    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            if (err) {
                console.log("error list not found")
            } else {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + foundList.name);
            }
        });
    }
});

app.post("/delete", function (req, res) {
    // console.log(req.body.checkbox);
    const checkedBoxId = req.body.checkbox;
    const listName = req.body.list;
    if (listName === "Today") {
        Item.findByIdAndDelete(checkedBoxId, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("deleted item by id " + checkedBoxId);
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedBoxId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, function (err, foundList) {
        if (err) {
            console.log("error exist");
        } else {
            if (foundList == null) {
                // console.log(" exists");
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + list.name);
            }
            else {
                // console.log("exist")
                res.render("list", { listNameH: foundList.name, newItemsH: foundList.items })
            }
        }
    });

})

app.listen(3000, function () {
    console.log("Server is listening at port 3000");
});