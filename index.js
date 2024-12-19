const express = require("express");
const app = express();

const dotenv = require("dotenv");
const { createUser, createTable } = require("./models/userModel");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));  

app.set('view engine','ejs');

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Hello World");    
});

app.get("/test", (req,res)=>{
    const user = {
        name: "John",
        email:"John@gmail.com", 
        createdAt: "test",
        id: 1
    }
    res.render('profile',{user});
})

app.get("/test2", (req,res)=>{
    createTable();
    res.send("Table Created");
})

const port = process.env.PORT || 3000;

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});