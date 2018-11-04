var express = require("express");
var app =  express();
var path = require('path');

var port = process.env.PORT || 2000;


app.use(express.static(path.join(__dirname ,'jsGamefiles')));
app.use(express.static(path.join(__dirname,'libs')));

app.get('/', function(req, res){
    
    res.sendFile(path.join(__dirname + '/index.html'));
    
})

//Listining
app.listen(port, () => {
    console.log("Server is up");
})