const express = require("express")
const bodyParser = require("body-parser")

//requiring our own module that we made to do some logic with the date object:
const date = require(__dirname + "/date.js")

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://bob02:YNLy0OuGvi4q67Mm@items.adycn66.mongodb.net/?retryWrites=true&w=majority')
//pswrd : YNLy0OuGvi4q67Mm

const itemSchema = new mongoose.Schema({
    title: String,
})

const Item = mongoose.model('item', itemSchema)

const item1 = new Item({title: 'wake up at 6 am'})
const item2 = new Item({title: 'go to gym'})
const item3 = new Item({title: 'go to work'})
const defaultTasks = [item1, item2, item3]



const app = express()

let newTasks = ["Go to gym", "Take a shower", "Eat a high calories meal", "Get to work"]
let workTasks = []
let nonNegotiables = ["Go to gym 4-5 times a week", "Take a shower everyday", "Eat 4 meals", "work 8 hours", "Avoid distractions"]



app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", (req, res)=>{
    const day = date.getDate()

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
async function insertElement(valueToAdd) {
    Item.insertMany({title: valueToAdd})
    .then(insertedItems =>{
        console.error(insertedItems)
    })
}

app.post("/", (req,res)=>{
    const newTask = req.body.addedTask
    insertElement(newTask)
    res.redirect('/')
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

    deleteDocumentByField("_id", id)
    

    
    // const del = Item.deleteMany({});
    // console.log(`heeellooo : ${del}`)
    setTimeout(()=>{res.redirect('/')}, 500)
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

app.get("/work", (req, res)=>{
    res.render("list", {listTitle: "Work List", tasks: workTasks})
})

app.post("/work", (req, res)=>{
    let task = req.body.addedTask
    workTasks.push(newTask)
    res.redirect("/work")
})

app.get("/nonNegotiables", (req, res)=>{
    res.render("list", {listTitle: "Non negotiable daily tasks", tasks: nonNegotiables})
})

app.post("/nonNegotiables", (req, res)=>{
    let task = req.body.addedTask
    workTasks.push(newTask)
    res.redirect("/work")
})

app.get("/about", (req, res)=>{
    res.render("about")
})

app.listen(3000, ()=>{
    console.log("server listening on port 3000")
})

