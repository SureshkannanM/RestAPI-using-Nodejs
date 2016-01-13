
var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var mongoOp     =   require("./db/mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static('views'));

router.get("/",function(req,res){
  //  res.json({"message" : "Hello World"});
     res.sendFile( __dirname + "/views/" + "home.htm" );
});

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({"userPassword":"sureshkannan"},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    }).post(function(req,res){
        var db = new mongoOp();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.userEmail = req.body.email;
        console.log(req.body.email);
        console.log(req.body.password);
        // Hash the password using SHA1 algorithm.
        db.userPassword =  req.body.password;

        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"message" : "Data added"};
            }
            res.json(response);
        });
    });

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
