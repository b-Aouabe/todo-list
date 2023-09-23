const express = require("express")
const bodyParser = require("body-parser")
const _ = require('lodash')

//requiring our own module that we made to do some logic with the date object:
const date = require(__dirname + "/date.js")

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://bob02:YNLy0OuGvi4q67Mm@items.adycn66.mongodb.net/?retryWrites=true&w=majority')
//pswrd : YNLy0OuGvi4q67Mm

//create item schema :
const itemSchema = new mongoose.Schema({
    title: String,
})

const Item = mongoose.model('item', itemSchema)

//create List schema :
const listSchema = new mongoose.Schema({
    name: String,
    items:[itemSchema]
})

const List = mongoose.model('list', listSchema)

const item1 = new Item({title: 'wake up at 6 am'})
const item2 = new Item({title: 'go to gym'})
const item3 = new Item({title: 'go to work'})
const defaultTasks = [item1, item2, item3]



const app = express()

// let newTasks = ["Go to gym", "Take a shower", "Eat a high calories meal", "Get to work"]
// let workTasks = []
// let nonNegotiables = ["Go to gym 4-5 times a week", "Take a shower everyday", "Eat 4 meals", "work 8 hours", "Avoid distractions"]



app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const day = date.getDate()

app.get("/Favicon.ico", (req, res) => {
    // Send a response to the browser indicating that there is no favicon.
    // You can also serve a custom favicon file if you have one.
    res.status(204).end();
});

app.get("/", (req, res)=>{

    Item.find({})
    .then((foundItems) => {
            res.render("list", {listTitle: day, tasks: foundItems})
        }
    )
    .catch((err) => {
      console.error(err);
    });

    // const days = ["Sunday", "monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    // const day = days[now.getDay()]
    // if(now.getDay() === 0 || now.getDay === 6){
    //     res.write("<h1>Yeeey it's weekend</h1>")
    // }else{
    //     res.write("<h1>It's not the weekend</h1>")
    // }
    // res.write("<p>we have work to do anyway</p>")

    // res.render("list", {listTitle: day, tasks: nonNegotiables})
})

// Function to delete a document by a specific field value
async function deleteDocumentByField(fieldName, valueToDelete) {
    // Use the Mongoose model to find and delete the document
    const result =  await Item.deleteOne({ [fieldName]: valueToDelete });

    if (result.deletedCount === 1) {
        console.log(`Document with ${fieldName}: ${valueToDelete} deleted successfully.`);
    } else {
        console.log(`No document found with ${fieldName}: ${valueToDelete}. Nothing deleted.`);
    }
}

// Function to insert a document by a specific field value
async function insertElement(valueToAdd ) {
    Item.insertMany({title: valueToAdd})
    .then(insertedItems =>{
        console.error(insertedItems)
    })
}

app.post("/", (req,res)=>{
    const taskName = req.body.addedTask
    const listName = req.body.list

    const item = new Item({
        title: taskName
    })
    if(listName === day){
        item.save()
        res.redirect('/')
    }else{
        List.findOne({name: listName})
            .then(foundList=>{
                if(foundList){
                    foundList.items.push(item)
                    foundList.save()
                            .then(savedList=>{
                                res.redirect('/' + savedList.name)
                    })
                }
            })
    }
    // if(req.body.list === "Work List"){
    //     workTasks.push(newTask)
    //     res.redirect("/work")
    // }else{
    //     newTasks.push(newTask)
    //     res.redirect("/")
    // }
})



app.post("/delete", (req,res)=>{
    const id = req.body.delTask
    const list = req.body.list
    
    if(list === day){
        deleteDocumentByField("_id", id)
        setTimeout(()=>{res.redirect('/')}, 500)
    }else{
        List.updateOne({name: list}, {$pull: {items: {_id: id}}})
            .exec()
            .then(result => {
                console.log("Item deleted successfully.");
                res.redirect("/" + list); // Redirect to the list's page
            }).catch(err=>{
                console.error(err);
                res.status(500).send("An error occurred while deleting the item.");
            })
        }
    
    

    
    // const del = Item.deleteMany({});
    // console.log(`heeellooo : ${del}`)
//     try {
//     const delId = req.body.delTask;
//     Item.deleteOne({ "_id" :delId});
//     console.log(`Deleted item with title: ${delId}`);
//     res.redirect('/')
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error'); // Handle errors appropriately
//   }
})

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName);

    List.findOne({ name: customListName })
        .then(foundlist => {
            if (!foundlist) {
                const list = new List({
                    name: customListName,
                    items: []
                });
                return list.save();
            } else {
                res.render("list", { listTitle: foundlist.name, tasks: foundlist.items });
            }
        })
        .then(savedList => {
            if (savedList) {
                res.redirect('/' + customListName);
            }
        })
        .catch(err => {
            console.error(err);
            // Handle errors appropriately, e.g., sending an error response.
            res.status(500).send("An error occurred.");
        });
});

app.get("/about", (req, res)=>{
    res.render("about")
})



app.listen(3000, ()=>{
    console.log("server listening on port 3000")
})

