var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser"),
    moment              = require("moment-timezone"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer");
//APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
moment.locale();

//MONGOOSE/MODEL CONFIG
var blogSchema  = new mongoose.Schema({
                    title: String,
                    image: String,
                    body: String,
                    created: {type: String, default: moment().tz("America/Los_Angeles").format("l, LT z")}
                    }),
    Blog        = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error !");
        } else {
            console.log("All blogs found !");
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create({
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body
    }, function(err, blog){
        if(err){
            console.log("Error !");
        } else {
            console.log("Created New Blog !");
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log("Error !");
        } else {
            console.log(blog);
            res.render("show", {blog: blog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log("Error !");
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
            console.log("ERROR !");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
        if(err){
            console.log("ERROR !");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started !");
});
