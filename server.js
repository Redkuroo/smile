//REST API demo in Node.js
var express = require('express'); // requre the express framework
var app = express();
var fs = require('fs'); //require file system object
let userData = require("./employee.json");
// Endpoint to Get a list of users
app.get('/getUsers', function(req, res){
    fs.readFile(__dirname + "/" + "employee.json", 'utf8', function(err, data){
        console.log(data);
        res.end(data); // you can also use res.send()
    });
})

// Create a server to listen at port 8080
var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})

var user = {
    "user6": {
        "id":6, 
        "company":"Jobee", 
        "nameofemployee":"6", 
        "position":"CEO", 
        "location":"Davao" 
      },
} 

//The addUser endpoint

app.post('/addUser', function(req, res){
  
    fs.readFile(__dirname + "/" + "employee.json", 'utf8', function(err, data){
        if (err) {
            console.error(err);
            return;
        }
        data = JSON.parse(data);

       
        data["user6"] = user["user6"];
        console.log(data);

       
        fs.writeFile(__dirname + "/" + "employee.json", JSON.stringify(data), 'utf8', function(err){
            if (err) {
                console.error(err);
                return;
            }
            console.log('User added and data saved to employee.json');
        });

        res.end(JSON.stringify(data));
    });
});

//Endpoint to get a single user by id
app.get('/:id', function (req, res) {
    // First retrieve existing user list
    fs.readFile( __dirname + "/" + "employee.json", 'utf8', function (err, data) {
       var users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
    });
 })

 app.get('/getByEmployeeName/:nameOfEmployee', function (req, res) {
    
    fs.readFile(__dirname + "/" + "employee.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);

        
        for (var key in users) {
            if (users[key].nameofemployee === req.params.nameOfEmployee) {
                console.log(users[key]);
                return res.end(JSON.stringify(users[key]));
            }
        }
    });
});

 //Code to delete a user by id
 var id = 3;
 app.delete('/deleteUser', function (req, res) {
    // First retrieve existing users
    fs.readFile( __dirname + "/" + "employee.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 3];
        
       console.log( data );
       res.end( JSON.stringify(data));
    });
 })

 // PUT method to update a user by id
app.put('/updateUser/:id', function (req, res) {

    var userId = "user" + req.params.id;


    var updatedUserData = req.body;

 
    if (!userData[userId]) {
        return res.status(404).json({ error: "User not found" });
    }

   
    userData[userId] = updatedUserData;

    fs.writeFile(__dirname + "/" + "employee.json", JSON.stringify(userData, null, 4), 'utf8', function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update user." });
        }
        console.log('User updated and data saved to employee.json');
        res.json(userData);
    });
});
