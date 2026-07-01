//create the database from signup
const express = require('express');
const app=express();
const path=require('path');
//mysql connextion
const mysql=require('mysql2');
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"acubill",
    password:"rishi123"
});

const {v4:uuidv4}=require('uuid');
uuidv4();


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const port=3000;


app.listen(port,(req,res)=>{

console.log("app starting");
});
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.get("/signin",(req,res)=>{
    res.render("signin.ejs",{error:""});
});

app.post("/signup",(req,res)=>{
let {firstname,lastname,email,password}=req.body;
let id=uuidv4();
console.log(id);
let name= firstname+" "+lastname;
connection.query("INSERT INTO USERS VALUES(?,?,?,?)",[id,name,email,password],(err,result)=>{
    console.log("added succeafully");
});
res.redirect("/setup");
});

app.post("/signin",(req,res)=>{

let {email,password}=req.body;
connection.query("SELECT * FROM USERS WHERE EMAIL=?",[email],(err,result)=>{
if (err) throw err;
if(result.length==0){
    res.render("signin",{error:"email not found"});
}
else{
    if (password==result[0].password){
        res.send("correct password");
    }
    else{
        res.render("signin.ejs",{error:"wrong password"});
    }
}
})
})

app.get("/setup",(req,res)=>{
    res.render("setup.ejs");
})