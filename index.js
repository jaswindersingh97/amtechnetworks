const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));  

app.set('view engine','ejs');
app.use(express.static('public'));

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  });  

app.get("/helloworld", (req, res) => {
    res.send("Hello World");    
});


const authRoutes = require("./endpoints/authRoutes");
app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});